import { useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'

export default function PageHeader({ title, showBack, onBack, rightAction }) {
  const navigate = useNavigate()

  const handleBack = () => {
    if (onBack) {
      onBack()
    } else {
      navigate(-1)
    }
  }

  return (
    <header
      className="sticky top-0 z-40 flex items-center justify-between bg-surface border-b border-line px-4 h-14"
      style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
    >
      <div className="w-10 flex items-center justify-start">
        {showBack && (
          <button onClick={handleBack} className="flex items-center justify-center p-1 -ml-1 tap">
            <ChevronLeft size={24} className="text-primary" />
          </button>
        )}
      </div>
      <h1 className="font-hind font-semibold text-lg text-center text-[#2C3320] flex-1 truncate">
        {title}
      </h1>
      <div className="w-10 flex items-center justify-end">
        {rightAction || null}
      </div>
    </header>
  )
}
