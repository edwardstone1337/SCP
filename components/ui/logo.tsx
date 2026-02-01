'use client'

import Image from 'next/image'
import { cn } from '@/lib/utils/cn'

const SIZE_MAP = {
  sm: 32,
  md: 48,
  lg: 64,
} as const

type SizeKey = keyof typeof SIZE_MAP

export interface LogoProps {
  size?: SizeKey
  className?: string
}

export function Logo({ size = 'md', className }: LogoProps) {
  const dimension = SIZE_MAP[size]
  return (
    <Image
      src="/scp-logo.png"
      alt="SCP Foundation"
      width={dimension}
      height={dimension}
      className={cn('object-contain', className)}
    />
  )
}
