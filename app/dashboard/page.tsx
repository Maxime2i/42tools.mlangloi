'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { useUserStore } from '@/store/userStore'

interface UserInfo {
  login: string
  email: string
  usual_full_name: string
  image: {
    link: string
  }
  campus: Array<{
    name: string
  }>
  pool_month: string
  pool_year: string
}

// Ajout de la fonction de traduction des mois
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

export default function DashboardPage() {
  const { userInfo, fetchUserInfo } = useUserStore()
  const router = useRouter()

  useEffect(() => {
    const initializeUserData = async () => {
      if (!localStorage.getItem('accessToken')) {
        router.push('/')
        return
      }

      try {
        await fetchUserInfo()
      } catch (error) {
        router.push('/')
      }
    }

    initializeUserData()
  }, [router, fetchUserInfo])

  if (!userInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Chargement...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white p-8 space-y-8">
      <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-300 to-gray-500">
        Dashboard
      </h1>
      
      <Card className="border-white/10 bg-zinc-900/50 backdrop-blur">
        <CardHeader className="border-b border-white/10">
          <CardTitle className="text-2xl font-light tracking-tight text-white">
            Informations utilisateur
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8 pt-6">
          <div className="space-y-6">
            <div className="flex items-center gap-4 pb-4 border-b border-white/5 hover:border-white/20 transition-colors">
              <Avatar className="w-16 h-16">
                <AvatarImage src={userInfo.image.link} />
                <AvatarFallback>{userInfo.usual_full_name.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium text-white">{userInfo.usual_full_name}</h3>
                <p className="text-sm text-gray-400">{userInfo.login}</p>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                <span className="text-white">{userInfo.cursus_users[userInfo.cursus_users.length - 1]?.level || 'Non spécifié'}</span>
              </div>
              <Progress value={84} className="h-2 bg-white/10" />
            </div>

            <div className="space-y-4">
              <h4 className="text-sm text-gray-400">Derniers projets</h4>
              {userInfo.projects_users
                ?.sort((a, b) => new Date(b.marked_at).getTime() - new Date(a.marked_at).getTime())
                .slice(0, 3)
                .map((project, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-sm text-white">{project.project.name}</span>
                    <Badge 
                      variant="outline" 
                      className={`border-white/20 ${
                        project?.["validated?"] ? 'text-emerald-400' : 'text-red-400'
                      }`}
                    >
                      {project.final_mark}/100
                    </Badge>
                  </div>
                ))}
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
                ?.filter(skill => skill.level > 0)
                .sort((a, b) => b.level - a.level)
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


      </div>
    </div>
  )
}
