'use client'

import { useState } from 'react'
import PublicRoute from '@/components/PublicRoute'

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = () => {
    setIsLoading(true)
    
    const client_id = process.env.NEXT_PUBLIC_42_CLIENT_ID
    const redirect_uri = process.env.NEXT_PUBLIC_42_REDIRECT_URI
    const scope = 'public'
    
    const authUrl = `https://api.intra.42.fr/oauth/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=code&scope=${scope}`
    
    window.location.href = authUrl
  }

  return (
    <PublicRoute>
      <div className="min-h-screen flex items-center justify-center">
        <button
          onClick={handleLogin}
          disabled={isLoading}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center gap-2"
        >
          <img src="/42_logo.svg" alt="42 logo" className="w-6 h-6" />
          {isLoading ? 'Connexion en cours...' : 'Se connecter avec 42'}
        </button>
      </div>
    </PublicRoute>
  )
}