import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Save } from 'lucide-react'
import PageHeader from '../components/layout/PageHeader'
import { useT } from '../hooks/useTranslation'
import db from '../db/dexie'

export default function FoodCustom() {
  const nav = useNavigate()
  const [searchParams] = useSearchParams()
  const meal = searchParams.get('meal') || 'সকাল'
  const { t } = useT()

  const categories = [t.cat_veg, t.cat_meat, t.cat_fish, t.cat_dairy, t.cat_nuts]

  const [form, setForm] = useState({
    name_bn: '',
    name_en: '',
    category: t.cat_veg,
    carbs_g: '',
    fat_g: '',
    protein_g: '',
    kcal: '',
  })

  const [saving, setSaving] = useState(false)

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const handleSave = async () => {
    if (!form.name_bn.trim()) return
    setSaving(true)
    try {
      const entry = {
        id: crypto.randomUUID(),
        name_bn: form.name_bn.trim(),
        name_en: form.name_en.trim(),
        category: form.category,
        carbs_g: parseFloat(form.carbs_g) || 0,
        fat_g: parseFloat(form.fat_g) || 0,
        protein_g: parseFloat(form.protein_g) || 0,
        kcal: parseFloat(form.kcal) || 0,
        is_custom: true,
      }
      await db.foodItems.add(entry)
      nav(`/food/search?meal=${meal}`)
    } finally {
      setSaving(false)
    }
  }

  const fields = [
    { key: 'name_bn', label: t.name_bn_label, type: 'text', required: true },
    { key: 'name_en', label: t.name_en_label, type: 'text', required: false },
    { key: 'carbs_g', label: t.carbs_label, type: 'number' },
    { key: 'fat_g', label: t.fat_label, type: 'number' },
    { key: 'protein_g', label: t.protein_label, type: 'number' },
    { key: 'kcal', label: t.kcal_label, type: 'number' },
  ]

  return (
    <div className="min-h-screen bg-bg">
      <PageHeader title={t.custom_title} showBack />

      <div className="px-4 pt-4 pb-8 flex flex-col gap-4">
        <p className="font-hind text-xs text-muted mb-1">
          {t.food_will_add} <span className="font-medium text-[#2C3320]">{meal}</span> {t.for_meal}
        </p>

        {fields.map((f) => (
          <div key={f.key}>
            <label className="font-hind text-sm font-medium text-muted mb-1 block">
              {f.label}
              {f.required && <span className="text-highlight ml-0.5">*</span>}
            </label>
            <input
              type={f.type}
              value={form[f.key]}
              onChange={(e) => set(f.key, e.target.value)}
              className="w-full bg-surface border border-line rounded-xl px-4 py-3 font-hind text-sm text-[#2C3320] outline-none focus:border-primary"
            />
          </div>
        ))}

        <div>
          <label className="font-hind text-sm font-medium text-muted mb-1 block">{t.category_label}</label>
          <select
            value={form.category}
            onChange={(e) => set('category', e.target.value)}
            className="w-full bg-surface border border-line rounded-xl px-4 py-3 font-hind text-sm text-[#2C3320] outline-none focus:border-primary"
          >
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <button
          onClick={handleSave}
          disabled={!form.name_bn.trim() || saving}
          className="w-full bg-primary text-white font-hind font-semibold text-lg py-4 rounded-xl tap flex items-center justify-center gap-2 mt-2 disabled:opacity-40"
        >
          <Save size={20} />
          {saving ? t.saving_text : t.save_food_btn}
        </button>
      </div>
    </div>
  )
}
