import { create } from 'zustand'
import db from '../db/dexie'

const useUserStore = create((set) => ({
  profile: null,
  isLoading: true,
  isOnboarded: false,

  loadProfile: async () => {
    set({ isLoading: true })
    try {
      const profile = await db.userProfile.get('me')
      if (profile?.isOnboarded) {
        set({ profile, isOnboarded: true, isLoading: false })
      } else {
        set({ isLoading: false })
      }
    } catch {
      set({ isLoading: false })
    }
  },

  saveProfile: async (profile) => {
    set({ isLoading: true })
    try {
      const data = { id: 'me', ...profile, isOnboarded: true }
      await db.userProfile.put(data)
      set({ profile: data, isOnboarded: true, isLoading: false })
    } catch {
      set({ isLoading: false })
    }
  },

  resetProfile: () => set({ profile: null, isOnboarded: false }),
}))

export default useUserStore
