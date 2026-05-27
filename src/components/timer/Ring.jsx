import { useMemo } from 'react'

export default function Ring({
  size = 56,
  stroke = 5,
  progress = 0,
  color = 'var(--primary)',
  children,
  gradient = false,
  stages = null,
}) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const offset = c * (1 - Math.max(0, Math.min(1, progress)))
  const gradientId = useMemo(() => 'ring_grad_' + Math.random().toString(36).slice(2, 8), [size])

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        {gradient && (
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="var(--primary)" />
              <stop offset="60%" stopColor="var(--primary)" />
              <stop offset="100%" stopColor="var(--accent)" />
            </linearGradient>
          </defs>
        )}
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="var(--bg-deep)"
          strokeWidth={stroke}
          fill="none"
        />
        {/* Progress */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={gradient ? `url(#${gradientId})` : color}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 800ms cubic-bezier(.2,.8,.2,1)' }}
        />
        {/* Stage tick marks */}
        {stages &&
          stages.map((s, i) => {
            const ang = s.frac * Math.PI * 2
            const x1 = size / 2 + Math.cos(ang) * (r - stroke / 2 - 2)
            const y1 = size / 2 + Math.sin(ang) * (r - stroke / 2 - 2)
            const x2 = size / 2 + Math.cos(ang) * (r + stroke / 2 + 2)
            const y2 = size / 2 + Math.sin(ang) * (r + stroke / 2 + 2)
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={s.passed ? 'var(--primary-deep)' : 'rgba(44,51,32,0.22)'}
                strokeWidth={2}
                strokeLinecap="round"
              />
            )
          })}
      </svg>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {children}
      </div>
    </div>
  )
}
