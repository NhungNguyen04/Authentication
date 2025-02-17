"use client"

import { admin } from '@/actions/admin';
import { RoleGate } from '@/components/auth/role-gate';
import { FormSuccess } from '@/components/form-success';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useCurrentRole } from '@/hooks/useCurrentRole'
import { UserRole } from '@prisma/client';
import { log } from 'console';
import React from 'react'
import { toast } from 'sonner';

const AdminPage = () => {

  const onServerActionClick = () => {
    admin()
      .then((data) => {
        if (data.error) {
          toast.error(data.error)
        }
        if (data.success) {
          toast.success(data.success)
        }
      })
  }

  const onApiRouteClick = () => {
    fetch('/api/admin')
      .then((response) => {
        if (response.ok) {
          toast.success("API CALLED SUCCESSFULLY");
        } else {
          toast.error("FORBIDDEN")
        }
      })
  }

  return (
    <Card className='w-[600px]'>
      <CardHeader className='text-2xl font-semibold text-center'>
        <p className='text-2xl font-semibold text-center'>
          🔑 Admin
        </p>
      </CardHeader>
      <CardContent className='space-y-4'>
        <RoleGate allowedRole={UserRole.ADMIN}>
          <FormSuccess message='You are allowed to see this cause you are an admin!' />
        </RoleGate>
        <div className='flex flex-row items-center justify-between rounded-lg border p-3 shadow-md'>
          <p className='text-sm font-medium'>
            Admin-only API route
          </p>
          <Button onClick={onApiRouteClick}>Click to test</Button>
        </div>

        <div className='flex flex-row items-center justify-between rounded-lg border p-3 shadow-md'>
          <p className='text-sm font-medium'>
            Admin-only Server
          </p>
          <Button onClick={onServerActionClick}>Click to test</Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default AdminPage
