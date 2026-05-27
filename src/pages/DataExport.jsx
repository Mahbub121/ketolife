import { useState } from 'react'
import { Download, FileText } from 'lucide-react'
import PageHeader from '../components/layout/PageHeader'
import db from '../db/dexie'

export default function DataExport() {
  const [loading, setLoading] = useState(false)

  const handleExport = async () => {
    setLoading(true)
    try {
      const data = {
        exportedAt: new Date().toISOString(),
        version: 1,
        userProfile: await db.userProfile.toArray(),
        fastingSessions: await db.fastingSessions.toArray(),
        foodEntries: await db.foodEntries.toArray(),
        foodItems: await db.foodItems.toArray(),
        ketoneReadings: await db.ketoneReadings.toArray(),
        waterEntries: await db.waterEntries.toArray(),
        weightEntries: await db.weightEntries.toArray(),
        achievements: await db.achievements.toArray(),
        articles: await db.articles.toArray(),
        readingProgress: await db.readingProgress.toArray(),
      }
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `ketolife-export-${new Date().toISOString().slice(0, 10)}.json`
      a.click()
      URL.revokeObjectURL(url)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg">
      <PageHeader title="ডাটা এক্সপোর্ট" showBack />

      <div className="px-4 pt-4 pb-8 flex flex-col gap-4">
        <div className="bg-surface rounded-xl border border-line p-6 flex flex-col items-center gap-3">
          <FileText size={40} className="text-line" />
          <p className="font-hind text-sm text-muted text-center">
            আপনার সব ডাটা JSON ফরম্যাটে ডাউনলোড করুন
          </p>
          <button
            onClick={handleExport}
            disabled={loading}
            className={`bg-primary text-white font-hind font-semibold px-6 py-3 rounded-xl tap flex items-center gap-2 ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
          >
            <Download size={18} />
            {loading ? 'এক্সপোর্ট হচ্ছে...' : 'ডাটা এক্সপোর্ট করুন'}
          </button>
        </div>

        <div className="bg-highlight-tint rounded-xl p-4">
          <p className="font-hind text-xs text-highlight">
            ডাটা শুধু আপনার ডিভাইসে রাখা হয়। কোনো সার্ভারে আপলোড করা হয় না।
          </p>
        </div>
      </div>
    </div>
  )
}
