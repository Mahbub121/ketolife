import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { BookOpen, ChevronRight, CheckCircle2 } from 'lucide-react'
import PageHeader from '../components/layout/PageHeader'
import db from '../db/dexie'

const categories = ['সব', 'কেটো বেসিক', 'ফাস্টিং', 'রেসিপি']

export default function Learn() {
  const nav = useNavigate()
  const [articles, setArticles] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('সব')
  const [readSet, setReadSet] = useState(new Set())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const all = await db.articles.toArray()
        setArticles(all)

        const progress = await db.readingProgress.toArray()
        setReadSet(new Set(progress.map((r) => r.article_id)))
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const filtered =
    selectedCategory === 'সব'
      ? articles
      : articles.filter((a) => a.category === selectedCategory)

  return (
    <div className="min-h-screen bg-bg">
      <PageHeader title="শিখুন" />

      <div className="px-4 pt-4 pb-8 flex flex-col gap-4">
        {/* Category pills */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`whitespace-nowrap px-4 py-1.5 rounded-full font-hind text-sm tap ${
                selectedCategory === cat
                  ? 'bg-primary text-white'
                  : 'bg-surface border border-line text-muted'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Article cards */}
        {loading ? (
          <p className="font-hind text-sm text-muted text-center py-8">লোড হচ্ছে...</p>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center py-8">
            <BookOpen size={32} className="text-line mb-2" />
            <p className="font-hind text-sm text-muted">কোনো আর্টিকেল নেই</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((article) => {
              const isRead = readSet.has(article.id)
              return (
                <button
                  key={article.id}
                  onClick={() => nav(`/learn/article/${article.id}`)}
                  className="bg-surface rounded-xl border border-line px-4 py-3 flex items-center justify-between tap"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <BookOpen size={18} className="text-primary flex-shrink-0" />
                    <div className="text-left flex-1 min-w-0">
                      <p className="font-hind text-sm text-[#2C3320] truncate">{article.title}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="font-hind text-xs text-muted">{article.readTime}</span>
                        {isRead && (
                          <span className="flex items-center gap-0.5 text-success font-hind text-[11px]">
                            <CheckCircle2 size={11} />
                            পড়া হয়েছে
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-muted flex-shrink-0" />
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
