import React from "react";
import Navbar from "./_components/navbar";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

const ProtectedLayout = ({children}: ProtectedLayoutProps) => {
  return (
    <div className="h-full overflow-auto w-full flex flex-col gap-y-10 items-center justify-center bg-yellow-100 pt-10">
      <Navbar/>
      {children}
    </div>
  )
}

export default ProtectedLayout;