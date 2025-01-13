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
import { login } from '@/actions/login'
import { useTransition } from 'react'

export default function LoginForm() {

  const [viewPassword, setViewPassword] = React.useState(false)
  const [isPending, startTransition] = useTransition();
  const [error, setError] = React.useState<string | undefined>(undefined)
  const [success, setSuccess] = React.useState<string | undefined>(undefined)

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
                <FormMessage/>
              </FormItem>
            }/>
          </div>
          {error && (<FormError message={error}/>)}
          <Button
            type='submit'
            className='w-full'
            disabled={isPending}
          >Login</Button>
        </form>
      </Form>
    </CardWrapper>
  )
}
