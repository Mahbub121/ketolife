import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Play, Pause, Square, History, ChevronRight, Clock } from 'lucide-react'
import useFastStore from '../store/fastStore'
import useFastingTimer from '../hooks/useFastingTimer'
import BigStageRing from '../components/timer/BigStageRing'
import ProtocolSelector from '../components/timer/ProtocolSelector'
import PageHeader from '../components/layout/PageHeader'
import bengaliNumber from '../utils/bengaliNumber'
import { useT } from '../hooks/useTranslation'

function isoToDatetimeLocal(iso) {
  const d = new Date(iso)
  const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000)
  return local.toISOString().slice(0, 16)
}

function nowDatetimeLocal() {
  const now = new Date()
  return new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16)
}

export default function Fast() {
  const nav = useNavigate()
  const { t, lang } = useT()
  const { activeFast, startFast, endFast, pauseFast, resumeFast, updateStartTime } = useFastStore()
  const timer = useFastingTimer()
  const [protocol, setProtocol] = useState('16:8')
  const [customStartTime, setCustomStartTime] = useState('')
  const [showStartTimePicker, setShowStartTimePicker] = useState(false)
  const [showEditTime, setShowEditTime] = useState(false)
  const [editTimeValue, setEditTimeValue] = useState('')
  const [startTimeWarning, setStartTimeWarning] = useState(false)

  useEffect(() => {
    if (activeFast?.protocol) {
      setProtocol(activeFast.protocol)
    }
  }, [activeFast])

  useEffect(() => {
    if (showEditTime && activeFast?.startTime) {
      setEditTimeValue(isoToDatetimeLocal(activeFast.startTime))
      setStartTimeWarning(false)
    }
  }, [showEditTime, activeFast])

  const handleStart = () => {
    const isoTime = customStartTime ? new Date(customStartTime).toISOString() : undefined
    startFast(protocol, isoTime)
    setCustomStartTime('')
    setShowStartTimePicker(false)
    setStartTimeWarning(false)
  }

  const handlePause = () => {
    if (activeFast?.status === 'paused') {
      resumeFast()
    } else {
      pauseFast()
    }
  }
  const handleEnd = () => endFast()

  const handleCustomStartTimeChange = (e) => {
    const val = e.target.value
    setCustomStartTime(val)
    const elapsedMs = val ? Date.now() - new Date(val).getTime() : 0
    setStartTimeWarning(elapsedMs > 48 * 3600 * 1000)
  }

  const handleEditTimeChange = (e) => {
    const val = e.target.value
    setEditTimeValue(val)
    const elapsedMs = Date.now() - new Date(val).getTime()
    setStartTimeWarning(elapsedMs > 48 * 3600 * 1000)
  }

  const handleApplyEditTime = () => {
    if (!editTimeValue || !activeFast) return
    updateStartTime(activeFast.id, new Date(editTimeValue).toISOString())
    setShowEditTime(false)
    setStartTimeWarning(false)
  }

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

        {/* Edit start time (during fast) */}
        {timer.isFasting && (
          <div className="w-full max-w-sm">
            <button
              onClick={() => setShowEditTime(!showEditTime)}
              className="flex items-center gap-1.5 text-sm text-muted font-hind tap"
            >
              <Clock size={14} />
              {t.edit_start_time}
            </button>
            {showEditTime && (
              <div className="mt-2 flex flex-col gap-2">
                <input
                  type="datetime-local"
                  max={nowDatetimeLocal()}
                  value={editTimeValue}
                  onChange={handleEditTimeChange}
                  className="w-full rounded-lg border border-line px-3 py-2 text-sm font-hind bg-surface"
                />
                {startTimeWarning && (
                  <p className="text-xs text-amber-600 font-hind">{t.start_time_warning}</p>
                )}
                <button
                  onClick={handleApplyEditTime}
                  className="self-start bg-primary text-white font-hind text-sm px-4 py-1.5 rounded-lg tap"
                >
                  {t.apply_btn}
                </button>
              </div>
            )}
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

        {/* Start time picker (pre-start) */}
        {!timer.isFasting && (
          <div className="w-full max-w-sm">
            <button
              onClick={() => setShowStartTimePicker(!showStartTimePicker)}
              className="flex items-center gap-1.5 text-sm text-muted font-hind tap"
            >
              <Clock size={14} />
              {t.start_time_label}
            </button>
            {showStartTimePicker && (
              <div className="mt-2 flex flex-col gap-2">
                <input
                  type="datetime-local"
                  max={nowDatetimeLocal()}
                  value={customStartTime}
                  onChange={handleCustomStartTimeChange}
                  className="w-full rounded-lg border border-line px-3 py-2 text-sm font-hind bg-surface"
                />
                {startTimeWarning && (
                  <p className="text-xs text-amber-600 font-hind">{t.start_time_warning}</p>
                )}
              </div>
            )}
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
