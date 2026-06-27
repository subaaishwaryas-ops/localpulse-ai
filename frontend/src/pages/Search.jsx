import { useState } from 'react'
import { searchShops } from '../api'

export default function Search() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [lang, setLang] = useState('en')

  const search = async () => {
    if (!query.trim()) return
    setLoading(true)
    try {
      const res = await searchShops({ query, lat: 12.9249, lng: 80.1000, language: lang })
      setResults(res.data.shops || [])
      setSearched(true)
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
  }

  const categoryColors = {
    tailor: 'from-pink-500 to-rose-500',
    medical: 'from-red-500 to-orange-500',
    tiffin: 'from-amber-500 to-yellow-500',
    grocery: 'from-green-500 to-emerald-500',
    electronics: 'from-blue-500 to-cyan-500',
    repair: 'from-purple-500 to-violet-500',
    salon: 'from-fuchsia-500 to-pink-500',
    bakery: 'from-orange-500 to-amber-500',
    other: 'from-gray-500 to-slate-500',
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 blur-3xl" />
        <div className="relative max-w-3xl mx-auto px-6 pt-16 pb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 text-blue-400 text-sm mb-6">
            <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
            AI-powered • Tamil + English
          </div>
          <h1 className="text-4xl font-black mb-3">Find Shops <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Near You</span></h1>
          <p className="text-gray-400">Search in Tamil, English, or Tanglish</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 pb-20">
        {/* Search bar */}
        <div className="relative mb-8">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="நல்ல tailor shop இங்க இருக்கா?"
                className="w-full bg-gray-900 border border-gray-700 focus:border-blue-500 rounded-2xl px-5 py-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition text-sm"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && search()}
              />
            </div>
            <button
              onClick={() => setLang(lang === 'en' ? 'ta' : 'en')}
              className={`px-4 rounded-2xl border font-semibold text-sm transition ${lang === 'ta' ? 'bg-orange-500/20 border-orange-500/50 text-orange-400' : 'bg-gray-900 border-gray-700 text-gray-400'}`}
            >
              {lang === 'ta' ? 'தமிழ்' : 'EN'}
            </button>
            <button
              onClick={search} disabled={loading}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-4 rounded-2xl font-bold transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  AI...
                </span>
              ) : '🔍 Search'}
            </button>
          </div>
        </div>

        {/* Quick searches */}
        <div className="flex flex-wrap gap-2 mb-8">
          {['Tailor near me', 'Medical store', 'Tiffin center', 'Electronics repair', 'Salon'].map(s => (
            <button key={s} onClick={() => { setQuery(s); }} className="bg-gray-900 border border-gray-800 hover:border-gray-600 text-gray-400 hover:text-white px-4 py-2 rounded-xl text-xs transition">
              {s}
            </button>
          ))}
        </div>

        {/* Zero results */}
        {searched && results.length === 0 && (
          <div className="bg-gray-900 border border-gray-800 rounded-3xl p-10 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">🌱</div>
            <p className="text-white font-bold text-lg mb-2">No shops found nearby</p>
            <p className="text-gray-400 text-sm">We've noted this gap — it shows up on our Gap Map for entrepreneurs!</p>
          </div>
        )}

        {/* Results */}
        <div className="space-y-4">
          {results.map((shop, i) => (
            <div key={shop.id} className="group bg-gray-900 border border-gray-800 hover:border-gray-600 rounded-3xl p-6 transition hover:-translate-y-0.5 hover:shadow-2xl">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${categoryColors[shop.category] || categoryColors.other} flex items-center justify-center text-lg font-bold text-white`}>
                    {shop.shop_name[0]}
                  </div>
                  <div>
                    <h3 className="font-bold text-white">{shop.shop_name}</h3>
                    <p className="text-gray-500 text-xs">📍 {shop.area} • {shop.category}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${shop.is_open ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                  {shop.is_open ? '● Open' : '● Closed'}
                </span>
              </div>
              <p className="text-gray-400 text-sm mb-3">{shop.description}</p>
              {shop.today_special && (
                <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-xl p-3 text-sm text-amber-400 mb-3">
                  🎉 {shop.today_special}
                </div>
              )}
              <div className="flex justify-between items-center">
                <div className="flex flex-wrap gap-2">
                  {shop.specialties?.slice(0,3).map(s => (
                    <span key={s} className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-1 rounded-lg text-xs">{s}</span>
                  ))}
                </div>
                <span className="text-gray-600 text-xs">{Math.round(shop.distance_meters)}m away</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}