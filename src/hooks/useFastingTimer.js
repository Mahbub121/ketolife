import { useState, useEffect } from 'react'
import useFastStore from '../store/fastStore'
import stages from '../data/stages'

export default function useFastingTimer() {
  const activeFast = useFastStore((s) => s.activeFast)
  const isLoading = useFastStore((s) => s.isLoading)
  const [tick, setTick] = useState(0)

  const isActive = activeFast && activeFast.status === 'active' && activeFast.startTime

  useEffect(() => {
    if (!isActive) {
      setTick(0)
      return
    }
    const id = setInterval(() => setTick((t) => t + 1), 1000)
    return () => clearInterval(id)
  }, [isActive, activeFast?.id])

  const now = Date.now()
  const startTime = isActive ? new Date(activeFast.startTime).getTime() : null
  const targetSec = isActive ? (activeFast.targetDurationHours || 16) * 3600 : 0

  let elapsed = 0
  let remaining = 0
  let progress = 0

  if (isActive && startTime) {
    elapsed = (now - startTime) / 1000
    remaining = Math.max(0, targetSec - elapsed)
    progress = Math.min(1, elapsed / targetSec)
  }

  const elapsedHours = elapsed / 3600

  const currentStage = (() => {
    if (!isActive) return stages[0]
    const found = [...stages].reverse().find((s) => s.h <= elapsedHours)
    return found || stages[0]
  })()

  const nextStage = (() => {
    if (!isActive) return stages[1] || null
    return stages.find((s) => s.h > elapsedHours) || null
  })()

  const h = Math.floor(elapsed / 3600)
  const m = Math.floor((elapsed % 3600) / 60)
  const s = Math.floor(elapsed % 60)

  const rh = Math.floor(remaining / 3600)
  const rm = Math.floor((remaining % 3600) / 60)

  return {
    elapsed,
    remaining,
    progress,
    currentStage,
    nextStage,
    isFasting: !!isActive,
    isLoading,
    formattedElapsed: `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`,
    formattedElapsedShort: `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`,
    formattedRemaining: `${rh}h ${String(rm).padStart(2, '0')}m`,
    elapsedHours,
    activeFast,
    stages,
  }
}
