import { useState, useEffect, lazy, Suspense } from 'react'
import { Clock, Target, Flame, BarChart3, Scale, Award } from 'lucide-react'
import PageHeader from '../components/layout/PageHeader'
import useFastStore from '../store/fastStore'
import useDailyStats from '../hooks/useDailyStats'
import MacroBar from '../components/dashboard/MacroBar'
import { getLast30Weight } from '../db/dexie'
import db from '../db/dexie'
import bengaliNumber from '../utils/bengaliNumber'

const WeightChart = lazy(() => import('../components/charts/WeightChart'))
const FastingChart = lazy(() => import('../components/charts/FastingChart'))

const weekdays = ['রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহ', 'শুক্র', 'শনি']

function getLast7Days() {
  const days = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000)
    days.push({
      date: d.toISOString().slice(0, 10),
      day: weekdays[d.getDay()],
    })
  }
  return days
}

function getWeekAgo() {
  return new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10)
}

const badgeDefs = [
  {
    id: 'first-fast',
    icon: Clock,
    label: 'প্রথম ফাস্ট',
    desc: 'একটি ফাস্ট সম্পন্ন করুন',
    check: (h) => h.length >= 1,
  },
  {
    id: 'week-streak',
    icon: Award,
    label: 'সপ্তাহের যোদ্ধা',
    desc: 'টানা ৭ দিন ফাস্ট করুন',
    check: (h, streak) => streak >= 7,
  },
  {
    id: 'keto-master',
    icon: Flame,
    label: 'কিটো মাস্টার',
    desc: '১০টি ফাস্ট সম্পন্ন করুন',
    check: (h) => h.length >= 10,
  },
  {
    id: 'water-tracker',
    icon: BarChart3,
    label: 'পানি সচেতন',
    desc: 'পানি ট্র্যাকিং শুরু করুন',
    check: (h, s, wl) => (wl || 0) > 0,
  },
  {
    id: 'weight-aware',
    icon: Scale,
    label: 'ওজন সচেতন',
    desc: 'ওজন ট্র্যাকিং শুরু করুন',
    check: (h, s, wl, wtl) => (wtl || 0) > 0,
  },
  {
    id: 'food-collector',
    icon: Target,
    label: 'খাদ্য সংগ্রাহক',
    desc: '৫টি খাবার লগ করুন',
    check: (h, s, wl, wtl, fl) => (fl || 0) >= 5,
  },
]

