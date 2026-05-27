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
import db from '../db/dexie'
import useUserStore from '../store/userStore'
import useSettingsStore from '../store/settingsStore'

const sections = [
  {
    label: 'প্রোফাইল',
    items: [
      { icon: User, label: 'প্রোফাইল', path: '/settings/profile' },
      { icon: Target, label: 'গোলস', path: '/settings/goals' },
    ],
  },
  {
    label: 'প্রেফারেন্স',
    items: [
      { icon: Palette, label: 'থিম', path: '', meta: 'অ্যাভোকাডো' },
      { icon: Languages, label: 'ভাষা', path: '', meta: 'বাংলা' },
      { icon: Bell, label: 'নোটিফিকেশন', path: '', meta: 'চালু' },
    ],
  },
  {
    label: 'অন্যান্য',
    items: [
      { icon: Database, label: 'ডাটা এক্সপোর্ট', path: '/settings/export' },
      { icon: Info, label: 'অ্যাপ সম্পর্কে', path: '', meta: 'v0.1.0' },
    ],
  },
  {
    label: 'অ্যাপ',
    items: [
      { icon: Trash2, label: 'সব ডাটা মুছুন', action: 'clear', destructive: true },
    ],
  },
]

export default function Settings() {
  const nav = useNavigate()
  const [showClearModal, setShowClearModal] = useState(false)

  return (
    <div className="min-h-screen bg-bg">
      <PageHeader title="সেটিংস" />

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
      </div>

      {showClearModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-6">
          <div className="bg-surface rounded-xl max-w-sm w-full p-6">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle size={24} className="text-highlight" />
              <h2 className="font-hind text-lg font-semibold text-[#2C3320]">সতর্কতা</h2>
            </div>
            <p className="font-hind text-sm text-muted mb-6">
              আপনার সব ডাটা চিরতরে মুছে যাবে। এই কাজ ফেরত নেয়া যাবে না।
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowClearModal(false)}
                className="flex-1 bg-surface border border-line text-[#2C3320] rounded-xl py-3 tap font-hind text-sm"
              >
                না, বাতিল করুন
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
                হ্যাঁ, মুছুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
