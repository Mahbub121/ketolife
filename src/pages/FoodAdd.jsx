import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Plus } from 'lucide-react'
import PageHeader from '../components/layout/PageHeader'

const meals = ['সকাল', 'দুপুর', 'বিকাল', 'রাত']

export default function FoodAdd() {
  const nav = useNavigate()
  const [selectedMeal, setSelectedMeal] = useState(meals[0])

  return (
    <div className="min-h-screen bg-bg">
      <PageHeader title="খাবার যোগ" showBack />

      <div className="px-4 pt-4 pb-8 flex flex-col gap-4">
        {/* Meal selector */}
        <div className="flex gap-2">
          {meals.map((m) => (
            <button
              key={m}
              onClick={() => setSelectedMeal(m)}
              className={`px-4 py-2 rounded-full font-hind text-sm tap ${
                selectedMeal === m
                  ? 'bg-primary text-white'
                  : 'bg-surface border border-line text-muted'
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        {/* Search */}
        <button
          onClick={() => nav('/food/search')}
          className="w-full bg-surface rounded-xl border border-line px-4 py-3 flex items-center gap-3 tap"
        >
          <Search size={18} className="text-muted" />
          <span className="font-hind text-sm text-muted">খাবার নাম লিখুন...</span>
        </button>

        {/* Custom food */}
        <button
          onClick={() => nav('/food/custom')}
          className="w-full border border-dashed border-primary rounded-xl px-4 py-4 flex items-center gap-3 tap justify-center"
        >
          <Plus size={18} className="text-primary" />
          <span className="font-hind font-medium text-sm text-primary">কাস্টম খাবার</span>
        </button>

        {/* Empty state */}
        <div className="bg-surface rounded-xl border border-line p-8 flex flex-col items-center gap-2 mt-4">
          <p className="font-hind text-sm text-muted">এই মিলে এখনো কিছু যোগ করা হয়নি</p>
        </div>
      </div>
    </div>
  )
}
