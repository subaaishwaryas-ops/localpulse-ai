import { useState } from 'react'
import { getGaps } from '../api'

const categoryIcons = { tailor:'🧵', medical:'💊', tiffin:'🍱', grocery:'🛒', electronics:'⚡', repair:'🔧', salon:'💇', bakery:'🥐', cycle_repair:'🚲', hardware:'🔨', other:'🏪' }

export default function GapMap() {
  const [area, setArea] = useState('')
  const [gaps, setGaps] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const fetch = async () => {
    if (!area.trim()) return
    setLoading(true)
    try {
      const res = await getGaps(area.trim())
      setGaps(res.data.gaps || [])
      setSearched(true)
    } catch(e) { console.error(e) }
    setLoading(false)
  }

  const getGrade = (score) => {
    if (score > 15) return { label: 'Critical Gap', color: 'from-red-500/20 to-rose-500/20', border: 'border-red-500/30', text: 'text-red-400', badge: 'bg-red-500/20 text-red-400' }
    if (score > 8) return { label: 'High Demand', color: 'from-amber-500/20 to-orange-500/20', border: 'border-amber-500/30', text: 'text-amber-400', badge: 'bg-amber-500/20 text-amber-400' }
    return { label: 'Opportunity', color: 'from-green-500/20 to-emerald-500/20', border: 'border-green-500/30', text: 'text-green-400', badge: 'bg-green-500/20 text-green-400' }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-rose-600/20 blur-3xl" />
        <div className="relative max-w-3xl mx-auto px-6 pt-16 pb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-1.5 text-purple-400 text-sm mb-6">
            <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></span>
            AI Business Intelligence
          </div>
          <h1 className="text-4xl font-black mb-3">Gap <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Radar</span></h1>
          <p className="text-gray-400">Discover where demand exists but no shop does</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 pb-20">
        <div className="flex gap-3 mb-8">
          <input
            type="text" placeholder="Enter area e.g. Tambaram"
            className="flex-1 bg-gray-900 border border-gray-700 focus:border-purple-500 rounded-2xl px-5 py-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition text-sm"
            value={area}
            onChange={e => setArea(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && fetch()}
          />
          <button onClick={fetch} disabled={loading} className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-4 rounded-2xl font-bold transition disabled:opacity-50">
            {loading ? '...' : 'Analyze'}
          </button>
        </div>

        {searched && gaps.length === 0 && (
          <div className="bg-gray-900 border border-gray-800 rounded-3xl p-10 text-center">
            <p className="text-4xl mb-3">📊</p>
            <p className="text-white font-bold">No gap data yet</p>
            <p className="text-gray-400 text-sm mt-1">More searches needed to detect patterns</p>
          </div>
        )}

        <div className="space-y-4">
          {gaps.map((gap, i) => {
            const grade = getGrade(gap.gap_score)
            return (
              <div key={i} className={`bg-gradient-to-r ${grade.color} border ${grade.border} rounded-3xl p-6`}>
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-900/50 rounded-2xl flex items-center justify-center text-2xl">
                      {categoryIcons[gap.category] || '🏪'}
                    </div>
                    <div>
                      <h3 className="font-black text-lg capitalize">{gap.category.replace('_', ' ')}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${grade.badge}`}>{grade.label}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-2xl font-black ${grade.text}`}>{gap.gap_score?.toFixed(0)}x</p>
                    <p className="text-gray-500 text-xs">gap score</p>
                  </div>
                </div>
                <p className={`font-bold text-sm mb-1 ${grade.text}`}>💡 {gap.opportunity_label}</p>
                {gap.insight && <p className="text-gray-300 text-sm mb-3">{gap.insight}</p>}
                <div className="flex gap-4 text-xs text-gray-400">
                  <span>🔍 {gap.search_count} searches this week</span>
                  <span>🏪 {gap.shop_count} shops exist</span>
                </div>
                {gap.estimated_daily_customers && (
                  <div className="mt-3 bg-gray-900/30 rounded-xl p-3 text-sm">
                    <span className="text-white font-bold">~{gap.estimated_daily_customers} potential customers/day</span>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}