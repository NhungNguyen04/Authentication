import React from 'react'

export default function AuthLayout({children}: {children: React.ReactNode}) {
  return (
    <div className='h-full flex items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))]
    from-cyan-600 to-neutral-300'>
      {children}
    </div>
  )
}
