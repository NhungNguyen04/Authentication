"use server"
import React from 'react'
import * as z from "zod";
import { NewPasswordSchema } from "@/schemas";
import { getPasswordResetTokenByToken } from '@/data/password-reset-token';
import { getUserByEmail } from '@/data/user';
import bcrypt from 'bcryptjs';
import { prisma } from '@/prisma/prisma';

export const newPassword = async (
  values: z.infer<typeof NewPasswordSchema>,
  token?: string | null
) => {
  if (!token) {
    return { error: "Missing token!" };
  }
  
  const validatedFields = NewPasswordSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: validatedFields.error };
  }

  const existingToken = await getPasswordResetTokenByToken(token);
  if (!existingToken) {
    return { error: "Invalid token!" };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();
  if (hasExpired) {
    return { error: "Token has expired!" };
  }

  const existingUser = await getUserByEmail(existingToken.email);
  if (!existingUser) {
    return { error: "Email does not exist!" };
  }

  const hashedPassword = await bcrypt.hash(values.password, 4);

  await prisma.user.update({
    where: {id: existingUser.id},
    data: {
      password: hashedPassword
    }
  })

  await prisma.passwordResetToken.delete({
    where: {id: existingToken.id}
  })

  return { success: "Password reset successfully!" };
}