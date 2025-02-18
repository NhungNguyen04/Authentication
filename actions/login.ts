"use server";
import { AuthError } from 'next-auth';
import { signIn } from '@/auth';
import { LoginSchema } from '@/schemas';
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';
import { z } from 'zod';
import { getUserByEmail } from '@/data/user';
import { generateVerificationToken, generateTwoFactorToken } from '@/lib/token';
import { sendVerificationEmail, sendTwoFactorTokenEmail } from '@/lib/mail';
import { getTwoFactorTokenByEmail } from '@/data/two-factor-token';
import { prisma } from '@/prisma/prisma';
import { getTwoFactorConfirmationByUserId } from '@/data/two-factor-confirmation';
import { compare } from 'bcryptjs';

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, password, code } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser || !existingUser.email || !existingUser.password) {
    return {error: "Email does not exist!"}
  }

  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(existingUser.email);
    await sendVerificationEmail(verificationToken.email, verificationToken.token)
    return {success: "Confirmation email sent!"}
  }

  // First verify the password
  const passwordsMatch = await compare(password, existingUser.password);
  if (!passwordsMatch) {
    return { error: "Invalid credentials!" };
  }

  if (existingUser.isTwoFactorEnabled && existingUser.email) {
    if (code) {
      const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);
      if (!twoFactorToken || twoFactorToken.token !== code) {
        return { error: "Invalid code!" }
      }

      const hasExpired = new Date(twoFactorToken.expires) < new Date();
      if (hasExpired) {
        return { error: "Code has expired!" }
      }

      // Delete the token first
      await prisma.twoFactorToken.delete({
        where: { id: twoFactorToken.id }
      });

      // Update 2FA confirmation
      const existingConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);
      if (existingConfirmation) {
        await prisma.twoFactorConfirmation.delete({
          where: { id: existingConfirmation.id }
        });
      }
      
      await prisma.twoFactorConfirmation.create({
        data: { userId: existingUser.id }
      });
    } else {
      const twoFactorToken = await generateTwoFactorToken(existingUser.email);
      await sendTwoFactorTokenEmail(twoFactorToken.email, twoFactorToken.token);
      return { twoFactor: true }
    }
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Something went wrong!" };
    }
    throw error;
  }
}