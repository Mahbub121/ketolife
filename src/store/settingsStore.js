import { create } from 'zustand'
import db from '../db/dexie'

const useSettingsStore = create((set) => ({
  palette: 'avocado',
    language: 'en',
  carbLimit: 20,
  waterGoal: 3000,
  notificationsEnabled: true,

  loadSettings: async () => {
    try {
      const prefs = await db.userProfile.get('prefs')
      if (prefs) {
        set({
          palette: prefs.palette || 'avocado',
          language: 'en',
          carbLimit: prefs.carbLimit ?? 20,
          waterGoal: prefs.waterGoal ?? 3000,
          notificationsEnabled: prefs.notificationsEnabled ?? true,
        })
      }
    } catch {
      // defaults remain
    }
  },

  updateSettings: async (partial) => {
    set((state) => ({ ...state, ...partial }))
    try {
      const prev = await db.userProfile.get('prefs')
      await db.userProfile.put({ id: 'prefs', ...prev, ...partial })
    } catch {
      // silently fail
    }
  },

  resetSettings: () => set({
    palette: 'avocado',
  language: 'en',
    carbLimit: 20,
    waterGoal: 3000,
    notificationsEnabled: true,
  }),
}))

export default useSettingsStore
