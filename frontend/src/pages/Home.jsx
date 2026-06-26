import { useNavigate } from 'react-router-dom'

const cards = [
  { icon: '🏪', title: 'List Your Shop', desc: 'Onboard in 30 seconds via AI', path: '/onboard', bg: 'from-orange-500 to-amber-500' },
  { icon: '🔍', title: 'Find Shops', desc: 'Search in Tamil or English', path: '/search', bg: 'from-blue-500 to-indigo-500' },
  { icon: '🗺️', title: 'Gap Map', desc: 'Discover business opportunities', path: '/gaps', bg: 'from-purple-500 to-pink-500' },
  { icon: '📊', title: 'Dashboard', desc: 'Your shop analytics + AI report', path: '/dashboard', bg: 'from-teal-500 to-green-500' },
]

const stats = [
  { value: '63M+', label: 'Small businesses in India' },
  { value: '0%', label: 'Have digital presence' },
  { value: '30s', label: 'To onboard with AI' },
]

const shopImages = [
  { url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&q=80', label: 'Local Tailor' },
  { url: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=400&q=80', label: 'Medical Store' },
  { url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80', label: 'Tiffin Center' },
  { url: 'https://images.unsplash.com/photo-1588943211346-0908a1fb0b01?w=400&q=80', label: 'Grocery Shop' },
]

const features = [
  { emoji: '💬', label: 'WhatsApp onboarding' },
  { emoji: '🎙️', label: 'Tamil voice search' },
  { emoji: '🟢', label: 'Live open/closed status' },
  { emoji: '🧠', label: 'AI gap radar' },
  { emoji: '📈', label: 'Weekly AI report' },
  { emoji: '📍', label: 'Street-level precision' },
]

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-gray-800">
        <span className="text-orange-400 font-black text-xl tracking-tight">LocalPulse AI</span>
        <div className="flex gap-3">
          <button onClick={() => navigate('/search')} className="text-sm text-gray-400 hover:text-white transition px-4 py-2">Find Shops</button>
          <button onClick={() => navigate('/onboard')} className="text-sm bg-orange-500 hover:bg-orange-600 transition px-4 py-2 rounded-lg font-semibold">List Your Shop</button>
        </div>
      </nav>

      {/* Hero */}
      <div className="max-w-6xl mx-auto px-6 pt-16 pb-10">
        <div className="grid grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-4 py-1.5 text-orange-400 text-sm mb-8">
              <span className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></span>
              Live in Chennai • Powered by AI
            </div>
            <h1 className="text-5xl font-black leading-tight mb-6">
              Google Maps shows<br />
              <span className="text-orange-400">what exists.</span><br />
              We show <span className="text-orange-400">what's alive.</span>
            </h1>
            <p className="text-gray-400 text-lg mb-10">
              The hyperlocal intelligence platform for Indian neighborhoods. Discover open shops, find what's missing, grow your business.
            </p>
            <div className="flex gap-4">
              <button onClick={() => navigate('/search')} className="bg-orange-500 hover:bg-orange-600 transition px-6 py-3 rounded-xl font-bold">
                Find Shops Near Me →
              </button>
              <button onClick={() => navigate('/onboard')} className="border border-gray-700 hover:border-gray-500 transition px-6 py-3 rounded-xl font-bold text-gray-300">
                List My Shop
              </button>
            </div>
          </div>

          {/* Shop image grid */}
          <div className="grid grid-cols-2 gap-3">
            {shopImages.map((img, i) => (
              <div key={i} className="relative rounded-2xl overflow-hidden h-44 group">
                <img src={img.url} alt={img.label} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <span className="absolute bottom-3 left-3 text-white text-sm font-semibold">{img.label}</span>
                <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse"></span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-5xl mx-auto px-6 mb-16">
        <div className="grid grid-cols-3 gap-6">
          {stats.map(s => (
            <div key={s.label} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 text-center">
              <p className="text-4xl font-black text-orange-400 mb-2">{s.value}</p>
              <p className="text-gray-400 text-sm">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Feature Cards */}
      <div className="max-w-5xl mx-auto px-6 mb-16">
        <h2 className="text-2xl font-bold text-center mb-10 text-gray-300">Everything your neighborhood needs</h2>
        <div className="grid grid-cols-2 gap-5">
          {cards.map(card => (
            <button
              key={card.path}
              onClick={() => navigate(card.path)}
              className="group bg-gray-900 border border-gray-800 hover:border-gray-600 rounded-2xl p-7 text-left transition hover:-translate-y-1 hover:shadow-2xl"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.bg} flex items-center justify-center text-2xl mb-4`}>
                {card.icon}
              </div>
              <h3 className="font-bold text-white text-lg mb-1">{card.title}</h3>
              <p className="text-gray-400 text-sm">{card.desc}</p>
              <span className="text-orange-400 text-sm mt-3 inline-block group-hover:translate-x-1 transition">Explore →</span>
            </button>
          ))}
        </div>
      </div>

      {/* Real shop photo strip */}
      <div className="max-w-5xl mx-auto px-6 mb-16">
        <h2 className="text-2xl font-bold text-center mb-10 text-gray-300">Shops like yours, already on LocalPulse</h2>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {[
            { url: 'https://images.unsplash.com/photo-1621072156002-e2fccdc0b176?w=300&q=80', name: "Ravi Tailors", area: "Tambaram", status: "Open" },
            { url: 'https://images.unsplash.com/photo-1576602976047-174e57a47881?w=300&q=80', name: "Sri Murugan Medical", area: "Chromepet", status: "Open" },
            { url: 'https://images.unsplash.com/photo-1567360425618-1594206637d2?w=300&q=80', name: "Annapoorna Tiffins", area: "Velachery", status: "Open" },
            { url: 'https://images.unsplash.com/photo-1601598851547-4302969d0614?w=300&q=80', name: "Kumar Electronics", area: "T.Nagar", status: "Busy" },
          ].map((shop, i) => (
            <div key={i} className="flex-shrink-0 w-56 bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
              <div className="relative h-32">
                <img src={shop.url} alt={shop.name} className="w-full h-full object-cover" />
                <span className={`absolute top-2 right-2 text-xs px-2 py-0.5 rounded-full font-semibold ${shop.status === 'Open' ? 'bg-green-500/90 text-white' : 'bg-amber-500/90 text-white'}`}>
                  {shop.status}
                </span>
              </div>
              <div className="p-3">
                <p className="font-semibold text-white text-sm">{shop.name}</p>
                <p className="text-gray-400 text-xs">📍 {shop.area}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Built for Bharat */}
      <div className="max-w-5xl mx-auto px-6 mb-16">
        <div className="bg-gradient-to-r from-orange-500/10 to-amber-500/10 border border-orange-500/20 rounded-2xl p-8">
          <h3 className="font-bold text-xl mb-6 text-orange-400">🇮🇳 Built for Bharat</h3>
          <div className="grid grid-cols-3 gap-4">
            {features.map(f => (
              <div key={f.label} className="flex items-center gap-3 bg-gray-900/50 rounded-xl p-3">
                <span className="text-2xl">{f.emoji}</span>
                <span className="text-gray-300 text-sm">{f.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-800 py-8 text-center text-gray-600 text-sm">
        LocalPulse AI • Built for Track 05 Open Startup Hackathon
      </div>
    </div>
  )
}