export default function Stats() {
  const history = useFastStore((s) => s.history)
  const loadHistory = useFastStore((s) => s.loadHistory)
  const { totals, targets } = useDailyStats()

  const [weightEntries, setWeightEntries] = useState([])
  const [weeklyFastData, setWeeklyFastData] = useState([])
  const [weeklyCarbs, setWeeklyCarbs] = useState(0)
  const [waterEntryCount, setWaterEntryCount] = useState(0)
  const [weightEntryCount, setWeightEntryCount] = useState(0)
  const [foodEntryCount, setFoodEntryCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadHistory(30)
    async function load() {
      setLoading(true)
      try {
        const [weight, waterCount, weightCount, foodCount, weekFoods] = await Promise.all([
          getLast30Weight(),
          db.waterEntries.count(),
          db.weightEntries.count(),
          db.foodEntries.count(),
          db.foodEntries.where('date').aboveOrEqual(getWeekAgo()).toArray(),
        ])
        setWeightEntries(weight)
        setWaterEntryCount(waterCount)
        setWeightEntryCount(weightCount)
        setFoodEntryCount(foodCount)

        const totalCarbs = weekFoods.reduce((sum, e) => {
          const factor = e.portion_g / 100
          return sum + (e.net_carbs_g || 0) * factor
        }, 0)
        const daysWithEntries = new Set(weekFoods.map((e) => e.date)).size
        setWeeklyCarbs(daysWithEntries > 0 ? Math.round(totalCarbs / daysWithEntries) : 0)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [loadHistory])

  // Compute weekly fasting chart data
  useEffect(() => {
    if (!history.length) {
      setWeeklyFastData(getLast7Days().map((d) => ({ day: d.day, hours: 0 })))
      return
    }
    const last7 = getLast7Days()
    const data = last7.map((d) => {
      const dayFasts = history.filter((f) => {
        if (!f.endTime) return false
        return f.endTime.slice(0, 10) === d.date
      })
      const hours = dayFasts.reduce((s, f) => s + (f.actualDurationHours || 0), 0)
      return { day: d.day, hours: Math.round(hours * 10) / 10 }
    })
    setWeeklyFastData(data)
  }, [history])

  const totalFastHours = history.reduce((s, f) => s + (f.actualDurationHours || 0), 0)
  const totalFastCount = history.length

  const streak = history.filter((f) => f.actualDurationHours >= f.targetDurationHours).length

  const weightChartData = weightEntries.map((e) => ({
    date: (() => {
      const d = new Date(e.date)
      const months = ['জানু', 'ফেব্রু', 'মার্চ', 'এপ্রি', 'মে', 'জুন', 'জুলা', 'আগ', 'সেপ্টে', 'অক্টো', 'নভে', 'ডিসে']
      return `${bengaliNumber(d.getDate())} ${months[d.getMonth()]}`
    })(),
    kg: e.kg,
  }))

  return (
    <div className="min-h-screen bg-bg">
      <PageHeader title="স্ট্যাটস" />

      <div className="px-4 pt-4 pb-8 flex flex-col gap-4">
        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-primary-tint rounded-xl p-3 flex flex-col items-center gap-1">
            <Clock size={18} className="text-primary" />
            <p className="font-number font-bold text-sm text-[#2C3320]">{bengaliNumber(Math.round(totalFastHours))}h</p>
            <p className="font-hind text-[10px] text-muted text-center leading-tight">মোট ফাস্টিং</p>
          </div>
          <div className="bg-accent-tint rounded-xl p-3 flex flex-col items-center gap-1">
            <Target size={18} className="text-accent" />
            <p className="font-number font-bold text-sm text-[#2C3320]">{bengaliNumber(totalFastCount)}টি</p>
            <p className="font-hind text-[10px] text-muted text-center leading-tight">ফাস্ট সম্পন্ন</p>
          </div>
          <div className="bg-green-50 rounded-xl p-3 flex flex-col items-center gap-1">
            <Flame size={18} className="text-success" />
            <p className="font-number font-bold text-sm text-[#2C3320]">{bengaliNumber(weeklyCarbs)}g</p>
            <p className="font-hind text-[10px] text-muted text-center leading-tight">গড় কার্ব</p>
          </div>
        </div>

        {/* Weekly fasting chart */}
        <div className="bg-surface rounded-xl border border-line p-4">
          <h3 className="font-hind text-sm font-semibold text-[#2C3320] mb-3">সাপ্তাহিক ফাস্টিং</h3>
          {history.length === 0 ? (
            <div className="flex flex-col items-center py-8">
              <BarChart3 size={32} className="text-line mb-2" />
              <p className="font-hind text-sm text-muted">কোনো ডাটা নেই</p>
            </div>
          ) : (
            <Suspense fallback={<div className="font-hind text-sm text-muted text-center py-8">লোড হচ্ছে...</div>}>
              <FastingChart data={weeklyFastData} />
            </Suspense>
          )}
        </div>

        {/* Weight trend */}
        <div className="bg-surface rounded-xl border border-line p-4">
          <h3 className="font-hind text-sm font-semibold text-[#2C3320] mb-3">ওয়েট ট্রেন্ড</h3>
          {weightEntries.length === 0 ? (
            <div className="flex flex-col items-center py-8">
              <Scale size={32} className="text-line mb-2" />
              <p className="font-hind text-sm text-muted">কোনো ডাটা নেই</p>
            </div>
          ) : (
            <Suspense fallback={<div className="font-hind text-sm text-muted text-center py-8">লোড হচ্ছে...</div>}>
              <WeightChart data={weightChartData} />
            </Suspense>
          )}
        </div>

        {/* Macro summary */}
        <div className="bg-surface rounded-xl border border-line p-4">
          <h3 className="font-hind text-sm font-semibold text-[#2C3320] mb-3">গড় ম্যাক্রো (সাপ্তাহিক)</h3>
          <MacroBar
            value={weeklyCarbs}
            target={targets.carbs}
            color={weeklyCarbs > targets.carbs ? 'var(--warning)' : 'var(--highlight)'}
            label="নেট কার্ব"
          />
          <p className="font-hind text-[11px] text-muted mt-2">গড় দৈনিক কার্ব গ্রহণ (শেষ ৭ দিন)</p>
        </div>

        {/* Achievements */}
        <div className="bg-surface rounded-xl border border-line p-4">
          <h3 className="font-hind text-sm font-semibold text-[#2C3320] mb-3">অর্জন</h3>
          <div className="grid grid-cols-3 gap-3">
            {badgeDefs.map((b) => {
              const earned = b.check(history, streak, waterEntryCount, weightEntryCount, foodEntryCount)
              return (
                <div
                  key={b.id}
                  className={`flex flex-col items-center gap-1 p-2 rounded-xl text-center ${
                    earned ? 'bg-primary-tint' : 'opacity-35 grayscale'
                  }`}
                >
                  <b.icon size={18} className={earned ? 'text-primary' : 'text-muted'} />
                  <p className={`font-hind text-[10px] leading-tight ${earned ? 'text-primary font-medium' : 'text-muted'}`}>
                    {b.label}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
