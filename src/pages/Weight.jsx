import { useState, useEffect, lazy, Suspense } from 'react'
import { Scale, Plus } from 'lucide-react'
import PageHeader from '../components/layout/PageHeader'
import useUserStore from '../store/userStore'
import { addWeightEntry, getLast30Weight } from '../db/dexie'
import bengaliNumber from '../utils/bengaliNumber'

const WeightChart = lazy(() => import('../components/charts/WeightChart'))

const months = ['জানু', 'ফেব্রু', 'মার্চ', 'এপ্রি', 'মে', 'জুন', 'জুলা', 'আগ', 'সেপ্টে', 'অক্টো', 'নভে', 'ডিসে']

function formatShortDate(iso) {
  const d = new Date(iso)
  return `${bengaliNumber(d.getDate())} ${months[d.getMonth()]}`
}

function calcBMI(weightKg, heightCm) {
  if (!heightCm || heightCm <= 0) return null
  return weightKg / ((heightCm / 100) ** 2)
}

function bmiCategory(bmi) {
  if (bmi == null) return null
  if (bmi < 18.5) return { label: 'কম ওজন', color: 'text-accent' }
  if (bmi < 25) return { label: 'স্বাভাবিক', color: 'text-primary' }
  if (bmi < 30) return { label: 'বেশি ওজন', color: 'text-highlight' }
  return { label: 'স্থূল', color: 'text-highlight font-bold' }
}

export default function Weight() {
  const profile = useUserStore((s) => s.profile)
  const [entries, setEntries] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(true)

  const loadEntries = async () => {
    setLoading(true)
    try {
      const data = await getLast30Weight()
      setEntries(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadEntries()
  }, [])

  const latest = entries.length > 0 ? entries[entries.length - 1] : null
  const currentKg = latest?.kg ?? null
  const targetKg = profile?.targetWeight ? parseFloat(profile.targetWeight) : null
  const heightCm = profile?.height ? parseFloat(profile.height) : null
  const bmi = currentKg ? calcBMI(currentKg, heightCm) : null
  const bmiCat = bmiCategory(bmi)
  const delta = targetKg && currentKg ? targetKg - currentKg : null

  const chartData = entries.map((e) => ({
    date: formatShortDate(e.date),
    kg: e.kg,
  }))

  const handleSubmit = async () => {
    const val = parseFloat(input)
    if (isNaN(val) || val < 20) return
    await addWeightEntry(val)
    setInput('')
    await loadEntries()
  }

  return (
    <div className="min-h-screen bg-bg">
      <PageHeader title="ওয়েট ট্র্যাকার" showBack />

      <div className="px-4 pt-4 pb-8 flex flex-col gap-4">
        {/* Current + Goal */}
        <div className="flex gap-3">
          <div className="flex-1 bg-surface rounded-xl border border-line p-4 text-center">
            <p className="font-hind text-xs text-muted mb-1">বর্তমান</p>
            <p className="font-number font-bold text-3xl text-[#2C3320]">
              {currentKg ? bengaliNumber(currentKg) : '—'}
            </p>
            <p className="font-hind text-xs text-muted">kg</p>
          </div>

          <div className="flex-1 bg-surface rounded-xl border border-line p-4 text-center">
            <p className="font-hind text-xs text-muted mb-1">লক্ষ্য</p>
            <p className="font-number font-bold text-3xl text-primary">
              {targetKg ? bengaliNumber(targetKg) : '—'}
            </p>
            <p className="font-hind text-xs text-muted">kg</p>
            {delta !== null && currentKg !== null && (
              <p className={`font-hind text-xs font-medium mt-1 ${delta >= 0 ? 'text-success' : 'text-highlight'}`}>
                {delta >= 0 ? `− ${bengaliNumber(Math.abs(delta))} kg` : `+ ${bengaliNumber(Math.abs(delta))} kg`}
              </p>
            )}
          </div>
        </div>

        {/* BMI */}
        {bmi !== null ? (
          <div className="bg-primary-tint rounded-xl px-4 py-3 flex items-center justify-between">
            <span className="font-hind text-sm text-primary font-medium">বিএমআই</span>
            <span className={`font-number font-bold text-sm ${bmiCat?.color || 'text-primary'}`}>
              {bengaliNumber(Math.round(bmi * 10) / 10)} — {bmiCat?.label}
            </span>
          </div>
        ) : heightCm === null ? (
          <div className="bg-accent-tint rounded-xl px-4 py-3">
            <p className="font-hind text-xs text-accent">
              বিএমআই দেখতে প্রোফাইলে উচ্চতা সেট করুন
            </p>
          </div>
        ) : null}

        {/* Input */}
        <div className="bg-surface rounded-xl border border-line p-4">
          <label className="font-hind text-sm font-medium text-muted mb-2 block">নতুন ওজন (kg)</label>
          <div className="flex gap-2">
            <input
              type="number"
              step="0.1"
              min="20"
              max="300"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="যেমন: ৭২.৫"
              className="flex-1 bg-bg border border-line rounded-xl px-4 py-3 font-number text-sm text-[#2C3320] outline-none focus:border-primary"
            />
            <button
              onClick={handleSubmit}
              disabled={!input}
              className="bg-primary text-white font-hind font-semibold px-5 py-3 rounded-xl tap flex items-center gap-1 disabled:opacity-40"
            >
              <Plus size={18} />
              ওজন
            </button>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-surface rounded-xl border border-line p-4">
          <h3 className="font-hind text-sm font-semibold text-[#2C3320] mb-3">শেষ ৩০ দিন</h3>
          {entries.length === 0 ? (
            <div className="flex flex-col items-center py-8">
              <Scale size={32} className="text-line mb-2" />
              <p className="font-hind text-sm text-muted">কোনো ওয়েট এন্ট্রি নেই</p>
            </div>
          ) : (
            <Suspense fallback={<div className="font-hind text-sm text-muted text-center py-8">লোড হচ্ছে...</div>}>
              <WeightChart data={chartData} targetKg={targetKg} />
            </Suspense>
          )}
        </div>
      </div>
    </div>
  )
}
