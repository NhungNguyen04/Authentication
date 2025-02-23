"use client"
import Link from "next/link";
import { Button } from "../ui/button"

import React from 'react'

interface BackButtonProps {
    href: string;
    label: string;
}

export default function BackButton({href, label}: BackButtonProps) {
  return (
    <Button
        variant='link'
        className="font-normal w-full"
        size='sm'
        asChild
    >
        <Link href={href}>
            {label}
        </Link>
    </Button>
  )
}
