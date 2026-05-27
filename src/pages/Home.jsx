import { useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Settings, ChevronRight, UtensilsCrossed, Droplets, Zap, Weight, Sparkles } from 'lucide-react'
import { useT } from '../hooks/useTranslation'

import useFastStore from '../store/fastStore'
import useUserStore from '../store/userStore'
import useFastingTimer from '../hooks/useFastingTimer'
import useDailyStats from '../hooks/useDailyStats'
import stages from '../data/stages'
import dailyTips from '../data/dailyTips'
import Ring from '../components/timer/Ring'
import MacroBar from '../components/dashboard/MacroBar'
import QuickAddBtn from '../components/dashboard/QuickAddBtn'
import { toBnNum } from '../utils/bengaliNumber'

// ── Greeting ────────────────────────────────────────────────────────────

function getGreeting(t) {
  const h = new Date().getHours()
  if (h >= 5 && h < 12) return t.greet_morning
  if (h >= 12 && h < 17) return t.greet_afternoon
  return t.greet_evening
}

// ── Unique gradient ID for the hero mini ring ────────────────────────────
const heroRingGradId = 'hero_ring_grad'

// ── Streak badge ─────────────────────────────────────────────────────────

function StreakBadge({ count }) {
  return (
    <div
      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full font-bold"
      style={{
        background: 'linear-gradient(135deg, #FBE3DC, #FBF1D6)',
        color: 'var(--text)',
      }}
    >
      <span style={{ fontSize: 16, lineHeight: 1 }}>🔥</span>
      <span className="font-number" style={{ fontSize: 14 }}>
        {count}
      </span>
    </div>
  )
}

// ── Stage row used in hero card ─────────────────────────────────────────

function StageRow({ active, label, sub, muted }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-0.5">
        <span
          className="rounded-full flex-shrink-0"
          style={{
            width: 8,
            height: 8,
            background: active ? 'var(--primary)' : 'var(--line-strong)',
          }}
        />
        <span
          className="font-hind"
          style={{
            fontSize: active ? 15 : 13.5,
            fontWeight: 700,
            color: muted ? 'var(--muted)' : 'var(--text)',
          }}
        >
          {label}
        </span>
      </div>
      <div
        className="font-hind ml-4 font-medium"
        style={{ fontSize: 12, color: 'var(--muted)' }}
      >
        {sub}
      </div>
    </div>
  )
}

// ── Blob decorative element ─────────────────────────────────────────────

function Blob({ color, size, top, left, right, opacity = 0.45 }) {
  return (
    <div
      className="absolute rounded-full pointer-events-none"
      style={{ width: size, height: size, background: color, top, left, right, opacity }}
    />
  )
}

// ── Home Dashboard ───────────────────────────────────────────────────────

