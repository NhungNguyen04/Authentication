"use client"

import React from 'react'
import CardWrapper from './card-wrapper'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '../ui/input'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { NewPasswordSchema } from '@/schemas'
import { Button } from '../ui/button'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { FormError } from '../form-error'
import { FormSuccess } from '../form-success'
import { useTransition } from 'react'
import { useSearchParams } from 'next/navigation'
import { newPassword } from '@/actions/new-password'

export default function NewPasswordForm() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token');

  const [viewPassword, setViewPassword] = React.useState(false)
  const [isPending, startTransition] = useTransition();
  const [error, setError] = React.useState<string | undefined>(undefined)
  const [success, setSuccess] = React.useState<string | undefined>(undefined)

  const form = useForm<z.infer<typeof NewPasswordSchema>>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: '',
    }
  })

  const onSubmit = (values: z.infer<typeof NewPasswordSchema>) => {
    newPassword(values, token).then((data)=> {
      setError(typeof data?.error === 'string' ? data.error : undefined)
      setSuccess(data?.success)
    })
  }

  return (
    <CardWrapper
      headerLabel='Reset your password'
      backButtonLabel='Back to login'
      backButtonHref='/auth/login'
      showSocial>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='space-y-6'>
          <div className='space-y-4'>
            {/* Password field */}
            <FormField
              control={form.control}
              name="password"
              render={({field})=>
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      placeholder='********'
                      type={viewPassword ? "text" : "password"}
                      disabled={isPending}
                    />
                    <div 
                      className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                      onClick={() => setViewPassword(!viewPassword)}
                    >
                      {viewPassword ? <FaEye/> : <FaEyeSlash/>}
                    </div>
                  </div>
                </FormControl>
                <FormMessage/>
              </FormItem>
            }/>
          </div>
          {error && (<FormError message={error}/>)}
          {success && (<FormSuccess message={success}/>)}
          <Button
            type='submit'
            className='w-full'
            disabled={isPending}
        >Reset password</Button>
        </form>
      </Form>
    </CardWrapper>
  )
}
