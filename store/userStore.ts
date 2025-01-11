import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UserInfo {
  id: number
  login: string
  email: string
  usual_full_name: string
  image: {
    link: string
  }
  cursus_users: Array<{
    cursus_id: number
    level: number
  }>
  projects_users: Array<{
    project: {
      id: number
      name: string
      slug: string
      solo: boolean
    }
    status: string
    validated?: boolean
    final_mark: number
  }>
  events: Array<{
    event_type: string
  }>
  internships: Array<any>
}

interface UserStore {
  userInfo: UserInfo | null
  setUserInfo: (userInfo: UserInfo | null) => void
  fetchUserInfo: () => Promise<void>
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      userInfo: null,
      setUserInfo: (userInfo) => set({ userInfo }),
      fetchUserInfo: async () => {
        const token = localStorage.getItem('accessToken')
        if (!token) return

        try {
          const response = await fetch('https://api.intra.42.fr/v2/me', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })

          if (!response.ok) throw new Error('Erreur de récupération des données')

          const data = await response.json()
          set({ userInfo: data })
        } catch (error) {
          console.error('Erreur:', error)
          localStorage.removeItem('accessToken')
          throw error
        }
      },
    }),
    {
      name: 'user-storage',
    }
  )
)