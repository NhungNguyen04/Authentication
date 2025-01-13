"use server";
import z from 'zod';
import { RegisterSchema } from '@/schemas';
import bcrypt from 'bcryptjs';
import {prisma} from '@/prisma/prisma';
import { getUserByEmail } from '@/data/user';

export const register = async (values: z.infer<typeof RegisterSchema>) => {
    const validatedFields = RegisterSchema.safeParse(values);

    if (!validatedFields.success) {
        return {error: "Invalid fields!"};
    }

    const { email, password, name} = validatedFields.data;
    const hashedPassword = await bcrypt.hash(password, 4);

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
        return {error: "Email already exists!"};
    }

    await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            name
        }
    })

    return {success: "User created!"}
}