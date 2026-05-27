import { useEffect, useRef } from 'react'

function polarToCartesian(cx, cy, r, angleDeg) {
  const rad = ((angleDeg - 90) * Math.PI) / 180
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
}

function describeArc(cx, cy, r, startAngle, endAngle) {
  if (startAngle === endAngle) return ''
  const start = polarToCartesian(cx, cy, r, endAngle)
  const end = polarToCartesian(cx, cy, r, startAngle)
  const large = endAngle - startAngle > 180 ? 1 : 0
  return ['M', start.x, start.y, 'A', r, r, 0, large, 0, end.x, end.y].join(' ')
}

export default function BigStageRing({
  size = 280,
  strokeWidth = 14,
  progress = 0,
  stageLabel,
  stageSubLabel,
  elapsedFormatted,
  isFastingActive,
  children,
}) {
  const radius = (size - strokeWidth) / 2
  const viewBox = `0 0 ${size} ${size}`

  const trackColor = 'rgba(91, 127, 63, 0.12)'
  const activeColor = progress >= 0.9 ? '#E8B647' : '#5B7F3F'
  const completedColor = '#7BA05B'

  const startAngle = 0
  const sweepAngle = progress * 360
  const arcPath = describeArc(size / 2, size / 2, radius, startAngle, startAngle + sweepAngle)

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} viewBox={viewBox} className="transform -rotate-90">
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
        />
        {/* Active arc */}
        {arcPath && (
          <path
            d={arcPath}
            fill="none"
            stroke={activeColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
        )}
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center -mt-2">
        {children || (
          <>
            {/* Stage */}
            <p className="font-hind font-semibold text-lg text-[#2C3320]">{stageLabel}</p>
            <p className="font-hind text-sm text-muted mb-2">{stageSubLabel}</p>
            {/* Timer */}
            <p className="font-number font-bold text-4xl tracking-tight text-[#2C3320]">
              {elapsedFormatted}
            </p>
          </>
        )}
      </div>
    </div>
  )
}
