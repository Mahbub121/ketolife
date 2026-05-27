import { useState, useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Search, X, Plus, ChevronRight } from 'lucide-react'
import PageHeader from '../components/layout/PageHeader'
import { searchFoodItems, addFoodEntry } from '../db/dexie'
import db from '../db/dexie'
import bengaliNumber from '../utils/bengaliNumber'

export default function FoodSearch() {
  const nav = useNavigate()
  const [searchParams] = useSearchParams()
  const meal = searchParams.get('meal') || 'সকাল'

  const timerRef = useRef(null)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [selectedFood, setSelectedFood] = useState(null)
  const [portionG, setPortionG] = useState(100)

  const handleSearch = (val) => {
    setQuery(val)
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(async () => {
      if (val.trim()) {
        const data = await searchFoodItems(val)
        setResults(data)
      } else {
        setResults([])
      }
    }, 300)
  }

  useEffect(() => {
    return () => clearTimeout(timerRef.current)
  }, [])

  const handleSelectFood = (food) => {
    setSelectedFood(food)
    setPortionG(100)
  }

  const scale = (val) => val * (portionG / 100)

  const handleConfirmAdd = async () => {
    if (!selectedFood) return
    await addFoodEntry({
      meal,
      food_item_id: selectedFood.id,
      name_bn: selectedFood.name_bn,
      portion_g: portionG,
      net_carbs_g: selectedFood.carbs_g || 0,
      fat_g: selectedFood.fat_g || 0,
      protein_g: selectedFood.protein_g || 0,
      kcal: selectedFood.kcal || 0,
    })
    nav('/food')
  }

  return (
    <div className="min-h-screen bg-bg">
      <PageHeader title={`${meal} এর জন্য খাবার`} showBack />

      <div className="px-4 pt-4 pb-8">
        {/* Search input */}
        <div className="relative mb-4">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="খাবারের নাম লিখুন..."
            className="w-full bg-surface border border-line rounded-xl pl-10 pr-10 py-3 font-hind text-sm text-[#2C3320] placeholder:text-muted outline-none focus:border-primary"
          />
          {query && (
            <button
              onClick={() => {
                setQuery('')
                setResults([])
                clearTimeout(timerRef.current)
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 tap"
            >
              <X size={16} className="text-muted" />
            </button>
          )}
        </div>

        {/* Custom food link */}
        <button
          onClick={() => nav(`/food/custom?meal=${meal}`)}
          className="w-full flex items-center justify-between bg-primary-tint rounded-xl px-4 py-3 tap mb-4"
        >
          <div className="flex items-center gap-2">
            <Plus size={18} className="text-primary" />
            <span className="font-hind text-sm font-medium text-primary">কাস্টম খাবার তৈরি করুন</span>
          </div>
          <ChevronRight size={16} className="text-primary" />
        </button>

        {/* Results list */}
        {query && results.length === 0 && (
          <div className="flex flex-col items-center py-8">
            <Search size={32} className="text-line mb-2" />
            <p className="font-hind text-sm text-muted">কোনো খাবার পাওয়া যায়নি</p>
          </div>
        )}

        {!query && !selectedFood && (
          <div className="flex flex-col items-center py-8">
            <Search size={32} className="text-line mb-2" />
            <p className="font-hind text-sm text-muted">খাবার খুঁজতে টাইপ করুন</p>
          </div>
        )}

        {/* Results */}
        {!selectedFood && results.length > 0 && (
          <div className="flex flex-col gap-2">
            {results.map((food) => (
              <button
                key={food.id}
                onClick={() => handleSelectFood(food)}
                className="bg-surface rounded-xl border border-line px-4 py-3 flex items-center justify-between tap"
              >
                <div className="flex-1 min-w-0 text-left">
                  <p className="font-hind text-sm font-medium text-[#2C3320] truncate">{food.name_bn}</p>
                  <p className="font-number text-xs text-muted">
                    C:{bengaliNumber(food.carbs_g)} F:{bengaliNumber(food.fat_g)} P:{bengaliNumber(food.protein_g)} · {bengaliNumber(food.kcal)} kcal/১০০g
                  </p>
                </div>
                <ChevronRight size={16} className="text-muted ml-2 flex-shrink-0" />
              </button>
            ))}
          </div>
        )}

        {/* Portion selector modal */}
        {selectedFood && (
          <div className="bg-surface rounded-xl border border-line p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-hind font-semibold text-base text-[#2C3320">{selectedFood.name_bn}</h3>
              <button onClick={() => setSelectedFood(null)} className="tap p-1">
                <X size={18} className="text-muted" />
              </button>
            </div>

            <p className="font-hind text-xs text-muted mb-3">
              ১০০g তে · C:{bengaliNumber(selectedFood.carbs_g)}g F:{bengaliNumber(selectedFood.fat_g)}g P:{bengaliNumber(selectedFood.protein_g)}g · {bengaliNumber(selectedFood.kcal)} kcal
            </p>

            <label className="font-hind text-sm font-medium text-muted mb-1 block">পরিমাণ (গ্রাম)</label>
            <input
              type="number"
              min="5"
              step="10"
              value={portionG}
              onChange={(e) => setPortionG(Math.max(5, parseInt(e.target.value) || 0))}
              className="w-full bg-bg border border-line rounded-xl px-4 py-3 font-number text-sm text-[#2C3320] outline-none focus:border-primary mb-3"
            />

            <div className="bg-primary-tint rounded-lg px-3 py-2 mb-4">
              <p className="font-number text-xs text-primary font-medium">
                কার্ব: {bengaliNumber(Math.round(scale(selectedFood.carbs_g || 0) * 10) / 10)}g ·
                ফ্যাট: {bengaliNumber(Math.round(scale(selectedFood.fat_g || 0) * 10) / 10)}g ·
                প্রোটিন: {bengaliNumber(Math.round(scale(selectedFood.protein_g || 0) * 10) / 10)}g ·
                {bengaliNumber(Math.round(scale(selectedFood.kcal || 0)))} kcal
              </p>
            </div>

            <p className="font-hind text-xs text-muted mb-3">
              যুক্ত হবে: <span className="font-medium text-[#2C3320]">{meal}</span> এর খাবার হিসেবে
            </p>

            <button
              onClick={handleConfirmAdd}
              className="w-full bg-primary text-white font-hind font-semibold py-3 rounded-xl tap"
            >
              <Plus size={18} className="inline mr-1 mb-0.5" />
              যোগ করুন
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
