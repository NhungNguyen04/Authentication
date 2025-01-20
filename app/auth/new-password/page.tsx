import React from 'react'
import { Suspense } from 'react'
import NewPasswordForm from '@/components/auth/new-password-form'


function NewPasswordPage() {
  return (
    <div>
      <Suspense>
      <NewPasswordForm/>
      </Suspense>
    </div>
  )
}

export default NewPasswordPage