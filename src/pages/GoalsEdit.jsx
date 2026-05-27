import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Save } from 'lucide-react'
import PageHeader from '../components/layout/PageHeader'
import { useT } from '../hooks/useTranslation'
import useUserStore from '../store/userStore'
import useSettingsStore from '../store/settingsStore'

export default function GoalsEdit() {
  const nav = useNavigate()
  const { t } = useT()
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
    { key: 'targetWeight', label: t.target_weight_label, type: 'number' },
    { key: 'dailyCarbs', label: t.daily_carbs_label, type: 'number' },
    { key: 'waterGoal', label: t.water_goal_label, type: 'number' },
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
      <PageHeader title={t.goals_title} showBack />

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
          <label className="font-hind text-sm font-medium text-muted mb-1 block">{t.protocol_label}</label>
          <select
            value={goals.fastingProtocol}
            onChange={(e) => set('fastingProtocol', e.target.value)}
            className="w-full bg-surface border border-line rounded-xl px-4 py-3 font-hind text-sm text-[#2C3320] outline-none focus:border-primary"
          >
            <option value="16:8">{t.protocol_16_8}</option>
            <option value="18:6">{t.protocol_18_6}</option>
            <option value="20:4">{t.protocol_20_4}</option>
            <option value="OMAD">{t.protocol_omad}</option>
          </select>
        </div>

        <button
          onClick={handleSave}
          className="w-full bg-primary text-white font-hind font-semibold text-lg py-4 rounded-xl tap flex items-center justify-center gap-2 mt-4"
        >
          <Save size={20} />
          {t.save_goals_btn}
        </button>
      </div>
    </div>
  )
}
