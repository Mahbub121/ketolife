import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Play, Pause, Square, History, ChevronRight } from 'lucide-react'
import useFastStore from '../store/fastStore'
import useFastingTimer from '../hooks/useFastingTimer'
import BigStageRing from '../components/timer/BigStageRing'
import ProtocolSelector from '../components/timer/ProtocolSelector'
import PageHeader from '../components/layout/PageHeader'
import bengaliNumber from '../utils/bengaliNumber'

export default function Fast() {
  const nav = useNavigate()
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

  const stageBn = timer.currentStage?.bn || ''
  const stageSubBn = timer.currentStage?.sub_bn || ''

  return (
    <div className="min-h-screen bg-bg">
      <PageHeader
        title="ফাস্টিং"
        rightAction={
          <button
            onClick={() => nav('/fast/history')}
            className="flex items-center gap-1 tap"
          >
            <History size={18} className="text-primary" />
            <span className="font-hind text-sm text-primary">হিস্ট্রি</span>
          </button>
        }
      />

      <div className="px-4 pt-4 pb-8 flex flex-col items-center gap-6">
        {/* Ring */}
        <BigStageRing
          progress={timer.progress}
          stageLabel={stageBn}
          stageSubLabel={stageSubBn}
          elapsedFormatted={timer.formattedElapsed}
          isFastingActive={timer.isFasting}
        />

        {/* Next stage hint */}
        {timer.isFasting && timer.nextStage && (
          <p className="font-hind text-sm text-muted text-center">
            লক্ষ্য: {timer.nextStage.bn} — {bengaliNumber(Math.round(timer.nextStage.h))} ঘন্টা
          </p>
        )}

        {/* Remaining time */}
        {timer.isFasting && (
          <div className="bg-surface rounded-xl border border-line px-5 py-3">
            <p className="font-hind text-sm text-muted text-center">
              বাকি: <span className="font-number font-semibold text-[#2C3320]">{timer.formattedRemaining}</span>
            </p>
          </div>
        )}

        {/* Protocol selector (only when not fasting) */}
        {!timer.isFasting && (
          <div className="w-full max-w-sm">
            <label className="font-hind text-sm font-medium text-muted mb-1.5 block">
              ফাস্টিং প্রোটোকল
            </label>
            <ProtocolSelector selected={protocol} onSelect={setProtocol} />
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
              শুরু করুন
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
                {activeFast?.status === 'paused' ? 'রিজিউম' : 'পজ'}
              </button>
              <button
                onClick={handleEnd}
                className="bg-highlight-tint text-highlight font-hind font-semibold px-6 py-4 rounded-xl tap flex items-center gap-2"
              >
                <Square size={18} fill="currentColor" />
                শেষ
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
            <span className="font-hind text-sm text-[#2C3320]">পূর্বের ফাস্টিং</span>
            <ChevronRight size={18} className="text-muted" />
          </button>
        )}
      </div>
    </div>
  )
}
