import { useNavigate } from 'react-router-dom'

export default function QuickAddBtn({ icon: Icon, label, color, route }) {
  const navigate = useNavigate()

  return (
    <button
      onClick={() => navigate(route)}
      className="flex-1 tap active:scale-95"
      style={{
        background: 'var(--surface)',
        border: 'none',
        borderRadius: 18,
        padding: '14px 8px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
        boxShadow: '0 0 0 0.5px var(--line)',
        fontFamily: "'Hind Siliguri', sans-serif",
        transition: 'transform 120ms ease',
      }}
    >
      <div
        className="flex items-center justify-center"
        style={{
          width: 38,
          height: 38,
          borderRadius: 12,
          background: color,
          color: '#fff',
        }}
      >
        <Icon size={20} color="#fff" />
      </div>
      <span className="font-hind text-[12px] font-semibold" style={{ color: 'var(--text)' }}>
        {label}
      </span>
    </button>
  )
}
