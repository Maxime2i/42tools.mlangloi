'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface UserInfo {
  login: string
  email: string
}

export default function DashboardPage() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem('accessToken')
      
      if (!token) {
        router.push('/')
        return
      }

      try {
        const response = await fetch('https://api.intra.42.fr/v2/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des informations')
        }

        const data = await response.json()
        setUserInfo(data)
      } catch (error) {
        console.error('Erreur lors de la récupération des informations:', error)
        localStorage.removeItem('accessToken')
        router.push('/')
      }
    }

    fetchUserInfo()
  }, [router])

  if (!userInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Chargement...</p>
      </div>
    )
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl mb-4">Informations utilisateur</h2>
        <p>Login: {userInfo.login}</p>
        <p>Email: {userInfo.email}</p>
      </div>
    </div>
  )
}