export default function Home() {
  const navigate = useNavigate()

  const activeFast = useFastStore((s) => s.activeFast)
  const history = useFastStore((s) => s.history)
  const loadActiveFast = useFastStore((s) => s.loadActiveFast)
  const loadHistory = useFastStore((s) => s.loadHistory)

  const profile = useUserStore((s) => s.profile)
  const { t, lang } = useT()

  const timer = useFastingTimer()
  const { totals, targets, isLoading: statsLoading } = useDailyStats()

  // Load data on mount
  useEffect(() => {
    loadActiveFast()
    loadHistory(30)
  }, [loadActiveFast, loadHistory])

  // Compute streak from history
  const streak = useMemo(
    () => history.filter((f) => f.actualDurationHours >= f.targetDurationHours).length,
    [history]
  )

  // Rotating daily tip
  const tipIndex = useMemo(() => {
    const now = new Date()
    const start = new Date(now.getFullYear(), 0, 0)
    const dayOfYear = Math.floor((now - start) / 86400000)
    return dayOfYear % dailyTips.length
  }, [])

  // Name display
  const displayName = profile
    ? (lang === 'en' && profile.name_en ? profile.name_en : (profile.name_bn || t.dear_user))
    : t.dear_user
  const greeting = getGreeting(t)

  // Hero ring stage markers (24h scale)
  const ringStages = useMemo(
    () =>
      stages
        .filter((s) => s.h <= 24)
        .map((s) => ({
          frac: s.h / 24,
          passed: s.h <= timer.elapsedHours,
        })),
    [timer.elapsedHours]
  )

  // Next stage remaining time
  const nextStageRemaining = timer.nextStage
    ? Math.max(0, (timer.nextStage.h - timer.elapsedHours) * 3600)
    : 0
  const fmtNextStage = (sec) => {
    const h = Math.floor(sec / 3600)
    const m = Math.floor((sec % 3600) / 60)
    return `${h}h ${String(m).padStart(2, '0')}m`
  }

  return (
    <div className="relative min-h-screen bg-bg px-[18px]" style={{ paddingBottom: 130 }}>
      <Blob color="var(--primary-tint)" size={220} top={-50} right={-80} opacity={0.7} />
      <Blob color="var(--accent-tint)" size={160} top={120} left={-60} opacity={0.55} />

      {/* ═══ Header ═══ */}
      <div className="flex items-center justify-between pt-[14px] mb-[18px] relative">
        <div>
          <p
            className="font-hind text-[13px] font-medium"
            style={{ color: 'var(--muted)' }}
          >
            {greeting}
          </p>
          <h1 className="font-hind text-[22px] font-bold" style={{ color: 'var(--text)' }}>
            {displayName} 👋
          </h1>
        </div>
        <div className="flex items-center gap-2.5">
          <StreakBadge count={streak} />
          <button
            onClick={() => navigate('/settings')}
            className="tap"
            style={{
              width: 44,
              height: 44,
              borderRadius: 14,
              border: 'none',
              background: 'var(--surface)',
              boxShadow: '0 0 0 0.5px var(--line)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Settings size={20} color="var(--text-soft)" />
          </button>
        </div>
      </div>

      {/* ═══ Hero Fast Card ═══ */}
      {timer.isFasting ? (
        /* ── Active fast ── */
        <div
          onClick={() => navigate('/fast')}
          className="tap rounded-[20px] mb-4 relative overflow-hidden"
          style={{
            padding: 20,
            background: 'var(--surface)',
            boxShadow: '0 1px 2px rgba(44,51,32,0.04), 0 8px 24px -8px rgba(44,51,32,0.08)',
            cursor: 'pointer',
          }}
        >
          <div className="flex items-start justify-between mb-2">
            <div>
              <div
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11.5px] font-bold"
                style={{
                  background: 'var(--primary-tint)',
                  color: 'var(--primary-deep)',
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{
                    background: 'var(--primary)',
                    animation: 'pulse-soft 1.6s ease-in-out infinite',
                  }}
                />
                {t.fasting_in_progress}
              </div>
              <p
                className="font-hind text-[13px] font-medium mt-2"
                style={{ color: 'var(--muted)' }}
              >
                {t.elapsed_prefix} ·{' '}
                <span className="font-number">{activeFast?.protocol || '১৬:৮'}</span>
              </p>
            </div>
            <ChevronRight size={20} color="var(--muted)" />
          </div>

          <div className="flex items-center gap-[18px] mt-2">
            <Ring
              size={148}
              stroke={10}
              progress={timer.progress}
              gradient
              stages={ringStages}
            >
              <div className="text-center">
                <div
                  className="font-number"
                  style={{
                    fontSize: 28,
                    fontWeight: 700,
                    color: 'var(--text)',
                    letterSpacing: -0.5,
                    lineHeight: 1,
                  }}
                >
                  {timer.formattedElapsedShort}
                </div>
                <div
                  className="font-hind text-[11px] font-medium mt-1"
                  style={{ color: 'var(--muted)' }}
                >
                  /{' '}
                  <span className="font-number">
                    {activeFast?.targetDurationHours
                      ? `${String(activeFast.targetDurationHours).padStart(2, '0')}:০০`
                      : '১৬:০০'}
                  </span>
                </div>
              </div>
            </Ring>

            <div className="flex-1 min-w-0 flex flex-col gap-2.5">
              <StageRow
                active
                label={timer.currentStage.bn}
                sub={timer.currentStage.sub_bn}
              />
              {timer.nextStage && (
                <StageRow
                  label={timer.nextStage.bn}
                  sub={`${t.next_prefix} · ${fmtNextStage(nextStageRemaining)}`}
                  muted
                />
              )}
            </div>
          </div>
        </div>
      ) : (
        /* ── No active fast ── */
        <div
          onClick={() => navigate('/fast')}
          className="tap rounded-[20px] mb-4 relative overflow-hidden"
          style={{
            padding: 20,
            background: 'var(--surface)',
            boxShadow: '0 1px 2px rgba(44,51,32,0.04), 0 8px 24px -8px rgba(44,51,32,0.08)',
            cursor: 'pointer',
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <div
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11.5px] font-bold"
              style={{
                background: 'var(--accent-tint)',
                color: 'var(--primary-deep)',
              }}
            >
              {t.eating_window}
            </div>
            <ChevronRight size={20} color="var(--muted)" />
          </div>
          <p
            className="font-hind text-[13px] font-medium mb-4"
            style={{ color: 'var(--muted)' }}
          >
            {t.no_fast_active}
          </p>
          <button
            onClick={(e) => {
              e.stopPropagation()
              navigate('/fast')
            }}
            className="tap w-full py-3.5 rounded-2xl border-none font-hind text-sm font-bold text-white"
            style={{
              background: 'var(--primary)',
              boxShadow: '0 8px 18px -4px rgba(91,127,63,0.45)',
            }}
          >
            {t.start_fast}
          </button>
        </div>
      )}

      {/* ═══ Macros Card ═══ */}
      <div
        className="rounded-[20px] mb-4"
        style={{
          padding: 18,
          background: 'var(--surface)',
          boxShadow: '0 1px 2px rgba(44,51,32,0.04), 0 8px 24px -8px rgba(44,51,32,0.08)',
        }}
      >
        <div className="flex items-baseline justify-between mb-3.5">
          <h3 className="font-hind text-[15px] font-bold" style={{ color: 'var(--text)' }}>
            {t.todays_macros}
          </h3>
          <span className="font-number text-[12px] font-semibold" style={{ color: 'var(--muted)' }}>
            {totals.kcal} / {targets.kcal} {t.kcal_short}
          </span>
        </div>

        {/* Net carbs — featured */}
        <div className="mb-3.5">
          <MacroBar
            value={totals.carbs}
            target={targets.carbs}
            color={totals.carbs > targets.carbs ? 'var(--warning)' : 'var(--highlight)'}
            label={t.net_carbs}
            big
          />
        </div>

        {/* Fat + Protein side by side */}
        <div className="flex gap-3.5">
          <MacroBar
            value={totals.fat}
            target={targets.fat}
            color="var(--accent)"
            label={t.fat}
          />
          <MacroBar
            value={totals.protein}
            target={targets.protein}
            color="var(--primary)"
            label={t.protein}
          />
        </div>
      </div>

      {/* ═══ Quick Add ═══ */}
      <div className="mb-4">
        <h3 className="font-hind text-[14px] font-bold mb-2.5" style={{ color: 'var(--text)' }}>
          {t.quick_add}
        </h3>
        <div className="flex gap-2.5">
          <QuickAddBtn icon={UtensilsCrossed} label={t.food_label} color="var(--primary)" route="/food" />
          <QuickAddBtn icon={Droplets} label={t.water_label} color="#5BA3D0" route="/water" />
          <QuickAddBtn icon={Zap} label={t.ketone_label} color="var(--highlight)" route="/ketone" />
          <QuickAddBtn icon={Weight} label={t.weight_label} color="var(--accent)" route="/weight" />
        </div>
      </div>

      {/* ═══ Daily Tip ═══ */}
      <div
        className="rounded-[20px] relative overflow-hidden"
        style={{
          padding: 16,
          background: 'linear-gradient(135deg, var(--accent-tint), var(--bg))',
          boxShadow: '0 1px 2px rgba(44,51,32,0.04), 0 8px 24px -8px rgba(44,51,32,0.08)',
        }}
      >
        <div className="flex items-start gap-3">
          <div
            className="flex-shrink-0 flex items-center justify-center"
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: 'var(--accent)',
              color: '#fff',
            }}
          >
            <Sparkles size={20} color="#fff" />
          </div>
          <div className="flex-1 min-w-0">
            <p
              className="font-hind text-[12px] font-bold uppercase tracking-wide mb-1"
              style={{ color: 'var(--primary-deep)' }}
            >
              {t.tip_of_day}
            </p>
            <p
              className="font-hind text-[13.5px] leading-relaxed"
              style={{ color: 'var(--text-soft)' }}
            >
              {dailyTips[tipIndex]}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
