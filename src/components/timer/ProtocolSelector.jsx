import { useState, useRef, useEffect } from 'react'
import { Clock, ChevronDown } from 'lucide-react'

const protocols = [
  { label: '১৬:৮', labelKey: 'label_16_8', key: 'protocol_16_8', hours: 16 },
  { label: '১৮:৬', labelKey: 'label_18_6', key: 'protocol_18_6', hours: 18 },
  { label: '২০:৪', labelKey: 'label_20_4', key: 'protocol_20_4', hours: 20 },
  { label: '২৪:০', labelKey: 'label_24h', key: 'protocol_24h', hours: 24 },
  { label: 'ওমাড (OMAD)', labelKey: 'label_omad', key: 'protocol_omad', hours: 23 },
  { label: 'কাস্টম', labelKey: 'label_custom', key: 'protocol_custom', hours: 16 },
]

export default function ProtocolSelector({ selected, onSelect, t }) {
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
          <span className="font-hind font-medium text-[#2C3320]">{t[current.labelKey]}</span>
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
              <span className="font-hind font-medium text-[#2C3320] text-sm">{t[p.labelKey]}</span>
              <span className="font-hind text-xs text-muted">{t[p.key]}</span>
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
