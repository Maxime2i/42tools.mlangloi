'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { useUserStore } from '@/store/userStore'
import ProtectedRoute from '@/components/ProtectedRoute'
import { LogOut } from 'lucide-react'
import EventPieChart from '@/components/stats/EventPieChart'
import Link from 'next/link'

const translateMonth = (month: string): string => {
  const monthTranslations: { [key: string]: string } = {
    'january': 'Janvier',
    'february': 'Février',
    'march': 'Mars',
    'april': 'Avril',
    'may': 'Mai',
    'june': 'Juin',
    'july': 'Juillet',
    'august': 'Août',
    'september': 'Septembre',
    'october': 'Octobre',
    'november': 'Novembre',
    'december': 'Décembre'
  }
  return monthTranslations[month.toLowerCase()] || month
}

export default function AccueilPage() {
  const { userInfo, fetchUserInfo } = useUserStore()
  const router = useRouter()

  useEffect(() => {
    const initializeUserData = async () => {
      const accessToken = localStorage.getItem('accessToken')
      const isGuestMode = localStorage.getItem('guestMode')

      if (!accessToken && !isGuestMode) {
        router.push('/')
        return
      }

      if (!isGuestMode && !userInfo) {
        try {
          await fetchUserInfo()
        } catch (error) {
          console.error('Erreur:', error)
          router.push('/')
        }
      }
    }

    initializeUserData()
  }, [router, fetchUserInfo, userInfo])

  const handleLogout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('guestMode')

    useUserStore.getState().setUserInfo(null)

    router.push('/')
  }
  console.log(userInfo)

  if (!userInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <ProtectedRoute>
    <div className="min-h-screen bg-black text-white md:p-8 space-y-4 md:space-y-8">
      <h1 className="hidden md:block text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-300 to-gray-500">
        Accueil
      </h1>
      
      <Card className="border-white/10 bg-zinc-900/50 backdrop-blur">
        <CardHeader className="border-b border-white/10">
          <CardTitle className="text-2xl font-light tracking-tight text-white">
            Informations utilisateur
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8 pt-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/5 hover:border-white/20 transition-colors">
              <div className="flex items-center gap-4">
                <Link href={`https://profile.intra.42.fr/users/${userInfo.login}`}>
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={userInfo.image.link} />
                    <AvatarFallback>{userInfo.usual_full_name.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                </Link>

              <div className="flex flex-col items-start">
                <h3 className="font-medium text-white">{userInfo.usual_full_name}</h3>
                <p className="text-sm text-gray-400">{userInfo.login}</p>
              </div>
            </div>
              <div className="flex flex-col items-end">
                <span className="text-sm text-white">{userInfo.wallet} <span className="text-gray-400">₳</span></span>
                <span className="text-sm text-white">{userInfo.correction_point} <span className="text-gray-400">{userInfo.correction_point == 1 ? 'point de correction' : 'points de correction'}</span></span>
              </div>

            </div>
            <div className="flex justify-between items-center pb-4 border-b border-white/5 hover:border-white/20 transition-colors">
              <span className="text-gray-400">Email</span>
              <span className="font-medium text-white">{userInfo.email}</span>
            </div>
            <div className="flex justify-between items-center pb-4 border-b border-white/5 hover:border-white/20 transition-colors">
              <span className="text-gray-400">Campus</span>
              <span className="font-medium text-white">
                {userInfo.campus[userInfo.campus.length - 1]?.name || 'Non spécifié'}
              </span>
            </div>
            <div className="flex justify-between items-center pb-4 border-b border-white/5 hover:border-white/20 transition-colors">
              <span className="text-gray-400">Piscine</span>
              <span className="font-medium text-white">
                {translateMonth(userInfo.pool_month)} {userInfo.pool_year}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        <Card className="border-white/10 bg-zinc-900/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-2xl font-light tracking-tight text-white">
              Progression du cursus
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Niveau actuel</span>
                <span className="text-white">
                  {localStorage.getItem('guestMode') === 'true' 
                    ? '0.00'
                    : userInfo.cursus_users[userInfo.cursus_users.length - 1]?.level?.toFixed(2) || 'Non spécifié'
                  }
                </span>
              </div>
              <Progress value={localStorage.getItem('guestMode') === 'true' ? 0 : 84} className="h-2 bg-white/10" indicatorClassName="bg-gradient-to-r from-green-700 to-green-300" />
            </div>

            <div className="space-y-4">
              <h4 className="text-sm text-gray-400">Derniers projets</h4>
              {localStorage.getItem('guestMode') === 'true' ? (
                <div className="text-sm text-white">
                  Aucun projet réalisé
                </div>
              ) : (
                userInfo.projects_users
                  ?.sort((a, b) => new Date(b.marked_at).getTime() - new Date(a.marked_at).getTime())
                  .slice(0, 3)
                  .map((project, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="text-sm text-white">{project.project.name}</span>
                      <Badge 
                        variant="outline" 
                        className={`border-white/20 ${
                          project?.validated ? 'text-emerald-400' : 'text-red-400'
                        }`}
                      >
                        {project.final_mark}/100
                      </Badge>
                    </div>
                  ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-zinc-900/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-2xl font-light tracking-tight text-white">
              Compétences
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {userInfo.cursus_users[userInfo.cursus_users.length - 1]?.skills
                ?.sort((a, b) => b.level - a.level)
                .slice(0, 3)
                .map((skill, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-white">{skill.name}</span>
                    <Badge variant="outline" className="border-white/20 text-gray-400">
                      {skill.level.toFixed(2)}
                    </Badge>
                  </div>
                  <Progress 
                    value={Math.min(skill.level * 10, 100)} 
                    className="h-1.5 bg-white/10" 
                    indicatorClassName="bg-gradient-to-r from-green-700 to-green-300"
                  />
                </div>
              )) || <p className="text-sm text-gray-400">Aucune compétence disponible</p>}
            </div>
          </CardContent>
        </Card>


        <Card className="border-white/10 bg-zinc-900/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-2xl font-light tracking-tight text-white">
              Événements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <EventPieChart events={userInfo.events} />
          </CardContent>
        </Card>


      </div>
      <div className="pt-10 flex justify-center">
        <Button
          onClick={handleLogout}
          variant="destructive"
          className="flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          Se déconnecter
        </Button>
      </div>
      <div className="mt-16 text-center text-sm text-gray-400">
        <p>
          Si vous appréciez 42Tools, n&apos;hésitez pas à laisser une ⭐ sur{' '}
          <a 
            href="https://github.com/Maxime2i/42tools.mlangloi"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-gray-300 underline underline-offset-4"
          >
            GitHub
          </a>
        </p>
      </div>
    </div>
    </ProtectedRoute>
  )
}
