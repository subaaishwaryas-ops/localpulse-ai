import { useState } from 'react'
import { getGaps } from '../api'

export default function GapMap() {
  const [area, setArea] = useState('')
  const [gaps, setGaps] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const fetch = async () => {
    if (!area.trim()) return
    setLoading(true)
    try {
      const res = await getGaps(area)
      setGaps(res.data.gaps || [])
      setSearched(true)
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
  }

  const getColor = (score) => {
    if (score > 10) return 'bg-red-100 border-red-300 text-red-800'
    if (score > 5) return 'bg-amber-100 border-amber-300 text-amber-800'
    return 'bg-green-100 border-green-300 text-green-800'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-purple-600 mb-2">🗺️ Gap Map</h1>
        <p className="text-gray-500 mb-6">Discover what businesses are missing in your neighborhood</p>

        <div className="flex gap-3 mb-6">
          <input
            type="text"
            placeholder="Enter area e.g. Tambaram"
            className="flex-1 p-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
            value={area}
            onChange={e => setArea(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && fetch()}
          />
          <button
            onClick={fetch} disabled={loading}
            className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold transition disabled:opacity-50"
          >
            {loading ? '...' : 'Analyze'}
          </button>
        </div>

        {searched && gaps.length === 0 && (
          <div className="bg-white rounded-2xl shadow p-8 text-center">
            <p className="text-4xl mb-3">📊</p>
            <p className="text-gray-600 font-medium">No gap data yet for this area</p>
            <p className="text-gray-400 text-sm mt-1">More searches needed to detect patterns</p>
          </div>
        )}

        <div className="space-y-4">
          {gaps.map((gap, i) => (
            <div key={i} className={`rounded-2xl border-2 p-5 ${getColor(gap.gap_score)}`}>
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg capitalize">{gap.category}</h3>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white bg-opacity-60">
                  Gap Score: {gap.gap_score?.toFixed(1)}
                </span>
              </div>
              <p className="font-semibold text-sm mb-1">💡 {gap.opportunity_label}</p>
              <p className="text-sm opacity-80">{gap.insight}</p>
              <div className="flex gap-4 mt-3 text-xs opacity-70">
                <span>🔍 {gap.search_count} searches</span>
                <span>🏪 {gap.shop_count} shops</span>
                {gap.estimated_daily_customers && <span>👥 ~{gap.estimated_daily_customers} potential customers/day</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}