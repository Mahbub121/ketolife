import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Save } from 'lucide-react'
import PageHeader from '../components/layout/PageHeader'
import useUserStore from '../store/userStore'
import useSettingsStore from '../store/settingsStore'

export default function GoalsEdit() {
  const nav = useNavigate()
  const profile = useUserStore((s) => s.profile)
  const saveProfile = useUserStore((s) => s.saveProfile)
  const waterGoal = useSettingsStore((s) => s.waterGoal)
  const carbLimit = useSettingsStore((s) => s.carbLimit)
  const updateSettings = useSettingsStore((s) => s.updateSettings)

  const [goals, setGoals] = useState({
    targetWeight: '',
    dailyCarbs: '20',
    fastingProtocol: '16:8',
    waterGoal: '3000',
  })

  useEffect(() => {
    if (profile?.targetWeight) {
      setGoals((g) => ({ ...g, targetWeight: String(profile.targetWeight) }))
    }
  }, [profile?.targetWeight])

  useEffect(() => {
    setGoals((g) => ({ ...g, waterGoal: String(waterGoal) }))
  }, [waterGoal])

  useEffect(() => {
    setGoals((g) => ({ ...g, dailyCarbs: String(carbLimit) }))
  }, [carbLimit])

  const set = (k, v) => setGoals((g) => ({ ...g, [k]: v }))

  const fields = [
    { key: 'targetWeight', label: 'লক্ষ্য ওজন (kg)', type: 'number' },
    { key: 'dailyCarbs', label: 'দৈনিক কার্ব লিমিট (g)', type: 'number' },
    { key: 'waterGoal', label: 'পানির লক্ষ্য (ml)', type: 'number' },
  ]

  const handleSave = async () => {
    await saveProfile({
      ...profile,
      targetWeight: goals.targetWeight ? parseFloat(goals.targetWeight) : null,
      daily_carb_limit_g: parseInt(goals.dailyCarbs, 10) || 20,
    })
    await updateSettings({ waterGoal: parseInt(goals.waterGoal, 10) || 3000 })
    nav(-1)
  }

  return (
    <div className="min-h-screen bg-bg">
      <PageHeader title="গোলস" showBack />

      <div className="px-4 pt-4 pb-8 flex flex-col gap-4">
        {fields.map((f) => (
          <div key={f.key}>
            <label className="font-hind text-sm font-medium text-muted mb-1 block">{f.label}</label>
            <input
              type={f.type}
              value={goals[f.key]}
              onChange={(e) => set(f.key, e.target.value)}
              className="w-full bg-surface border border-line rounded-xl px-4 py-3 font-hind text-sm text-[#2C3320] outline-none focus:border-primary"
            />
          </div>
        ))}

        <div>
          <label className="font-hind text-sm font-medium text-muted mb-1 block">ফাস্টিং প্রোটোকল</label>
          <select
            value={goals.fastingProtocol}
            onChange={(e) => set('fastingProtocol', e.target.value)}
            className="w-full bg-surface border border-line rounded-xl px-4 py-3 font-hind text-sm text-[#2C3320] outline-none focus:border-primary"
          >
            <option value="16:8">১৬:৮ — ইন্টারমিটেন্ট</option>
            <option value="18:6">১৮:৬ — লীনগেইন্স</option>
            <option value="20:4">২০:৪ — ওয়ান মিল</option>
            <option value="OMAD">ওমাড (২৩:১)</option>
          </select>
        </div>

        <button
          onClick={handleSave}
          className="w-full bg-primary text-white font-hind font-semibold text-lg py-4 rounded-xl tap flex items-center justify-center gap-2 mt-4"
        >
          <Save size={20} />
          সেভ করুন
        </button>
      </div>
    </div>
  )
}
