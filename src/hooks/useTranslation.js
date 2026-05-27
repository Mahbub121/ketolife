import { T } from '../data/translations'
import useSettingsStore from '../store/settingsStore'

export function useT() {
  const lang = useSettingsStore((s) => s.language)
  return { t: T[lang], lang }
}
