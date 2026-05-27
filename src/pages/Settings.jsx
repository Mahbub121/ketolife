import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  User,
  Target,
  Bell,
  Info,
  Database,
  ChevronRight,
  Palette,
  Languages,
  Trash2,
  AlertTriangle,
} from 'lucide-react'
import PageHeader from '../components/layout/PageHeader'
import { useT } from '../hooks/useTranslation'
import db from '../db/dexie'
import useUserStore from '../store/userStore'
import useSettingsStore from '../store/settingsStore'

export default function Settings() {
  const nav = useNavigate()
  const [showClearModal, setShowClearModal] = useState(false)
  const { t, lang } = useT()
  const updateSettings = useSettingsStore((s) => s.updateSettings)

  const sections = [
    {
      label: t.profile_section,
      items: [
        { icon: User, label: t.profile_item, path: '/settings/profile' },
        { icon: Target, label: t.goals_item, path: '/settings/goals' },
      ],
    },
    {
      label: t.preferences_section,
      items: [
        { icon: Palette, label: t.theme_item, path: '', meta: t.theme_value },
        { icon: Languages, label: t.language_item, path: '', meta: t.language_value },
        { icon: Bell, label: t.notifications_item, path: '', meta: t.notifications_value },
      ],
    },
    {
      label: t.other_section,
      items: [
        { icon: Database, label: t.data_export_item, path: '/settings/export' },
        { icon: Info, label: t.about_app, path: '', meta: t.app_version },
      ],
    },
    {
      label: t.app_section,
      items: [
        { icon: Trash2, label: t.clear_all_data, action: 'clear', destructive: true },
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-bg">
      <PageHeader title={t.settings_title} />

      <div className="px-4 pt-4 pb-24 flex flex-col gap-6">
        {sections.map((s) => (
          <div key={s.label}>
            <h2 className="font-hind text-xs font-semibold text-muted uppercase tracking-wider mb-2 px-1">
              {s.label}
            </h2>
            <div className="bg-surface rounded-xl border border-line overflow-hidden">
              {s.items.map((item, i) => (
                <button
                  key={item.label}
                  onClick={() => {
                    if (item.action === 'clear') return setShowClearModal(true)
                    if (item.path) nav(item.path)
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3.5 tap ${
                    i !== s.items.length - 1 ? 'border-b border-line' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon
                      size={20}
                      className={item.destructive ? 'text-highlight' : 'text-primary'}
                    />
                    <span className="font-hind text-sm text-[#2C3320]">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.meta && (
                      <span className="font-hind text-xs text-muted">{item.meta}</span>
                    )}
                    {item.path && <ChevronRight size={16} className="text-muted" />}
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Language toggle */}
        <div>
          <h2 className="font-hind text-xs font-semibold text-muted uppercase tracking-wider mb-2 px-1">
            {t.lang_section_header}
          </h2>
          <div className="bg-surface rounded-xl border border-line p-3 flex gap-2">
            <button
              onClick={() => updateSettings({ language: 'bn' })}
              className={`flex-1 py-2.5 rounded-xl font-hind text-sm font-medium tap ${lang === 'bn' ? 'bg-primary text-white' : 'bg-surface border border-line text-[#2C3320]'}`}
            >
              {t.lang_bn}
            </button>
            <button
              onClick={() => updateSettings({ language: 'en' })}
              className={`flex-1 py-2.5 rounded-xl font-hind text-sm font-medium tap ${lang === 'en' ? 'bg-primary text-white' : 'bg-surface border border-line text-[#2C3320]'}`}
            >
              {t.lang_en}
            </button>
          </div>
        </div>
      </div>

      {showClearModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-6">
          <div className="bg-surface rounded-xl max-w-sm w-full p-6">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle size={24} className="text-highlight" />
              <h2 className="font-hind text-lg font-semibold text-[#2C3320]">{t.warning_title}</h2>
            </div>
            <p className="font-hind text-sm text-muted mb-6">
              {t.warning_message}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowClearModal(false)}
                className="flex-1 bg-surface border border-line text-[#2C3320] rounded-xl py-3 tap font-hind text-sm"
              >
                {t.cancel_btn}
              </button>
              <button
                onClick={async () => {
                  await Promise.all(db.tables.map((t) => t.clear()))
                  useUserStore.getState().resetProfile()
                  useSettingsStore.getState().resetSettings()
                  nav('/onboarding')
                }}
                className="flex-1 bg-highlight text-white rounded-xl py-3 tap font-hind text-sm"
              >
                {t.confirm_delete_btn}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
