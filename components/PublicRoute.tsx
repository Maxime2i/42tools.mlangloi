'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function PublicRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken')
    if (accessToken) {
      router.push('/dashboard')
    }
  }, [router])

  return <>{children}</>
}