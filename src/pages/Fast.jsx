import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Play, Pause, Square, History, ChevronRight } from 'lucide-react'
import useFastStore from '../store/fastStore'
import useFastingTimer from '../hooks/useFastingTimer'
import BigStageRing from '../components/timer/BigStageRing'
import ProtocolSelector from '../components/timer/ProtocolSelector'
import PageHeader from '../components/layout/PageHeader'
import bengaliNumber from '../utils/bengaliNumber'
import { useT } from '../hooks/useTranslation'

export default function Fast() {
  const nav = useNavigate()
  const { t, lang } = useT()
  const { activeFast, startFast, endFast, pauseFast, resumeFast } = useFastStore()
  const timer = useFastingTimer()
  const [protocol, setProtocol] = useState('১৬:৮')

  useEffect(() => {
    if (activeFast?.protocol) {
      setProtocol(activeFast.protocol)
    }
  }, [activeFast])

  const handleStart = () => startFast(protocol)
  const handlePause = () => {
    if (activeFast?.status === 'paused') {
      resumeFast()
    } else {
      pauseFast()
    }
  }
  const handleEnd = () => endFast()

  const stageLabel = lang === 'en' ? timer.currentStage?.en || '' : timer.currentStage?.bn || ''
  const stageSubLabel = lang === 'en' ? timer.currentStage?.sub_en || '' : timer.currentStage?.sub_bn || ''

  return (
    <div className="min-h-screen bg-bg">
      <PageHeader
        title={t.fasting_page_title}
        rightAction={
          <button
            onClick={() => nav('/fast/history')}
            className="flex items-center gap-1 tap"
          >
            <History size={18} className="text-primary" />
            <span className="font-hind text-sm text-primary">{t.history_btn}</span>
          </button>
        }
      />

      <div className="px-4 pt-4 pb-8 flex flex-col items-center gap-6">
        {/* Ring */}
        <BigStageRing
          progress={timer.progress}
          stageLabel={stageLabel}
          stageSubLabel={stageSubLabel}
          elapsedFormatted={timer.formattedElapsed}
          isFastingActive={timer.isFasting}
        />

        {/* Next stage hint */}
        {timer.isFasting && timer.nextStage && (
          <p className="font-hind text-sm text-muted text-center">
            {t.target_prefix} {lang === 'en' ? timer.nextStage.en : timer.nextStage.bn} — {bengaliNumber(Math.round(timer.nextStage.h))} {t.hours_unit}
          </p>
        )}

        {/* Remaining time */}
        {timer.isFasting && (
          <div className="bg-surface rounded-xl border border-line px-5 py-3">
            <p className="font-hind text-sm text-muted text-center">
              {t.remaining_prefix} <span className="font-number font-semibold text-[#2C3320]">{timer.formattedRemaining}</span>
            </p>
          </div>
        )}

        {/* Protocol selector (only when not fasting) */}
        {!timer.isFasting && (
          <div className="w-full max-w-sm">
            <label className="font-hind text-sm font-medium text-muted mb-1.5 block">
              {t.protocol_label}
            </label>
            <ProtocolSelector selected={protocol} onSelect={setProtocol} t={t} />
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-4 mt-2">
          {!timer.isFasting ? (
            <button
              onClick={handleStart}
              className="bg-primary text-white font-hind font-semibold text-lg px-10 py-4 rounded-xl tap flex items-center gap-2"
            >
              <Play size={20} fill="white" />
              {t.start_btn}
            </button>
          ) : (
            <>
              <button
                onClick={handlePause}
                className={`${
                  activeFast?.status === 'paused'
                    ? 'bg-accent text-[#2C3320]'
                    : 'bg-accent-tint text-accent'
                } font-hind font-semibold px-6 py-4 rounded-xl tap flex items-center gap-2`}
              >
                {activeFast?.status === 'paused' ? (
                  <Play size={20} fill="currentColor" />
                ) : (
                  <Pause size={20} />
                )}
                {activeFast?.status === 'paused' ? t.resume_btn : t.pause_btn}
              </button>
              <button
                onClick={handleEnd}
                className="bg-highlight-tint text-highlight font-hind font-semibold px-6 py-4 rounded-xl tap flex items-center gap-2"
              >
                <Square size={18} fill="currentColor" />
                {t.end_btn}
              </button>
            </>
          )}
        </div>

        {/* Your recent fasts */}
        {!timer.isFasting && (
          <button
            onClick={() => nav('/fast/history')}
            className="w-full max-w-sm flex items-center justify-between bg-surface rounded-xl border border-line px-4 py-3 tap mt-4"
          >
            <span className="font-hind text-sm text-[#2C3320]">{t.previous_fasts}</span>
            <ChevronRight size={18} className="text-muted" />
          </button>
        )}
      </div>
    </div>
  )
}
