import { useEffect } from 'react'
import { Capacitor } from '@capacitor/core'
import { LocalNotifications } from '@capacitor/local-notifications'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import useUserStore from './store/userStore'
import useSettingsStore from './store/settingsStore'
import { seedFoods } from './db/seedFoods'
import Onboarding from './pages/Onboarding'
import Home from './pages/Home'
import Fast from './pages/Fast'
import FastHistory from './pages/FastHistory'
import Food from './pages/Food'
import FoodSearch from './pages/FoodSearch'
import FoodCustom from './pages/FoodCustom'
import Ketone from './pages/Ketone'
import Water from './pages/Water'
import Weight from './pages/Weight'
import Stats from './pages/Stats'
import Settings from './pages/Settings'
import ProfileEdit from './pages/ProfileEdit'
import GoalsEdit from './pages/GoalsEdit'
import DataExport from './pages/DataExport'

export default function App() {
  const loadProfile = useUserStore((s) => s.loadProfile)
  const loadSettings = useSettingsStore((s) => s.loadSettings)

  useEffect(() => {
    loadProfile()
    loadSettings()
    seedFoods()

    if (Capacitor.isNativePlatform()) {
      LocalNotifications.requestPermissions()
    }
  }, [loadProfile, loadSettings])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/onboarding" element={<Onboarding />} />
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="fast" element={<Fast />} />
          <Route path="fast/history" element={<FastHistory />} />
          <Route path="food" element={<Food />} />
          <Route path="food/search" element={<FoodSearch />} />
          <Route path="food/custom" element={<FoodCustom />} />
          <Route path="ketone" element={<Ketone />} />
          <Route path="water" element={<Water />} />
          <Route path="weight" element={<Weight />} />
          <Route path="stats" element={<Stats />} />
          <Route path="settings" element={<Settings />} />
          <Route path="settings/profile" element={<ProfileEdit />} />
          <Route path="settings/goals" element={<GoalsEdit />} />
          <Route path="settings/export" element={<DataExport />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
