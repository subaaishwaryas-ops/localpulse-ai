import { useState } from 'react'
import { getDashboard } from '../api'

export default function Dashboard() {
  const [phone, setPhone] = useState('')
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetch = async () => {
    if (!phone.trim()) return
    setLoading(true); setError(null)
    try {
      const res = await getDashboard(phone)
      setData(res.data)
    } catch(e) {
      setError(e.response?.data?.detail || 'Shop not found')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-600/20 via-green-600/20 to-emerald-600/20 blur-3xl" />
        <div className="relative max-w-2xl mx-auto px-6 pt-16 pb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-teal-500/10 border border-teal-500/20 rounded-full px-4 py-1.5 text-teal-400 text-sm mb-6">
            <span className="w-2 h-2 bg-teal-400 rounded-full animate-pulse"></span>
            AI Weekly Intelligence
          </div>
          <h1 className="text-4xl font-black mb-3">Owner <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-green-400">Dashboard</span></h1>
          <p className="text-gray-400">Your shop analytics + AI-powered weekly report</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 pb-20">
        <div className="flex gap-3 mb-8">
          <input
            type="text" placeholder="Enter your phone number"
            className="flex-1 bg-gray-900 border border-gray-700 focus:border-teal-500 rounded-2xl px-5 py-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition text-sm"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && fetch()}
          />
          <button onClick={fetch} disabled={loading} className="bg-gradient-to-r from-teal-500 to-green-500 hover:from-teal-600 hover:to-green-600 text-white px-8 py-4 rounded-2xl font-bold transition disabled:opacity-50">
            {loading ? '...' : 'View'}
          </button>
        </div>

        {error && <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 text-red-400 text-sm mb-4">⚠️ {error}</div>}

        {data && (
          <div className="space-y-4">
            {/* Shop card */}
            <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-black">{data.shop.shop_name}</h2>
                  <p className="text-gray-400 text-sm">📍 {data.shop.area} • {data.shop.category}</p>
                </div>
                <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${data.shop.is_open ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                  {data.shop.is_open ? '● Open Now' : '● Closed'}
                </span>
              </div>
              {data.shop.today_special && (
                <div className="mt-4 bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 text-amber-400 text-sm">
                  🎉 {data.shop.today_special}
                </div>
              )}
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Profile Views', value: data.metrics.profile_views, icon: '👁️', color: 'from-blue-500/20 to-cyan-500/20', border: 'border-blue-500/20', text: 'text-blue-400' },
                { label: 'Reviews', value: data.metrics.new_reviews, icon: '⭐', color: 'from-amber-500/20 to-yellow-500/20', border: 'border-amber-500/20', text: 'text-amber-400' },
                { label: 'Avg Rating', value: data.metrics.avg_rating || 'N/A', icon: '📈', color: 'from-green-500/20 to-emerald-500/20', border: 'border-green-500/20', text: 'text-green-400' },
              ].map(m => (
                <div key={m.label} className={`bg-gradient-to-br ${m.color} border ${m.border} rounded-2xl p-4 text-center`}>
                  <p className="text-2xl mb-1">{m.icon}</p>
                  <p className={`text-2xl font-black ${m.text}`}>{m.value}</p>
                  <p className="text-gray-500 text-xs mt-1">{m.label}</p>
                </div>
              ))}
            </div>

            {/* AI Report */}
            {data.ai_report && (
              <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-lg">🤖</div>
                  <div>
                    <h3 className="font-bold">AI Weekly Report</h3>
                    <p className="text-gray-500 text-xs">Generated by Groq Llama</p>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-teal-500/10 to-green-500/10 border border-teal-500/20 rounded-2xl p-4">
                  <p className="text-teal-400 font-bold">{data.ai_report.headline}</p>
                </div>

                <div>
                  <p className="text-gray-400 text-xs mb-3 uppercase tracking-wider">Insights</p>
                  <div className="space-y-2">
                    {data.ai_report.insights?.map((insight, i) => (
                      <div key={i} className="flex gap-3 bg-gray-800 rounded-xl p-3">
                        <span className="text-teal-400 mt-0.5">•</span>
                        <p className="text-sm text-gray-300">{insight}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-gray-400 text-xs mb-3 uppercase tracking-wider">AI Tips</p>
                  <div className="space-y-2">
                    {data.ai_report.ai_tips?.map((tip, i) => (
                      <div key={i} className="flex gap-3 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-3">
                        <span className="text-purple-400">→</span>
                        <p className="text-sm text-gray-300">{tip}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-2xl p-4">
                  <p className="text-amber-400 text-xs font-bold mb-1">🎯 NEXT WEEK GOAL</p>
                  <p className="text-white text-sm">{data.ai_report.next_week_goal}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}