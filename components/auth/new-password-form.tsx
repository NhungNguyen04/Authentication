"use client"
import React, {useCallback, useEffect, useState} from 'react'
import CardWrapper from './card-wrapper'
import {BeatLoader} from 'react-spinners'
import { useSearchParams } from 'next/navigation'
import { newVerification } from '@/actions/new-verification'
import { FormError } from '../form-error'
import { FormSuccess } from '../form-success'

function NewPasswordForm() {
  
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();

  const onSubmit = useCallback(() => {
    if (!token) {
      setError("Missing Token");
      return;
    }
    newVerification(token)
      .then((data) => {
        setSuccess(data.success);
        setError(data?.error);
      })
      .catch(() => {
        setError("Something went wrong!");
      });
  }, [token]);

  useEffect(()=> {
    onSubmit();
  }, [onSubmit])

  return (
    <CardWrapper
      headerLabel='Reset your password'
      backButtonHref='/auth/login'
      backButtonLabel='Back to login'>
        <div className='flex items-center w-full justify-center'>
          {!error && !success && (<BeatLoader  />)}
          {error && (<FormError message={error}/>)}
          {success && (<FormSuccess message={success}/>)}
        </div>
    </CardWrapper>
  )
}

export default NewPasswordForm
