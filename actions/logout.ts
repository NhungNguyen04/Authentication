"use client"
import { signOut } from "next-auth/react";

export const logout = async () => {
  await signOut({
    callbackUrl: "/auth/login",
    redirect: true
  });
}