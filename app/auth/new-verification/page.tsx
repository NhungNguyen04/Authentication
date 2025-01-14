import NewVerificationForm from '@/components/auth/new-verification-form'
import React, { Suspense } from 'react'

function NewVerificationPage() {
  return (
    <div>
      <Suspense>
      <NewVerificationForm/>
      </Suspense>
    </div>
  )
}

export default NewVerificationPage
