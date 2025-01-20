"use server";

import { ResetSchema } from '@/schemas';
import { z } from 'zod';
import { getUserByEmail } from '@/data/user';
import { generatePasswordResetToken } from '@/lib/token';
import { sendPasswordResetEmail } from '@/lib/mail';

export const reset = async (values: z.infer<typeof ResetSchema>) => {
 const validatedField = ResetSchema.parse(values);

 if (!validatedField.email) {
   return { error: 'Email is required' };
 }

 console.log("Email: ", validatedField.email);

 const existingUser = await getUserByEmail(validatedField.email);

 if (!existingUser) {
  return { error: "Email not found!"}
 }

 // TODO: Generate token & send email
 const passwordResetToken = await generatePasswordResetToken(validatedField.email);
 await sendPasswordResetEmail(passwordResetToken.email, passwordResetToken.token);

 return { success: "Reset email sent!"}
}