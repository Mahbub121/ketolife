import { useState, useEffect, lazy, Suspense } from 'react'
import { Activity, Plus } from 'lucide-react'
import PageHeader from '../components/layout/PageHeader'
import { addKetoneReading, getLast7Ketone } from '../db/dexie'
import bengaliNumber from '../utils/bengaliNumber'

const KetoneChart = lazy(() => import('../components/charts/KetoneChart'))

function getLevelBadge(mmol) {
  if (mmol == null) return null
  if (mmol < 0.5) return { label: 'বিটা-অক্সিডেশন', cls: 'bg-[#E8E2D0] text-muted' }
  if (mmol < 1.5) return { label: 'মৃদু কিটোসিস', cls: 'bg-accent-tint text-accent' }
  if (mmol < 3.0) return { label: 'পরিমিত কিটোসিস', cls: 'bg-primary-tint text-primary' }
  return { label: 'গভীর কিটোসিস', cls: 'bg-purple-100 text-purple-700' }
}

function formatShortDate(iso) {
  const d = new Date(iso)
  const wd = ['রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহ', 'শুক্র', 'শনি']
  return wd[d.getDay()]
}

export default function Ketone() {
  const [readings, setReadings] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(true)

  const loadReadings = async () => {
    setLoading(true)
    try {
      const data = await getLast7Ketone()
      setReadings(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadReadings()
  }, [])

  const latestMmol = readings.length > 0 ? readings[readings.length - 1].mmol : null
  const badge = getLevelBadge(latestMmol)

  const chartData = readings.map((r) => ({
    date: formatShortDate(r.date),
    mmol: r.mmol,
  }))

  const handleSubmit = async () => {
    const val = parseFloat(input)
    if (isNaN(val) || val < 0) return
    await addKetoneReading(val)
    setInput('')
    await loadReadings()
  }

  return (
    <div className="min-h-screen bg-bg">
      <PageHeader title="কিটোন ট্র্যাকার" showBack />

      <div className="px-4 pt-4 pb-8 flex flex-col gap-5">
        {/* Ketosis level badge */}
        {badge && (
          <div className="flex justify-center">
            <span className={`inline-block px-5 py-2 rounded-full font-hind font-semibold text-sm ${badge.cls}`}>
              {badge.label}
            </span>
          </div>
        )}

        {/* Input */}
        <div className="bg-surface rounded-xl border border-line p-4">
          <label className="font-hind text-sm font-medium text-muted mb-2 block">নতুন রিডিং (mmol/L)</label>
          <div className="flex gap-2">
            <input
              type="number"
              step="0.1"
              min="0"
              max="8"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="যেমন: ১.৫"
              className="flex-1 bg-bg border border-line rounded-xl px-4 py-3 font-number text-sm text-[#2C3320] outline-none focus:border-primary"
            />
            <button
              onClick={handleSubmit}
              disabled={!input}
              className="bg-primary text-white font-hind font-semibold px-5 py-3 rounded-xl tap flex items-center gap-1 disabled:opacity-40"
            >
              <Plus size={18} />
              রিডিং
            </button>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-surface rounded-xl border border-line p-4">
          <h3 className="font-hind text-sm font-semibold text-[#2C3320] mb-3">শেষ ৭ রিডিং</h3>
          {readings.length === 0 ? (
            <div className="flex flex-col items-center py-8">
              <Activity size={32} className="text-line mb-2" />
              <p className="font-hind text-sm text-muted">কোনো রিডিং নেই</p>
            </div>
          ) : (
            <Suspense fallback={<div className="font-hind text-sm text-muted text-center py-8">লোড হচ্ছে...</div>}>
              <KetoneChart data={chartData} />
            </Suspense>
          )}
        </div>

        {/* Info */}
        <div className="bg-primary-tint rounded-xl p-4">
          <p className="font-hind text-sm text-primary font-medium mb-1">অপটিমাল কিটোন লেভেল</p>
          <p className="font-hind text-xs text-muted">
            পুষ্টিগত কিটোসিস: ০.৫ — ৩.০ mmol/L। ৩.০ এর উপরে থেরাপিউটিক রেঞ্জ।
          </p>
        </div>
      </div>
    </div>
  )
}
