import Credentials from "next-auth/providers/credentials"
import type { NextAuthConfig } from "next-auth"
import { getUserByEmail } from "./data/user"
import bcrypt from 'bcryptjs'
import { LoginSchema } from "./schemas"
import Github from "next-auth/providers/github"
import Google from "next-auth/providers/google"


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
    }), 
    Github({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET
    }), 
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    })
  ],
} satisfies NextAuthConfig