'use client'

import { useState } from 'react'
import PublicRoute from '@/components/PublicRoute'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = () => {
    setIsLoading(true)
    
    const client_id = process.env.NEXT_PUBLIC_42_CLIENT_ID
    const redirect_uri = process.env.NEXT_PUBLIC_42_REDIRECT_URI
    const scope = 'public'
    
    const authUrl = `https://api.intra.42.fr/oauth/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=code&scope=${scope}`
    
    // Replace window.location.href with router.push
    router.push(authUrl)
  }

  return (
    <PublicRoute>
      <div className="min-h-[90vh] flex flex-col items-center justify-center gap-8">
        <h1 className="text-6xl font-bold text-white">42tools</h1>
        <div className="flex flex-col gap-6 items-center">
        <div className="text-center mb-4">
          <div className="text-2xl mb-2">🚧 Site en maintenance 🚧</div>

          <div className="text-gray-400 mt-2">
            Temps estimé : entre 42 secondes et 42 jours
          </div>
        </div>
        <Button
          onClick={handleLogin}
          disabled={true}
          className="bg-black border border-white text-white font-bold py-2 px-4 rounded flex items-center gap-2 opacity-50 cursor-not-allowed transform rotate-3 hover:rotate-0 transition-all"
        >
          {isLoading ? (
            "Chargement..."
          ) : (
            "Connexion en vacances 🏖️"
          )}
        </Button>
        </div>
        <p className="mt-4 text-gray-400 text-sm absolute bottom-0 left-0 right-0 text-center mb-4">by <a href="https://github.com/Maxime2i" target='_blank' className="hover:text-white transition-colors">mlangloi</a></p>
      </div>
    </PublicRoute>
  )
}