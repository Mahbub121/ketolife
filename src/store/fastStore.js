import { create } from 'zustand'
import { Capacitor } from '@capacitor/core'
import { LocalNotifications } from '@capacitor/local-notifications'
import db, {
  getActiveFast,
  createFastingSession,
  updateFastingSession,
  getFastingSessions,
} from '../db/dexie'

function parseProtocolHours(protocol) {
  if (protocol === 'OMAD') return 23
  const match = protocol.match(/^(\d+)/)
  return match ? parseInt(match[1], 10) : 16
}

const useFastStore = create((set, get) => ({
  activeFast: null,
  history: [],
  isLoading: false,
  error: null,

  loadActiveFast: async () => {
    set({ isLoading: true, error: null })
    try {
      const fast = await getActiveFast()
      set({ activeFast: fast || null, isLoading: false })
    } catch (err) {
      set({ error: err.message, isLoading: false })
    }
  },

  startFast: async (protocol, customStartTime) => {
    const { activeFast } = get()
    set({ isLoading: true, error: null })
    try {
      if (activeFast) {
        await get().endFast()
      }
      const targetDurationHours = parseProtocolHours(protocol)
      const startTime = customStartTime || new Date().toISOString()
      const session = await createFastingSession({
        protocol,
        targetDurationHours,
        startTime,
      })

      if (Capacitor.isNativePlatform()) {
        const endDate = new Date(new Date(startTime).getTime() + targetDurationHours * 3600 * 1000)
        try {
          await LocalNotifications.schedule({
            notifications: [{
              id: 1,
              title: 'Keto Track',
              body: 'Your fast is complete! 🎉',
              schedule: { at: endDate },
            }],
          })
        } catch {
        }
      }

      set({ activeFast: session, isLoading: false })
    } catch (err) {
      set({ error: err.message, isLoading: false })
    }
  },

  updateStartTime: async (fastId, newStartTime) => {
    const { activeFast } = get()
    if (!activeFast || activeFast.id !== fastId) return
    set({ isLoading: true, error: null })
    try {
      await updateFastingSession(fastId, { startTime: newStartTime })
      const targetDurationHours = activeFast.targetDurationHours || 16

      if (Capacitor.isNativePlatform()) {
        try {
          await LocalNotifications.cancel({ notifications: [{ id: 1 }] })
        } catch {
        }
        const endDate = new Date(new Date(newStartTime).getTime() + targetDurationHours * 3600 * 1000)
        try {
          await LocalNotifications.schedule({
            notifications: [{
              id: 1,
              title: 'Keto Track',
              body: 'Your fast is complete! 🎉',
              schedule: { at: endDate },
            }],
          })
        } catch {
        }
      }

      set({ activeFast: { ...activeFast, startTime: newStartTime }, isLoading: false })
    } catch (err) {
      set({ error: err.message, isLoading: false })
    }
  },

  endFast: async () => {
    const { activeFast } = get()
    if (!activeFast) return
    set({ isLoading: true, error: null })
    try {
      const now = new Date()
      const startTime = new Date(activeFast.startTime)
      const actualDurationHours = parseFloat(
        ((now - startTime) / (1000 * 3600)).toFixed(2)
      )
      const updates = {
        endTime: now.toISOString(),
        status: 'completed',
        actualDurationHours,
      }
      await updateFastingSession(activeFast.id, updates)

      if (Capacitor.isNativePlatform()) {
        try {
          await LocalNotifications.cancel({ notifications: [{ id: 1 }] })
        } catch {
        }
      }

      const completed = { ...activeFast, ...updates }
      set((state) => ({
        activeFast: null,
        history: [completed, ...state.history].slice(0, 30),
        isLoading: false,
      }))
    } catch (err) {
      set({ error: err.message, isLoading: false })
    }
  },

  pauseFast: async () => {
    const { activeFast } = get()
    if (!activeFast || activeFast.status !== 'active') return
    try {
      await updateFastingSession(activeFast.id, { status: 'paused' })
      set({ activeFast: { ...activeFast, status: 'paused' } })
    } catch (err) {
      set({ error: err.message })
    }
  },

  resumeFast: async () => {
    const { activeFast } = get()
    if (!activeFast || activeFast.status !== 'paused') return
    try {
      await updateFastingSession(activeFast.id, { status: 'active' })
      set({ activeFast: { ...activeFast, status: 'active' } })
    } catch (err) {
      set({ error: err.message })
    }
  },

  loadHistory: async (limit = 7) => {
    set({ isLoading: true, error: null })
    try {
      const history = await getFastingSessions(limit)
      set({ history, isLoading: false })
    } catch (err) {
      set({ error: err.message, isLoading: false })
    }
  },

  clearError: () => set({ error: null }),

  reset: () =>
    set({
      activeFast: null,
      history: [],
      isLoading: false,
      error: null,
    }),
}))

export default useFastStore
