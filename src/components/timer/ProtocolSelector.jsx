import { useState, useRef, useEffect } from 'react'
import { Clock, ChevronDown } from 'lucide-react'

const protocols = [
  { label: '১৬:৮', sub: '16 / 8 — ইন্টারমিটেন্ট', hours: 16 },
  { label: '১৮:৬', sub: '18 / 6 — লীনগেইন্স', hours: 18 },
  { label: '২০:৪', sub: '20 / 4 — ওয়ান মিল', hours: 20 },
  { label: '২৪:০', sub: '24h — ওয়ান মিল এ ডে', hours: 24 },
  { label: 'ওমাড (OMAD)', sub: '২৩:১ — একবেলা খাবার', hours: 23 },
  { label: 'কাস্টম', sub: 'আপনার ইচ্ছামত সময়', hours: 16 },
]

export default function ProtocolSelector({ selected, onSelect }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  const current = protocols.find((p) => p.label === selected) || protocols[0]

  useEffect(() => {
    const handle = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [])

  const handleSelect = (p) => {
    onSelect(p.label)
    setOpen(false)
  }

  return (
    <div className="relative w-full" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between bg-surface border border-line rounded-xl px-4 py-3 tap"
      >
        <div className="flex items-center gap-3">
          <Clock size={20} className="text-primary" />
          <span className="font-hind font-medium text-[#2C3320]">{current.label}</span>
        </div>
        <ChevronDown size={18} className={`text-muted transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute top-full mt-1 left-0 right-0 z-50 bg-surface rounded-xl border border-line shadow-lg overflow-hidden">
          {protocols.map((p) => (
            <button
              key={p.label}
              onClick={() => handleSelect(p)}
              className={`w-full flex items-center gap-3 px-4 py-3 tap border-b border-line last:border-0 ${
                selected === p.label ? 'bg-primary-tint' : ''
              }`}
            >
              <span className="font-hind font-medium text-[#2C3320] text-sm">{p.label}</span>
              <span className="font-hind text-xs text-muted">{p.sub}</span>
              {selected === p.label && (
                <div className="ml-auto w-2 h-2 rounded-full bg-primary" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
