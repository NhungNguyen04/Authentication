import { Poppins } from "next/font/google";
import {cn} from '@/lib/utils'
import { Button } from "@/components/ui/button";
import { LoginButton } from "@/components/auth/login-button";

const font = Poppins ({
  subsets: ['latin'],
  weight: ["600"]
});

export default async function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center 
    bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))]
    from-cyan-600 to-neutral-300">
      <div className="space-y-6 text-center">
        <h1 className={cn("text-6xl font-semibold text-white drop-shadow-md",
          font.className
        )}> 🔐 Auth</h1>
        <p className="text-white text-lg">
          A simple authentication service
        </p>
        <div className="flex items-center justify-center">
          <LoginButton >
            <Button variant="secondary" size="lg">Sign in</Button>
          </LoginButton>
        </div>
      </div>
    </main>
  );
}
