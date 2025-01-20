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
import { Button } from '../ui/button'
import { FormError } from '../form-error'
import { FormSuccess } from '../form-success'
import { reset } from '@/actions/reset'
import { useTransition } from 'react'
import { ResetSchema } from '@/schemas'

export default function ResetForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = React.useState<string | undefined>(undefined)
  const [success, setSuccess] = React.useState<string | undefined>(undefined)

  const form = useForm<z.infer<typeof ResetSchema>>({
    resolver: zodResolver(ResetSchema),
    defaultValues: {
      email: '',
    }
  })

  const onSubmit = (values: z.infer<typeof ResetSchema>) => {
    startTransition(
      () => reset(values).then((data)=> {
        setError(data?.error)
        setSuccess(data?.success)
      }))
  }

  return (
    <CardWrapper
      headerLabel='Forgot your password?'
      backButtonLabel='Back to login'
      backButtonHref='/auth/login'>
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
          </div>
          {error && (<FormError message={error}/>)}
          {success && (<FormSuccess message={success}/>)}
          <Button
            type='submit'
            className='w-full'
            disabled={isPending}
          >Send reset email</Button>
        </form>
      </Form>
    </CardWrapper>
  )
}
