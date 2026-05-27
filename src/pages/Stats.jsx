import { useState, useEffect, lazy, Suspense } from 'react'
import { Clock, Target, Flame, BarChart3, Scale, Award } from 'lucide-react'
import PageHeader from '../components/layout/PageHeader'
import useFastStore from '../store/fastStore'
import useDailyStats from '../hooks/useDailyStats'
import MacroBar from '../components/dashboard/MacroBar'
import { getLast30Weight } from '../db/dexie'
import db from '../db/dexie'
import bengaliNumber from '../utils/bengaliNumber'
import { useT } from '../hooks/useTranslation'

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

export default function Stats() {
  const { t } = useT()
  const history = useFastStore((s) => s.history)
  const loadHistory = useFastStore((s) => s.loadHistory)
  const { totals, targets } = useDailyStats()

  const badgeDefs = [
    {
      id: 'first-fast',
      icon: Clock,
      label: t.badge_first_fast,
      desc: t.badge_desc_first_fast,
      check: (h) => h.length >= 1,
    },
    {
      id: 'week-streak',
      icon: Award,
      label: t.badge_week_warrior,
      desc: t.badge_desc_week_warrior,
      check: (h, streak) => streak >= 7,
    },
    {
      id: 'keto-master',
      icon: Flame,
      label: t.badge_keto_master,
      desc: t.badge_desc_keto_master,
      check: (h) => h.length >= 10,
    },
    {
      id: 'water-tracker',
      icon: BarChart3,
      label: t.badge_water_aware,
      desc: t.badge_desc_water_aware,
      check: (h, s, wl) => (wl || 0) > 0,
    },
    {
      id: 'weight-aware',
      icon: Scale,
      label: t.badge_weight_aware,
      desc: t.badge_desc_weight_aware,
      check: (h, s, wl, wtl) => (wtl || 0) > 0,
    },
    {
      id: 'food-collector',
      icon: Target,
      label: t.badge_food_collector,
      desc: t.badge_desc_food_collector,
      check: (h, s, wl, wtl, fl) => (fl || 0) >= 5,
    },
  ]

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
      <PageHeader title={t.stats_title} />

      <div className="px-4 pt-4 pb-8 flex flex-col gap-4">
        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-primary-tint rounded-xl p-3 flex flex-col items-center gap-1">
            <Clock size={18} className="text-primary" />
            <p className="font-number font-bold text-sm text-[#2C3320]">{bengaliNumber(Math.round(totalFastHours))}h</p>
            <p className="font-hind text-[10px] text-muted text-center leading-tight">{t.total_fasting}</p>
          </div>
          <div className="bg-accent-tint rounded-xl p-3 flex flex-col items-center gap-1">
            <Target size={18} className="text-accent" />
            <p className="font-number font-bold text-sm text-[#2C3320]">{bengaliNumber(totalFastCount)}টি</p>
            <p className="font-hind text-[10px] text-muted text-center leading-tight">{t.fasts_completed}</p>
          </div>
          <div className="bg-green-50 rounded-xl p-3 flex flex-col items-center gap-1">
            <Flame size={18} className="text-success" />
            <p className="font-number font-bold text-sm text-[#2C3320]">{bengaliNumber(weeklyCarbs)}g</p>
            <p className="font-hind text-[10px] text-muted text-center leading-tight">{t.avg_carbs}</p>
          </div>
        </div>

        {/* Weekly fasting chart */}
        <div className="bg-surface rounded-xl border border-line p-4">
          <h3 className="font-hind text-sm font-semibold text-[#2C3320] mb-3">{t.weekly_fasting}</h3>
          {history.length === 0 ? (
            <div className="flex flex-col items-center py-8">
              <BarChart3 size={32} className="text-line mb-2" />
              <p className="font-hind text-sm text-muted">{t.no_data}</p>
            </div>
          ) : (
            <Suspense fallback={<div className="font-hind text-sm text-muted text-center py-8">{t.loading}</div>}>
              <FastingChart data={weeklyFastData} />
            </Suspense>
          )}
        </div>

        {/* Weight trend */}
        <div className="bg-surface rounded-xl border border-line p-4">
          <h3 className="font-hind text-sm font-semibold text-[#2C3320] mb-3">{t.weight_trend}</h3>
          {weightEntries.length === 0 ? (
            <div className="flex flex-col items-center py-8">
              <Scale size={32} className="text-line mb-2" />
              <p className="font-hind text-sm text-muted">{t.no_data}</p>
            </div>
          ) : (
            <Suspense fallback={<div className="font-hind text-sm text-muted text-center py-8">{t.loading}</div>}>
              <WeightChart data={weightChartData} />
            </Suspense>
          )}
        </div>

        {/* Macro summary */}
        <div className="bg-surface rounded-xl border border-line p-4">
          <h3 className="font-hind text-sm font-semibold text-[#2C3320] mb-3">{t.avg_macro_weekly}</h3>
          <MacroBar
            value={weeklyCarbs}
            target={targets.carbs}
            color={weeklyCarbs > targets.carbs ? 'var(--warning)' : 'var(--highlight)'}
            label={t.net_carbs}
          />
          <p className="font-hind text-[11px] text-muted mt-2">{t.avg_daily_carbs}</p>
        </div>

        {/* Achievements */}
        <div className="bg-surface rounded-xl border border-line p-4">
          <h3 className="font-hind text-sm font-semibold text-[#2C3320] mb-3">{t.achievements}</h3>
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
