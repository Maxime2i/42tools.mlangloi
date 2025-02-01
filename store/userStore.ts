import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface UserInfo {
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
    skills: Array<{
      name: string
      level: number
    }>
  }>
  projects_users: Array<{
    project: {
      id: number
      name: string
      slug: string
      solo: boolean
    }
    status: string
    validated: boolean
    final_mark: number
    marked_at: string
  }>
  internships: Array<any>
  campus: Array<any>
  pool_month: string
  pool_year: string
  events: Array<{
    event: {
      id: number
      name: string
      description: string
      location: string
      kind: string
      max_people: number | null
      nbr_subscribers: number
      begin_at: string
      end_at: string
      campus_ids: Array<number>
      cursus_ids: Array<number>
      created_at: string
      updated_at: string
      prohibition_of_cancellation: number | null
      waitlist: number | null
    }
  }>
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
          const response = await fetch('/api/proxy', {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) throw new Error('Erreur de récupération des données')

          const data = await response.json()

          if (data.projects_users) {
            data.projects_users = data.projects_users.map((project: any) => ({
              ...project,
              validated: project['validated?'],
            }))
          }

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
          const response = await fetch('/api/proxy', {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

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