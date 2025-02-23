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
import { LoginSchema } from '@/schemas'
import { Button } from '../ui/button'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { FormError } from '../form-error'
import { FormSuccess } from '../form-success'
import { login } from '@/actions/login'
import { useTransition } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function LoginForm() {
  const searchParams = useSearchParams()
  const urlError = searchParams?.get('error') === "OAuthAccountNotLinked" ? "Email already in use with a different provider" : undefined
  const [viewPassword, setViewPassword] = React.useState(false)
  const [isPending, startTransition] = useTransition();
  const [error, setError] = React.useState<string | undefined>(undefined)
  const [success, setSuccess] = React.useState<string | undefined>(undefined)
  const [showTwoFactor, setShowTwoFactor] = React.useState(false)

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    }
  })

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    startTransition(
      () => login(values).then((data)=> {
        setError(data?.error)
        setSuccess(data?.success)
        if (data?.twoFactor) setShowTwoFactor(data?.twoFactor)
      }))
  }

  return (
    <CardWrapper
      headerLabel='Welcome Back!'
      backButtonLabel='Don’t have an account?'
      backButtonHref='/auth/register'
      showSocial>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='space-y-6'>
          <div className='space-y-4'>
            {/* Email field */}
            {!showTwoFactor && (<>
            <FormField
              control={form.control}
              name="email"
              render={({field})=>
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                  {...field}
                  placeholder="john.doe@example.com"
                  type="email"
                  disabled={isPending}
                  />
                </FormControl>
                <FormMessage/>
              </FormItem>
            }/>
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
                <Button
                  size="sm"
                  variant="link"
                  asChild
                  className='px-0'>
                  <Link href="/auth/reset">Forgot password?</Link>
                </Button>
                <FormMessage/>
              </FormItem>
            }/>
            </>)}
            {showTwoFactor && (
              <FormField
              control={form.control}
              name="code"
              render={({field})=>
              <FormItem>
                <FormLabel>Two Factor Code</FormLabel>
                <FormControl>
                  <Input
                  {...field}
                  placeholder="123456"
                  disabled={isPending}
                  />
                </FormControl>
                <FormMessage/>
              </FormItem>
            }/>
            )}
          </div>
          {error && (<FormError message={error}/>)}
          {urlError && (<FormError message={urlError}/>)}
          {success && (<FormSuccess message={success}/>)}
          <Button
            type='submit'
            className='w-full'
            disabled={isPending}
          >{showTwoFactor ? "Confirm" : "Login"}</Button>
        </form>
      </Form>
    </CardWrapper>
  )
}
