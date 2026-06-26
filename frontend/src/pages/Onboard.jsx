import { useState } from 'react'
import { onboardShop } from '../api'

export default function Onboard() {
  const [form, setForm] = useState({ raw_text: '', phone: '', lat: 12.9249, lng: 80.1000, address: '', area: '' })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const submit = async () => {
    setLoading(true); setError(null)
    try {
      const res = await onboardShop(form)
      setResult(res.data)
    } catch (e) {
      setError(e.response?.data?.detail || 'Something went wrong')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-orange-600 mb-2">🏪 List Your Shop</h1>
        <p className="text-gray-500 mb-6">Describe your shop in Tamil or English — AI does the rest</p>

        <div className="bg-white rounded-2xl shadow p-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Describe your shop</label>
            <textarea
              rows={4}
              placeholder="Hi, naan Ravi. Tambaram la tailoring shop vechirukken..."
              className="w-full mt-1 p-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              value={form.raw_text}
              onChange={e => setForm({...form, raw_text: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Phone</label>
              <input
                type="text" placeholder="9876543210"
                className="w-full mt-1 p-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                value={form.phone}
                onChange={e => setForm({...form, phone: e.target.value})}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Area</label>
              <input
                type="text" placeholder="Tambaram"
                className="w-full mt-1 p-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                value={form.area}
                onChange={e => setForm({...form, area: e.target.value})}
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Address</label>
            <input
              type="text" placeholder="15 Gandhi Street, Tambaram"
              className="w-full mt-1 p-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              value={form.address}
              onChange={e => setForm({...form, address: e.target.value})}
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            onClick={submit} disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl transition disabled:opacity-50"
          >
            {loading ? '⏳ AI is generating your profile...' : '🚀 List My Shop'}
          </button>
        </div>

        {result && (
          <div className="mt-6 bg-white rounded-2xl shadow p-6">
            <h2 className="text-xl font-bold text-green-600 mb-4">{result.message}</h2>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Shop:</span> {result.profile.shop_name}</p>
              <p><span className="font-medium">Category:</span> {result.profile.category}</p>
              <p><span className="font-medium">Description:</span> {result.profile.description}</p>
              <p><span className="font-medium">Hours:</span> {result.profile.opens_at} – {result.profile.closes_at}</p>
              <div>
                <span className="font-medium">Specialties:</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {result.profile.specialties?.map(s => (
                    <span key={s} className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs">{s}</span>
                  ))}
                </div>
              </div>
              <div>
                <span className="font-medium">Tags:</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {result.profile.tags?.map(t => (
                    <span key={t} className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">{t}</span>
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