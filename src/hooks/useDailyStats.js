import { useState, useEffect } from 'react'
import db from '../db/dexie'
import useUserStore from '../store/userStore'

const DEFAULTS = {
  carbs: 130,
  fat: 95,
  protein: 130,
  kcal: 1850,
}

export default function useDailyStats() {
  const profile = useUserStore((s) => s.profile)
  const [isLoading, setIsLoading] = useState(true)
  const [totals, setTotals] = useState({ carbs: 0, fat: 0, protein: 0, kcal: 0 })

  const targets = {
    carbs: profile?.daily_carb_limit_g || 20,
    fat: DEFAULTS.fat,
    protein: DEFAULTS.protein,
    kcal: DEFAULTS.kcal,
  }

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)

    async function fetchToday() {
      try {
        const today = new Date().toISOString().slice(0, 10)
        const entries = await db.foodEntries
          .where('date')
          .equals(today)
          .toArray()

        if (cancelled) return

        const sums = { carbs: 0, fat: 0, protein: 0, kcal: 0 }

        for (const entry of entries) {
          const factor = entry.portion_g / 100
          sums.carbs += (entry.net_carbs_g || 0) * factor
          sums.fat += (entry.fat_g || 0) * factor
          sums.protein += (entry.protein_g || 0) * factor
          sums.kcal += (entry.kcal || 0) * factor
        }

        setTotals({
          carbs: Math.round(sums.carbs * 10) / 10,
          fat: Math.round(sums.fat * 10) / 10,
          protein: Math.round(sums.protein * 10) / 10,
          kcal: Math.round(sums.kcal),
        })
      } catch {
        // Dexie table might not exist yet — leave totals at 0
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    fetchToday()
    return () => { cancelled = true }
  }, [])

  return { totals, targets, isLoading }
}
