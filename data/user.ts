import { prisma } from '@/prisma/prisma';

export const getUserByEmail = async (email: string) => {
    try {
       

        console.time('dbQuery');
        const user = await prisma.user.findUnique({
            where: { email },
            select: {
                id: true,
                email: true,
                name: true,
                password: true,
                emailVerified: true,
                isTwoFactorEnabled: true,
            }
        });
        console.timeEnd('dbQuery');

        return user;
    } catch (error) {
        console.error("Database error:", error);
        return null;
    }
};

export const getUserById = async (id: string) => {
    try {
        const user = await prisma.user.findUnique({where: {id}});
        return user;
    } catch (error) {
        return null;
    }
}