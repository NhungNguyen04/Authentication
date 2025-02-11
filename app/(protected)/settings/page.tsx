"use client"

import { useCurrentUser } from "@/hooks/useCurrentUser";
import { signOut } from "next-auth/react";

export default function SettingsPage() {
  const user = useCurrentUser();

  const onClick = () => {
    signOut({
      callbackUrl: "/auth/signin",
      redirect: true
    });
  }
    
  return (
    <div className="bg-white p-10 rounded-xl">
      <button onClick={onClick}>Sign out</button>
    </div>
  )
}
