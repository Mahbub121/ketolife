import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Save } from 'lucide-react'
import PageHeader from '../components/layout/PageHeader'
import { useT } from '../hooks/useTranslation'
import useUserStore from '../store/userStore'

export default function ProfileEdit() {
  const nav = useNavigate()
  const { t } = useT()
  const profile = useUserStore((s) => s.profile)
  const saveProfile = useUserStore((s) => s.saveProfile)

  const [form, setForm] = useState({
    name_bn: profile?.name_bn || '',
    age: profile?.age || '',
    height_cm: profile?.height_cm || '',
    current_weight_kg: profile?.current_weight_kg || '',
    gender: profile?.gender || 'male',
  })

  useEffect(() => {
    if (profile) {
      setForm({
        name_bn: profile.name_bn || '',
        age: profile.age || '',
        height_cm: profile.height_cm || '',
        current_weight_kg: profile.current_weight_kg || '',
        gender: profile.gender || 'male',
      })
    }
  }, [profile])

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }))

  const fields = [
    { key: 'name_bn', label: t.name_bn_label, type: 'text' },
    { key: 'age', label: t.age_label, type: 'number' },
    { key: 'height_cm', label: t.height_label, type: 'number' },
    { key: 'current_weight_kg', label: t.current_weight_label, type: 'number' },
  ]

  const handleSave = async () => {
    await saveProfile({
      name_bn: form.name_bn,
      age: form.age ? parseInt(form.age) : null,
      height_cm: form.height_cm ? parseFloat(form.height_cm) : null,
      current_weight_kg: form.current_weight_kg ? parseFloat(form.current_weight_kg) : null,
      gender: form.gender,
    })
    nav(-1)
  }

  return (
    <div className="min-h-screen bg-bg">
      <PageHeader title={t.profile_title} showBack />

      <div className="px-4 pt-4 pb-8 flex flex-col gap-4">
        {fields.map((f) => (
          <div key={f.key}>
            <label className="font-hind text-sm font-medium text-muted mb-1 block">{f.label}</label>
            <input
              type={f.type}
              value={form[f.key]}
              onChange={(e) => set(f.key, e.target.value)}
              className="w-full bg-surface border border-line rounded-xl px-4 py-3 font-hind text-sm text-[#2C3320] outline-none focus:border-primary"
            />
          </div>
        ))}

        {/* Gender */}
        <div>
          <label className="font-hind text-sm font-medium text-muted mb-1 block">{t.gender_label}</label>
          <div className="flex gap-2">
            {['male', 'female'].map((g) => (
              <button
                key={g}
                onClick={() => set('gender', g)}
                className={`flex-1 py-3 rounded-xl font-hind text-sm tap ${
                  form.gender === g
                    ? 'bg-primary text-white'
                    : 'bg-surface border border-line text-[#2C3320]'
                }`}
              >
                {g === 'male' ? t.male_label : t.female_label}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleSave}
          className="w-full bg-primary text-white font-hind font-semibold text-lg py-4 rounded-xl tap flex items-center justify-center gap-2 mt-4"
        >
          <Save size={20} />
          {t.save_profile_btn}
        </button>
      </div>
    </div>
  )
}
