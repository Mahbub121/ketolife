import { useLocation, useNavigate } from 'react-router-dom'
import { Home, Timer, UtensilsCrossed, BarChart3, BookOpen } from 'lucide-react'
import { useT } from '../../hooks/useTranslation'

export default function BottomTabBar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { t } = useT()

  const tabs = [
    { label: t.home, icon: Home, path: '/' },
    { label: t.fasting, icon: Timer, path: '/fast' },
    { label: t.food, icon: UtensilsCrossed, path: '/food' },
    { label: t.stats, icon: BarChart3, path: '/stats' },
    { label: t.learn, icon: BookOpen, path: '/learn' },
  ]

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around bg-surface border-t border-line"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      {tabs.map((tab) => {
        const isActive = location.pathname === tab.path || location.pathname.startsWith(tab.path + '/')
        const Icon = tab.icon
        return (
          <button
            key={tab.path}
            onClick={() => navigate(tab.path)}
            className="flex flex-col items-center justify-center gap-0.5 py-2 px-3 min-w-0 tap"
          >
            <Icon
              size={24}
              className={isActive ? 'text-primary' : 'text-muted'}
              strokeWidth={isActive ? 2.5 : 1.8}
            />
            <span
              className={`text-[10px] leading-tight font-hind ${
                isActive ? 'text-primary font-semibold' : 'text-muted'
              }`}
            >
              {tab.label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
