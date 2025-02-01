'use client'

import { useState } from 'react'
import PublicRoute from '@/components/PublicRoute'
import { useUserStore } from '@/store/userStore'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { UserInfo } from '@/store/userStore'
import { Button } from '@/components/ui/button'

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

    localStorage.setItem('guestMode', 'true')
    setUserInfo(guestUser as unknown as UserInfo)
    router.push('/dashboard')
  }

  return (
    <PublicRoute>
      <div className="min-h-screen flex flex-col items-center justify-center gap-8">
        <h1 className="text-6xl font-bold text-white">42tools</h1>
        <div className="flex flex-col gap-6 items-center">
        <Button
          onClick={handleLogin}
          disabled={isLoading}
          className="bg-black border border-white hover:bg-white-700 text-white font-bold py-2 px-4 rounded flex items-center gap-2 transition duration-500 ease-in-out hover:scale-110"
        >
          <Image src="/logo.png" alt="42 logo" className="w-6 h-6 invert text-white" width={24} height={24} />
          {isLoading ? 'Connexion en cours...' : 'Se connecter avec 42'}
        </Button>
        <a
          onClick={handleGuestLogin}
          className="text-white cursor-pointer underline-animation"
          style={{ width: 'fit-content' }}
        >
          Mode invité
        </a>
        </div>
        <p className="mt-4 text-gray-400 text-sm absolute bottom-0 left-0 right-0 text-center mb-4">by mlangloi</p>
      </div>
    </PublicRoute>
  )
}