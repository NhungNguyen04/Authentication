import Credentials from "next-auth/providers/credentials"
import type { NextAuthConfig } from "next-auth"
import { getUserByEmail } from "./data/user"
import bcrypt from 'bcryptjs'
import { LoginSchema } from "./schemas"


export default {
  providers: [
    Credentials({
      async authorize(credentials) {
        try {
          const { email, password } = await LoginSchema.parseAsync(credentials)
          const user = await getUserByEmail(email)          
          if (!user || !user.password) return null;

          const passwordsMatch = await bcrypt.compare(password, user.password);
          
          if (!passwordsMatch) return null;
          
          return user;
        } catch (error) {
          console.error("Auth error:", error)
          return null
        }
      }
    })
  ],
  pages: {
    signIn: '/auth/login',
  },
  debug: true, // Enable debug mode
} satisfies NextAuthConfig