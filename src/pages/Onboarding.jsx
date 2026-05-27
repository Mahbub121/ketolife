import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import useUserStore from '../store/userStore'
import { useT } from '../hooks/useTranslation'

export default function Onboarding() {
  const [step, setStep] = useState(0)
  const nav = useNavigate()
  const saveProfile = useUserStore((s) => s.saveProfile)
  const { t } = useT()

  const slides = [
    {
      emoji: '🥑',
      title: t.slide_1_title,
      desc: t.slide_1_desc,
    },
    {
      emoji: '⏳',
      title: t.slide_2_title,
      desc: t.slide_2_desc,
    },
    {
      emoji: '🍗',
      title: t.slide_3_title,
      desc: t.slide_3_desc,
    },
    {
      emoji: '📊',
      title: t.slide_4_title,
      desc: t.slide_4_desc,
    },
  ]
  const current = slides[step]
  const isLast = step === slides.length - 1

  const next = async () => {
    if (isLast) {
      await saveProfile({ onboardedAt: new Date().toISOString() })
      nav('/')
    } else {
      setStep((s) => s + 1)
    }
  }

  const pips = slides.map((_, i) => (
    <span
      key={i}
      className={`h-2 rounded-full transition-all duration-300 ${
        i === step ? 'w-6 bg-primary' : 'w-2 bg-line'
      }`}
    />
  ))

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      {/* Top */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <span className="text-6xl mb-5">{current.emoji}</span>
        <h1 className="font-hind font-bold text-2xl text-[#2C3320] text-center mb-3">
          {current.title}
        </h1>
        <p className="font-hind text-base text-muted text-center leading-relaxed max-w-xs">
          {current.desc}
        </p>
      </div>
      {/* Bottom */}
      <div className="px-6 pb-10">
        <div className="flex items-center justify-center gap-2 mb-6">{pips}</div>
        <button
          onClick={next}
          className="w-full bg-primary text-white font-hind font-semibold text-lg py-4 rounded-xl tap flex items-center justify-center gap-2"
        >
          {isLast ? t.start_app : t.next_step}
          {!isLast && <ChevronRight size={20} />}
        </button>
      </div>
    </div>
  )
}
