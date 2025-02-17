"use server"
import * as z from "zod";
import { SettingsSchema } from "@/schemas";
import { getUserByEmail, getUserById } from "@/data/user";
import bcrypt from "bcryptjs"
import currentUser from "@/lib/auth";
import { prisma } from "@/prisma/prisma";
import { generateVerificationToken } from "@/lib/token";
import { sendVerificationEmail } from "@/lib/mail";

export const settings = async (
  values: z.infer<typeof SettingsSchema>
) => {
  const user = await currentUser();
  if (!user || !user.id) {
    return { error: "Unauthorized!" };
  }

  const dbUser = await getUserById(user.id);
  if (!dbUser) {
    return { error: "User not found!" };
  }

  if (user.isOAuth) {
    values.email = undefined;
    values.password = undefined;
    values.newPassword = undefined;
    values.isTwoFactorEnabled = undefined;
  }

  if (values.email && values.email !== user.email) {
    const existingUser = await getUserByEmail(values.email)

    if (existingUser) {
      return { error: "Email already exists!" }
    }

    const verificationToken = await generateVerificationToken(values.email);
    await sendVerificationEmail(verificationToken.email, verificationToken.token);

    return { success: "Email verification sent!" };
  }

  if (values.password && values.newPassword && dbUser.password) {
    
    const passwordMatch = await bcrypt.compare(values.password, dbUser.password);
    if (!passwordMatch) {
      return { error: "Current password does not match!" }
    }

    const hashedPassword = await bcrypt.hash(values.newPassword, 4);
    values.password = hashedPassword;
    values.newPassword = undefined;
  }

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      ...values
    },
  })

  return { success: "Data updated!" };
}