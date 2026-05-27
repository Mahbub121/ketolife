import { useState, useEffect } from 'react'
import { Droplets, Plus, X } from 'lucide-react'
import PageHeader from '../components/layout/PageHeader'
import useSettingsStore from '../store/settingsStore'
import { addWaterEntry, getTodayWater, deleteWaterEntry } from '../db/dexie'
import bengaliNumber from '../utils/bengaliNumber'

const quickAdds = [250, 500, 750, 1000]

export default function Water() {
  const waterGoal = useSettingsStore((s) => s.waterGoal)
  const [entries, setEntries] = useState([])
  const [customMl, setCustomMl] = useState('')
  const [loading, setLoading] = useState(true)

  const loadToday = async () => {
    setLoading(true)
    try {
      const data = await getTodayWater()
      setEntries(data.sort((a, b) => new Date(b.time) - new Date(a.time)))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadToday()
  }, [])

  const total = entries.reduce((sum, e) => sum + e.ml, 0)
  const progress = Math.min(total / waterGoal, 1)
  const pct = Math.round(progress * 100)

  const handleAdd = async (ml) => {
    await addWaterEntry(ml)
    await loadToday()
  }

  const handleCustomAdd = async () => {
    const ml = parseInt(customMl, 10)
    if (isNaN(ml) || ml < 50) return
    await handleAdd(ml)
    setCustomMl('')
  }

  const handleDelete = async (id) => {
    await deleteWaterEntry(id)
    await loadToday()
  }

  const formatTime = (iso) => {
    const d = new Date(iso)
    return `${bengaliNumber(d.getHours())}:${String(d.getMinutes()).padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen bg-bg">
      <PageHeader title="পানি ট্র্যাকার" showBack />

      <div className="px-4 pt-4 pb-8 flex flex-col items-center gap-5">
        {/* Progress ring */}
        <div className="relative w-44 h-44">
          <svg width={176} height={176} viewBox="0 0 176 176" className="transform -rotate-90">
            <circle cx={88} cy={88} r={76} fill="none" stroke="rgba(91,127,63,0.12)" strokeWidth={12} />
            <circle
              cx={88}
              cy={88}
              r={76}
              fill="none"
              stroke="#5B7F3F"
              strokeWidth={12}
              strokeLinecap="round"
              strokeDasharray={`${progress * 477.5} 477.5`}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Droplets size={24} className="text-primary" />
            <p className="font-number font-bold text-2xl text-[#2C3320] mt-1">{bengaliNumber(total)}</p>
            <p className="font-hind text-xs text-muted">/ {bengaliNumber(waterGoal)} ml</p>
            <p className="font-hind text-[10px] text-primary font-medium mt-0.5">{bengaliNumber(pct)}%</p>
          </div>
        </div>

        {/* Quick-add buttons */}
        <div className="flex gap-2 w-full max-w-sm">
          {quickAdds.map((ml) => (
            <button
              key={ml}
              onClick={() => handleAdd(ml)}
              className="flex-1 bg-primary text-white font-hind font-semibold text-sm py-3 rounded-xl tap"
            >
              {ml === 1000 ? '১ লি' : bengaliNumber(ml)}
            </button>
          ))}
        </div>

        {/* Custom input */}
        <div className="flex gap-2 w-full max-w-sm">
          <input
            type="number"
            min="50"
            step="50"
            value={customMl}
            onChange={(e) => setCustomMl(e.target.value)}
            placeholder="পরিমাণ (ml)"
            className="flex-1 bg-surface border border-line rounded-xl px-4 py-3 font-number text-sm text-[#2C3320] outline-none focus:border-primary"
          />
          <button
            onClick={handleCustomAdd}
            disabled={!customMl || parseInt(customMl) < 50}
            className="bg-primary text-white font-hind font-semibold px-5 py-3 rounded-xl tap flex items-center gap-1 disabled:opacity-40"
          >
            <Plus size={18} />
            যোগ
          </button>
        </div>

        {/* Today's log */}
        <div className="w-full max-w-sm">
          <h3 className="font-hind text-sm font-semibold text-[#2C3320] mb-2">আজকের লগ</h3>
          {entries.length === 0 ? (
            <p className="font-hind text-sm text-muted text-center py-4">আজকে এখনো পানি পান করেননি</p>
          ) : (
            <div className="flex flex-col gap-1.5">
              {entries.map((e) => (
                <div
                  key={e.id}
                  className="bg-surface rounded-xl border border-line px-4 py-2.5 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <Droplets size={16} className="text-primary" />
                    <span className="font-number font-semibold text-sm text-[#2C3320]">{bengaliNumber(e.ml)} ml</span>
                    <span className="font-hind text-xs text-muted">{formatTime(e.time)}</span>
                  </div>
                  <button onClick={() => handleDelete(e.id)} className="tap p-1">
                    <X size={16} className="text-muted hover:text-highlight" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
