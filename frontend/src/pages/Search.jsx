import { useState } from 'react'
import { searchShops } from '../api'

export default function Search() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const search = async () => {
    if (!query.trim()) return
    setLoading(true)
    try {
      const res = await searchShops({ query, lat: 12.9249, lng: 80.1000, language: 'en' })
      setResults(res.data.shops || [])
      setSearched(true)
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-indigo-600 mb-2">🔍 Find Local Shops</h1>
        <p className="text-gray-500 mb-6">Search in Tamil or English</p>

        <div className="flex gap-3 mb-6">
          <input
            type="text"
            placeholder="நல்ல tailor shop இங்க இருக்கா?"
            className="flex-1 p-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && search()}
          />
          <button
            onClick={search} disabled={loading}
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold transition disabled:opacity-50"
          >
            {loading ? '...' : 'Search'}
          </button>
        </div>

        {searched && results.length === 0 && (
          <div className="bg-white rounded-2xl shadow p-8 text-center">
            <p className="text-4xl mb-3">🌱</p>
            <p className="text-gray-600 font-medium">No shops found nearby</p>
            <p className="text-gray-400 text-sm mt-1">We've noted this gap — someone might open one soon!</p>
          </div>
        )}

        <div className="space-y-4">
          {results.map(shop => (
            <div key={shop.id} className="bg-white rounded-2xl shadow p-5">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-gray-800 text-lg">{shop.shop_name}</h3>
                  <p className="text-gray-500 text-sm">{shop.area} • {shop.category}</p>
                  <p className="text-gray-600 text-sm mt-2">{shop.description}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${shop.is_open ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {shop.is_open ? '🟢 Open' : '🔴 Closed'}
                </span>
              </div>
              {shop.today_special && (
                <div className="mt-3 bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-800">
                  🎉 {shop.today_special}
                </div>
              )}
              {shop.specialties?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {shop.specialties.map(s => (
                    <span key={s} className="bg-indigo-50 text-indigo-600 px-2 py-1 rounded-full text-xs">{s}</span>
                  ))}
                </div>
              )}
              <p className="text-gray-400 text-xs mt-3">{Math.round(shop.distance_meters)}m away</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}