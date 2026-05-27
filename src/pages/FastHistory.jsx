import { useEffect } from 'react'
import { Clock, CheckCircle2, XCircle } from 'lucide-react'
import useFastStore from '../store/fastStore'
import PageHeader from '../components/layout/PageHeader'
import bengaliNumber from '../utils/bengaliNumber'
import { useT } from '../hooks/useTranslation'

export default function FastHistory() {
  const { history, loadHistory, isLoading } = useFastStore()
  const { t } = useT()

  useEffect(() => {
    loadHistory(30)
  }, [loadHistory])

  const formatDate = (iso) => {
    const d = new Date(iso)
    return `${bengaliNumber(d.getDate())} ${d.toLocaleDateString('bn', { month: 'short' })}`
  }

  return (
    <div className="min-h-screen bg-bg">
      <PageHeader title={t.history_page_title} showBack />

      <div className="px-4 pt-4 pb-8">
        {isLoading && (
          <p className="font-hind text-sm text-muted text-center py-8">{t.loading}</p>
        )}

        {!isLoading && history.length === 0 && (
          <div className="flex flex-col items-center py-12">
            <Clock size={48} className="text-line mb-3" />
            <p className="font-hind text-base text-muted">{t.no_records}</p>
          </div>
        )}

        <div className="flex flex-col gap-2">
          {history.map((fast) => {
            const start = new Date(fast.startTime)
            const end = fast.endTime ? new Date(fast.endTime) : null
            const hours = fast.actualDurationHours || 0
            const hh = Math.floor(hours)
            const mm = Math.round((hours - hh) * 60)

            return (
              <div
                key={fast.id}
                className="bg-surface rounded-xl border border-line px-4 py-3 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={20} className="text-success" />
                  <div>
                    <p className="font-hind font-medium text-[#2C3320] text-sm">
                      {fast.protocol || t.default_protocol}
                    </p>
                    <p className="font-hind text-xs text-muted">
                      {formatDate(fast.startTime)}
                      {end && ` — ${hh}h ${bengaliNumber(mm)}m`}
                    </p>
                  </div>
                </div>
                <div className="font-number text-sm font-semibold text-primary">
                  {bengaliNumber(hh)}h {bengaliNumber(mm)}m
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
