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
    } catch (e) {
      setError(e.response?.data?.detail || 'Shop not found')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50 p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-teal-600 mb-2">📊 Owner Dashboard</h1>
        <p className="text-gray-500 mb-6">Enter your phone number to see your shop analytics</p>

        <div className="flex gap-3 mb-6">
          <input
            type="text" placeholder="9876543210"
            className="flex-1 p-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && fetch()}
          />
          <button
            onClick={fetch} disabled={loading}
            className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-xl font-semibold transition disabled:opacity-50"
          >
            {loading ? '...' : 'View'}
          </button>
        </div>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        {data && (
          <div className="space-y-4">
            {/* Shop Status */}
            <div className="bg-white rounded-2xl shadow p-5">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">{data.shop.shop_name}</h2>
                  <p className="text-gray-500 text-sm">{data.shop.area} • {data.shop.category}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${data.shop.is_open ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {data.shop.is_open ? '🟢 Open' : '🔴 Closed'}
                </span>
              </div>
              {data.shop.today_special && (
                <div className="mt-3 bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-800">
                  🎉 {data.shop.today_special}
                </div>
              )}
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Profile Views', value: data.metrics.profile_views, icon: '👁️' },
                { label: 'Reviews', value: data.metrics.new_reviews, icon: '⭐' },
                { label: 'Avg Rating', value: data.metrics.avg_rating || 'N/A', icon: '📈' },
              ].map(m => (
                <div key={m.label} className="bg-white rounded-2xl shadow p-4 text-center">
                  <p className="text-2xl">{m.icon}</p>
                  <p className="text-2xl font-bold text-teal-600">{m.value}</p>
                  <p className="text-xs text-gray-500">{m.label}</p>
                </div>
              ))}
            </div>

            {/* AI Report */}
            {data.ai_report && (
              <div className="bg-white rounded-2xl shadow p-5">
                <h3 className="font-bold text-gray-800 mb-3">🤖 AI Weekly Report</h3>
                <p className="text-teal-700 font-semibold mb-3">{data.ai_report.headline}</p>
                <div className="space-y-2 mb-4">
                  {data.ai_report.insights?.map((insight, i) => (
                    <p key={i} className="text-sm text-gray-600">• {insight}</p>
                  ))}
                </div>
                <h4 className="font-semibold text-gray-700 mb-2">💡 AI Tips</h4>
                <div className="space-y-2 mb-4">
                  {data.ai_report.ai_tips?.map((tip, i) => (
                    <p key={i} className="text-sm text-gray-600 bg-teal-50 p-2 rounded-lg">→ {tip}</p>
                  ))}
                </div>
                <div className="bg-purple-50 rounded-xl p-3">
                  <p className="text-sm font-semibold text-purple-700">🎯 Next Week Goal</p>
                  <p className="text-sm text-purple-600 mt-1">{data.ai_report.next_week_goal}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}