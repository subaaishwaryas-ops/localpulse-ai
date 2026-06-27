import { useState } from 'react'
import { onboardShop } from '../api'

const categories = ['tailor', 'medical', 'tiffin', 'grocery', 'electronics', 'repair', 'salon', 'bakery', 'stationery', 'hardware', 'other']

const categoryIcons = {
  tailor: '🧵', medical: '💊', tiffin: '🍱', grocery: '🛒',
  electronics: '⚡', repair: '🔧', salon: '💇', bakery: '🥐',
  stationery: '📝', hardware: '🔨', other: '🏪'
}

export default function Onboard() {
  const [form, setForm] = useState({ raw_text: '', phone: '', lat: 12.9249, lng: 80.1000, address: '', area: '' })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [step, setStep] = useState(1)

  const submit = async () => {
    setLoading(true); setError(null)
    try {
      const res = await onboardShop(form)
      setResult(res.data)
      setStep(3)
    } catch (e) {
      setError(e.response?.data?.detail || 'Something went wrong')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-600/20 via-amber-600/20 to-yellow-600/20 blur-3xl" />
        <div className="relative max-w-2xl mx-auto px-6 pt-16 pb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-4 py-1.5 text-orange-400 text-sm mb-6">
            <span className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></span>
            AI-powered onboarding • 30 seconds
          </div>
          <h1 className="text-4xl font-black mb-3">List Your Shop <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400">for Free</span></h1>
          <p className="text-gray-400">Describe your shop in Tamil or English — AI does the rest</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 pb-20">
        {/* Steps indicator */}
        <div className="flex items-center justify-center gap-3 mb-10">
          {[1, 2, 3].map(s => (
            <div key={s} className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition ${step >= s ? 'bg-gradient-to-br from-orange-500 to-amber-500 text-white' : 'bg-gray-800 text-gray-500'}`}>
                {step > s ? '✓' : s}
              </div>
              {s < 3 && <div className={`w-12 h-0.5 ${step > s ? 'bg-orange-500' : 'bg-gray-800'}`} />}
            </div>
          ))}
        </div>

        {step === 1 && (
          <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8">
            <h2 className="text-xl font-bold mb-6">📝 Describe your shop</h2>
            <textarea
              rows={5}
              placeholder="Hi, naan Ravi. Tambaram la tailoring shop vechirukken. Gents ladies kids ellam thaikkuvom. Morning 9 to night 9 open irukkom. Wedding dress specialist..."
              className="w-full bg-gray-800 border border-gray-700 focus:border-orange-500 rounded-2xl px-5 py-4 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition text-sm resize-none mb-6"
              value={form.raw_text}
              onChange={e => setForm({...form, raw_text: e.target.value})}
            />
            <button
              onClick={() => setStep(2)}
              disabled={!form.raw_text.trim()}
              className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold py-4 rounded-2xl transition disabled:opacity-50"
            >
              Next — Add Details →
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 space-y-5">
            <h2 className="text-xl font-bold mb-2">📍 Shop Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Phone Number</label>
                <input
                  type="text" placeholder="9876543210"
                  className="w-full bg-gray-800 border border-gray-700 focus:border-orange-500 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none text-sm transition"
                  value={form.phone}
                  onChange={e => setForm({...form, phone: e.target.value})}
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Area / Neighborhood</label>
                <input
                  type="text" placeholder="Tambaram"
                  className="w-full bg-gray-800 border border-gray-700 focus:border-orange-500 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none text-sm transition"
                  value={form.area}
                  onChange={e => setForm({...form, area: e.target.value})}
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Full Address</label>
              <input
                type="text" placeholder="15 Gandhi Street, Tambaram, Chennai - 600045"
                className="w-full bg-gray-800 border border-gray-700 focus:border-orange-500 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none text-sm transition"
                value={form.address}
                onChange={e => setForm({...form, address: e.target.value})}
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-red-400 text-sm">
                ⚠️ {error}
              </div>
            )}

            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold py-4 rounded-2xl transition">
                ← Back
              </button>
              <button
                onClick={submit} disabled={loading || !form.phone.trim()}
                className="flex-2 flex-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold py-4 rounded-2xl transition disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    AI generating profile...
                  </span>
                ) : '🚀 List My Shop'}
              </button>
            </div>
          </div>
        )}

        {step === 3 && result && (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-3xl p-8 text-center">
              <div className="text-5xl mb-4">🎉</div>
              <h2 className="text-2xl font-black text-green-400 mb-2">{result.message}</h2>
              <p className="text-gray-400 text-sm">Your shop is now discoverable by thousands of customers</p>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 space-y-4">
              <h3 className="font-bold text-lg">✨ AI-Generated Profile</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-gray-800 rounded-2xl p-4">
                  <p className="text-gray-400 text-xs mb-1">Shop Name</p>
                  <p className="font-bold">{result.profile.shop_name}</p>
                </div>
                <div className="bg-gray-800 rounded-2xl p-4">
                  <p className="text-gray-400 text-xs mb-1">Category</p>
                  <p className="font-bold">{categoryIcons[result.profile.category]} {result.profile.category}</p>
                </div>
                <div className="bg-gray-800 rounded-2xl p-4">
                  <p className="text-gray-400 text-xs mb-1">Opens At</p>
                  <p className="font-bold">{result.profile.opens_at || 'N/A'}</p>
                </div>
                <div className="bg-gray-800 rounded-2xl p-4">
                  <p className="text-gray-400 text-xs mb-1">Closes At</p>
                  <p className="font-bold">{result.profile.closes_at || 'N/A'}</p>
                </div>
              </div>
              <div className="bg-gray-800 rounded-2xl p-4">
                <p className="text-gray-400 text-xs mb-2">Description</p>
                <p className="text-sm text-gray-300">{result.profile.description}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs mb-2">Specialties</p>
                <div className="flex flex-wrap gap-2">
                  {result.profile.specialties?.map(s => (
                    <span key={s} className="bg-orange-500/10 text-orange-400 border border-orange-500/20 px-3 py-1 rounded-lg text-xs">{s}</span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-gray-400 text-xs mb-2">AI Tags</p>
                <div className="flex flex-wrap gap-2">
                  {result.profile.tags?.map(t => (
                    <span key={t} className="bg-gray-700 text-gray-400 px-3 py-1 rounded-lg text-xs">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}