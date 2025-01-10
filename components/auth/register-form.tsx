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
import { RegisterSchema } from '@/schemas'
import { Button } from '../ui/button'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { FormError } from '../form-error'
import { FormSuccess } from '../form-success'
import { register } from '@/actions/register'
import { useTransition } from 'react'

export default function RegisterForm() {

  const [viewPassword, setViewPassword] = React.useState(false)
  const [isPending, startTransition] = useTransition();
  const [error, setError] = React.useState<string | undefined>(undefined)
  const [success, setSuccess] = React.useState<string | undefined>(undefined)

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: '',
      password: '',
    }
  })

  const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
    startTransition(
      () => register(values).then((data)=> {
        setError(data.error)
        setSuccess(data.success)
      }))
  }

  return (
    <CardWrapper
      headerLabel='Create an account'
      backButtonLabel='Already have an account?'
      backButtonHref='/auth/login'
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
            {/* Name field */}
             <FormField
              control={form.control}
              name="name"
              render={({field})=>
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                  {...field}
                  placeholder="Your name"
                  type="string"
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
          {success && (<FormSuccess message={success}/>)}
          <Button
            type='submit'
            className='w-full'
            disabled={isPending}
          >Register</Button>
        </form>
      </Form>
    </CardWrapper>
  )
}
