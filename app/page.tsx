'use client'

import { useState } from 'react'
import PublicRoute from '@/components/PublicRoute'
import { useUserStore } from '@/store/userStore'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { setUserInfo } = useUserStore()

  const handleLogin = () => {
    setIsLoading(true)
    
    const client_id = process.env.NEXT_PUBLIC_42_CLIENT_ID
    const redirect_uri = process.env.NEXT_PUBLIC_42_REDIRECT_URI
    const scope = 'public'
    
    const authUrl = `https://api.intra.42.fr/oauth/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=code&scope=${scope}`
    
    window.location.href = authUrl
  }

  const handleGuestLogin = () => {
    // Créer un utilisateur invité fictif
    const guestUser = {
      login: 'guest',
      email: 'guest@example.com',
      usual_full_name: 'Utilisateur Invité',
      image: {
        link: '/guest-avatar.png'
      },
      campus: [{
        name: 'Campus Invité'
      }],
      pool_month: 'january',
      pool_year: '2025',
      cursus_users: [{
        cursus_id: 21,
        level: 0,
        skills: [
          { id: 1, name: 'Algorithms & AI', level: 0 },
          { id: 2, name: 'Rigor', level: 0 },
          { id: 3, name: 'Unix', level: 0 },
          { id: 4, name: 'Network & system administration', level: 0 },
          { id: 5, name: 'Object-oriented programming', level: 0 },
          { id: 6, name: 'Web', level: 0 },
          { id: 7, name: 'DB & Data', level: 0 },
          { id: 8, name: 'Technology integration', level: 0 },
          { id: 9, name: 'Security', level: 0 },
          { id: 10, name: 'Graphics', level: 0 }
        ]
      }],
      projects_users: []
    }

    // Stocker les informations de l'invité
    localStorage.setItem('guestMode', 'true')
    setUserInfo(guestUser)
    router.push('/dashboard')
  }

  return (
    <PublicRoute>
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <button
          onClick={handleLogin}
          disabled={isLoading}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center gap-2"
        >
          <img src="/logo.png" alt="42 logo" className="w-6 h-6" />
          {isLoading ? 'Connexion en cours...' : 'Se connecter avec 42'}
        </button>

        <button
          onClick={handleGuestLogin}
          className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded flex items-center gap-2"
        >
          Mode invité
        </button>
      </div>
    </PublicRoute>
  )
}