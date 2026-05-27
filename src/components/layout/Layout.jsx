import { useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import BottomTabBar from './BottomTabBar'
import useUserStore from '../../store/userStore'

const hideTabBarRoutes = ['/onboarding']

export default function Layout() {
  const location = useLocation()
  const navigate = useNavigate()
  const isOnboarded = useUserStore((s) => s.isOnboarded)
  const isLoading = useUserStore((s) => s.isLoading)
  const showTabBar = !hideTabBarRoutes.includes(location.pathname)

  // Onboarding redirect
  useEffect(() => {
    if (!isLoading && !isOnboarded && location.pathname !== '/onboarding') {
      navigate('/onboarding')
    }
  }, [isOnboarded, isLoading, navigate, location.pathname])

  return (
    <div className="min-h-screen bg-bg">
      <main className={showTabBar ? 'pb-24' : ''}>
        <Outlet />
      </main>
      {showTabBar && <BottomTabBar />}
    </div>
  )
}
