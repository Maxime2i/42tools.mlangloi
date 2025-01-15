'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import PublicRoute from '@/components/PublicRoute'

export default function CallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const handleCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search)
      const code = urlParams.get('code')
      console.log('Code reçu:', code)

      if (code) {
        try {
          const response = await fetch('/api/auth/token', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code }),
          })

          if (!response.ok) {
            const errorData = await response.json()
            console.error('Erreur détaillée:', errorData)
            throw new Error(`Erreur lors de la récupération du token: ${errorData.error}`)
          }

          const data = await response.json()
          console.log('Données reçues:', data)
          
          if (data.access_token) {
            localStorage.setItem('accessToken', data.access_token)
            if (data.refresh_token) {
              localStorage.setItem('refreshToken', data.refresh_token)
            }
            router.push('/dashboard')
          } else {
            throw new Error('Token non reçu dans la réponse')
          }
        } catch (error) {
          console.error('Erreur lors de l\'authentification:', error)
          router.push('/')
        }
      }
    }

    handleCallback()
  }, [router])

  return (
    <PublicRoute>
      <div className="min-h-screen flex items-center justify-center">
        <p>Authentification en cours...</p>
      </div>
    </PublicRoute>
  )
}