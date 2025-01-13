import LoginForm from '@/components/auth/login-form'
import React, { Suspense } from 'react'


export default function page() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
