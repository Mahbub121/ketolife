export default function MacroBar({ value = 0, target = 100, color = 'var(--primary)', label = '', unit = 'g', big = false }) {
  const pct = Math.min(100, target > 0 ? (value / target) * 100 : 0)

  return (
    <div className="flex-1 min-w-0">
      <div className="flex items-baseline justify-between mb-1">
        <span
          className="font-hind text-[12.5px] font-semibold"
          style={{ color: 'var(--text-soft)' }}
        >
          {label}
        </span>
        <span className="font-number" style={{ fontSize: big ? 14 : 12, fontWeight: 700, color: 'var(--text)' }}>
          {value.toFixed(value < 10 ? 1 : 0)}
          <span style={{ color: 'var(--muted)', fontWeight: 500 }}>
            /{target}{unit}
          </span>
        </span>
      </div>
      <div
        className="rounded-full overflow-hidden"
        style={{ height: big ? 8 : 6, background: 'var(--bg-deep)' }}
      >
        <div
          className="rounded-full"
          style={{
            width: `${pct}%`,
            height: '100%',
            background: color,
            transition: 'width 600ms cubic-bezier(.2,.8,.2,1)',
          }}
        />
      </div>
    </div>
  )
}
