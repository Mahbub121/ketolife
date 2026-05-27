import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { BookOpen, CheckCircle2 } from 'lucide-react'
import PageHeader from '../components/layout/PageHeader'
import db from '../db/dexie'

const FALLBACK = {
  'keto-intro': {
    title: 'কেটো ডায়েট কী?',
    body: 'কেটোজেনিক ডায়েট একটি লো-কার্ব, হাই-ফ্যাট খাদ্যাভ্যাস যা আপনার শরীরকে কিটোসিসে নিয়ে যায়। কিটোসিস অবস্থায় শরীর শর্করার পরিবর্তে ফ্যাট থেকে কেটোনস তৈরি করে এবং তা জ্বালানি হিসেবে ব্যবহার করে।\n\nকিটো ডায়েটের মূল নীতি:\n\n• কার্বোহাইড্রেট: ৫-১০% (২০-৫০ গ্রাম/দিন)\n• প্রোটিন: ২০-২৫%\n• ফ্যাট: ৭০-৭৫%\n\nবাংলাদেশি খাবারের মধ্যে কেটো ফ্রেন্ডলি অপশনের মধ্যে রয়েছে: মাছ, মাংস, ডিম, শাকসবজি, অলিভ অয়েল, নারকেল তেল, বাদাম ইত্যাদি।',
  },
  'if-intro': {
    title: 'ইন্টারমিটেন্ট ফাস্টিং গাইড',
    body: 'ইন্টারমিটেন্ট ফাস্টিং (IF) একটি খাদ্যাভ্যাস যেখানে আপনি নির্দিষ্ট সময় খাবার খান এবং বাকি সময় উপোস থাকেন। এটি কেটো ডায়েটের সাথে খুব ভালোভাবে কাজ করে।\n\nজনপ্রিয় IF প্রোটোকল:\n\n• ১৬:৮ — ১৬ ঘন্টা উপোস, ৮ ঘন্টা খাবার\n• ১৮:৬ — ১৮ ঘন্টা উপোস, ৬ ঘন্টা খাবার\n• ২০:৪ — ২০ ঘন্টা উপোস, ৪ ঘন্টা খাবার\n• OMAD — ২৩ ঘন্টা উপোস, ১ ঘন্টা খাবার\n\nউপোসকালে শুধু পানি, ব্ল্যাক কফি, এবং গ্রিন টি অনুমোদিত।',
  },
  'autophagy': {
    title: 'অটোফেজি কি ও কেন',
    body: 'অটোফেজি হল আপনার শরীরের নিজস্ব কোষ পরিষ্কার করার প্রক্রিয়া। ফাস্টিং অবস্থায় শরীর পুরনো ও ক্ষতিগ্রস্ত কোষ ভেঙে ফেলে এবং নতুন কোষ তৈরি করে।\n\nঅটোফেজির উপকারিতা:\n\n• কোষ পুনরুজ্জীবন\n• ইমিউন সিস্টেম শক্তিশালীকরণ\n• বার্ধক্য প্রতিরোধ\n• নিউরোপ্রোটেকশন\n\nগবেষণা অনুযায়ী, ১৮-২৪ ঘন্টা ফাস্টিং এর পর অটোফেজি সর্বোচ্চ মাত্রায় পৌঁছায়।',
  },
  'keto-foods': {
    title: 'কেটো ফ্রেন্ডলি খাবার',
    body: 'বাংলাদেশি খাবারের মধ্যে কেটো ফ্রেন্ডলি অপশন:\n\n✅ খাওয়া যাবে:\n• ইলিশ, রুই, কাতলা, চিংড়ি, টুনা\n• গরু, খাসি, মুরগি, ডিম\n• শাক (পালং, লালশাক), বাঁধাকপি, ফুলকপি\n• অলিভ অয়েল, নারকেল তেল, ঘি, মাখন\n• বাদাম, আখরোট, চিয়া সিড\n\n❌ এড়িয়ে চলুন:\n• ভাত, রুটি, পাউরুটি\n• চিনি, মিষ্টি, সফট ড্রিঙ্কস\n• আলু, মিষ্টি আলু\n• ফল (বেরি বাদে)\n• ডাল, ছোলা, মুগ',
  },
}

export default function ArticleDetail() {
  const { id } = useParams()
  const [article, setArticle] = useState(null)
  const [isRead, setIsRead] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        let data = await db.articles.get(id)
        if (!data) {
          data = FALLBACK[id] || null
        }
        setArticle(data)

        if (data) {
          const reads = await db.readingProgress
            .where('article_id')
            .equals(id)
            .toArray()
          setIsRead(reads.length > 0)
        }
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  const markAsRead = async () => {
    await db.readingProgress.add({
      article_id: id,
      read_at: new Date().toISOString(),
    })
    setIsRead(true)
  }

  return (
    <div className="min-h-screen bg-bg">
      <PageHeader title={article?.title || 'আর্টিকেল'} showBack />

      <div className="px-4 pt-4 pb-8">
        {loading ? (
          <p className="font-hind text-sm text-muted text-center py-8">লোড হচ্ছে...</p>
        ) : article ? (
          <div className="flex flex-col gap-4">
            <div className="bg-surface rounded-xl border border-line p-5">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen size={16} className="text-primary" />
                {article.category && (
                  <span className="font-hind text-xs text-muted">{article.category}</span>
                )}
              </div>
              <div className="font-hind text-sm text-[#2C3320] leading-relaxed whitespace-pre-line">
                {article.body}
              </div>
            </div>

            {isRead ? (
              <div className="flex items-center justify-center gap-2 bg-primary-tint rounded-xl py-3">
                <CheckCircle2 size={18} className="text-primary" />
                <span className="font-hind text-sm font-medium text-primary">পড়া হয়েছে</span>
              </div>
            ) : (
              <button
                onClick={markAsRead}
                className="w-full bg-primary text-white font-hind font-semibold text-lg py-4 rounded-xl tap"
              >
                পড়া শেষ
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center py-12">
            <p className="font-hind text-base text-muted">আর্টিকেল পাওয়া যায়নি</p>
          </div>
        )}
      </div>
    </div>
  )
}
