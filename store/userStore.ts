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
  lastUpdate: number | null
  lastManualRefresh: number | null
  setUserInfo: (userInfo: UserInfo | null) => void
  fetchUserInfo: () => Promise<void>
  shouldRefetch: () => boolean
  canManualRefresh: () => boolean
  manualRefresh: () => Promise<void>
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      userInfo: null,
      lastUpdate: null,
      lastManualRefresh: null,
      setUserInfo: (userInfo) => set({ userInfo, lastUpdate: Date.now() }),
      shouldRefetch: () => {
        const lastUpdate = get().lastUpdate
        if (!lastUpdate) return true
        return Date.now() - lastUpdate > 30 * 60 * 1000
      },
      fetchUserInfo: async () => {
        if (!get().shouldRefetch() && get().userInfo) {
          return
        }

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
          set({ userInfo: data, lastUpdate: Date.now() })
        } catch (error) {
          console.error('Erreur:', error)
          localStorage.removeItem('accessToken')
          throw error
        }
      },
      canManualRefresh: () => {
        const lastRefresh = get().lastManualRefresh
        if (!lastRefresh) return true
        return Date.now() - lastRefresh > 5 * 60 * 1000 // 5 minutes
      },
      manualRefresh: async () => {
        if (!get().canManualRefresh()) return

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
          set({ 
            userInfo: data, 
            lastUpdate: Date.now(),
            lastManualRefresh: Date.now()
          })
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