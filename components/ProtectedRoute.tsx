'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUserStore } from '@/store/userStore'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { userInfo } = useUserStore()

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken')
    const isGuestMode = localStorage.getItem('guestMode')
    
    if (!accessToken && !isGuestMode) {
      router.push('/')
    }
  }, [router])

  if (!userInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
      </div>
    )
  }

  return <>{children}</>
}