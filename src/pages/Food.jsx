import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, ChevronDown, X, UtensilsCrossed } from 'lucide-react'
import PageHeader from '../components/layout/PageHeader'
import MacroBar from '../components/dashboard/MacroBar'
import { getTodayFoodEntries, deleteFoodEntry } from '../db/dexie'
import { useT } from '../hooks/useTranslation'
import useDailyStats from '../hooks/useDailyStats'
import bengaliNumber from '../utils/bengaliNumber'

const meals = ['সকাল', 'দুপুর', 'রাত']

export default function Food() {
  const nav = useNavigate()
  const { t } = useT()
  const [entries, setEntries] = useState([])
  const [expanded, setExpanded] = useState(new Set())
  const [showFabMenu, setShowFabMenu] = useState(false)
  const { totals, targets } = useDailyStats()

  const loadEntries = async () => {
    const data = await getTodayFoodEntries()
    setEntries(data)
    const withEntries = new Set(meals.filter((m) => data.some((e) => e.meal === m)))
    setExpanded(withEntries)
  }

  useEffect(() => {
    loadEntries()
  }, [])

  const handleDelete = async (id) => {
    await deleteFoodEntry(id)
    await loadEntries()
  }

  const toggleMeal = (meal) => {
    setExpanded((prev) => {
      const next = new Set(prev)
      next.has(meal) ? next.delete(meal) : next.add(meal)
      return next
    })
  }

  const getMealEntries = (meal) => entries.filter((e) => e.meal === meal)

  const mealLabels = {
    'সকাল': t.meal_breakfast,
    'দুপুর': t.meal_lunch,
    'রাত': t.meal_dinner,
  }

  return (
    <div className="min-h-screen bg-bg">
      <PageHeader title={t.food_tracker_title} />

      <div className="px-4 pt-4 pb-24 flex flex-col gap-3">
        {/* Total summary */}
        <div className="bg-surface rounded-xl border border-line p-3 text-center">
          <p className="font-hind text-sm text-muted">
            {t.total_label} {bengaliNumber(entries.length)}{t.items_count} · {bengaliNumber(totals.kcal)} / {bengaliNumber(targets.kcal)} {t.kcal_short}
          </p>
        </div>

        {/* Meal sections */}
        {meals.map((meal) => {
          const mealEntries = getMealEntries(meal)
          const isExpanded = expanded.has(meal)

          return (
            <div key={meal} className="bg-surface rounded-xl border border-line overflow-hidden">
              <button
                onClick={() => toggleMeal(meal)}
                className="w-full flex items-center justify-between px-4 py-3 tap"
              >
                <span className="font-hind font-semibold text-sm text-[#2C3320]">
                  {mealLabels[meal]}
                  {mealEntries.length > 0 && (
                    <span className="font-number text-xs text-muted ml-1">
                      ({bengaliNumber(mealEntries.length)})
                    </span>
                  )}
                </span>
                <ChevronDown
                  size={18}
                  className={`text-muted transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                />
              </button>

              {isExpanded && (
                <div className="border-t border-line">
                  {mealEntries.length === 0 ? (
                    <p className="font-hind text-sm text-muted text-center py-4">
                      {mealLabels[meal]}
                    </p>
                  ) : (
                    mealEntries.map((e) => (
                      <div
                        key={e.id}
                        className="flex items-center justify-between px-4 py-2.5 border-b border-line last:border-b-0"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-hind text-sm font-medium text-[#2C3320] truncate">
                            {e.name_en || e.name_bn}
                          </p>
                          <p className="font-number text-xs text-muted">
                            {bengaliNumber(e.portion_g)}g · C:{bengaliNumber(Math.round(e.net_carbs_g))} F:{bengaliNumber(Math.round(e.fat_g))} P:{bengaliNumber(Math.round(e.protein_g))}
                          </p>
                        </div>
                        <button onClick={() => handleDelete(e.id)} className="tap p-1 ml-2">
                          <X size={15} className="text-muted hover:text-highlight" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )
        })}

        {/* Macro total bar at bottom */}
        <div className="bg-surface rounded-xl border border-line p-4 mt-1">
          <h3 className="font-hind text-sm font-semibold text-[#2C3320] mb-3">{t.todays_macros}</h3>
          <MacroBar
            value={totals.carbs}
            target={targets.carbs}
            color={totals.carbs > targets.carbs ? 'var(--warning)' : 'var(--highlight)'}
            label={t.net_carbs}
            big
          />
          <div className="flex gap-3 mt-3">
            <MacroBar value={totals.fat} target={targets.fat} color="var(--accent)" label={t.fat} />
            <MacroBar value={totals.protein} target={targets.protein} color="var(--primary)" label={t.protein} />
          </div>
        </div>
      </div>

      {/* FAB */}
      <div
        className="fixed right-5 z-50 flex flex-col items-end gap-2"
        style={{ bottom: 100, paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        {showFabMenu && (
          <div className="bg-surface rounded-xl border border-line shadow-lg overflow-hidden">
            {meals.map((m) => (
              <button
                key={m}
                onClick={() => {
                  setShowFabMenu(false)
                  nav(`/food/search?meal=${m}`)
                }}
                className="w-full flex items-center gap-2 px-4 py-3 tap border-b border-line last:border-b-0 font-hind text-sm text-[#2C3320]"
              >
                {mealLabels[m]}
              </button>
            ))}
          </div>
        )}
        <button
          onClick={() => setShowFabMenu(!showFabMenu)}
          className="w-14 h-14 bg-primary text-white rounded-full shadow-lg flex items-center justify-center tap"
        >
          <Plus size={28} />
        </button>
      </div>
    </div>
  )
}
