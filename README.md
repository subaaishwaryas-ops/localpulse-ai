# LocalPulse AI 🏘️

> **Google Maps shows what exists. LocalPulse shows what's alive — and what's missing.**

![LocalPulse AI](https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&q=80)

## The Problem

63 million small businesses in India have **zero digital presence**. They're invisible to customers 1km away. Customers waste time walking to closed shops. Entrepreneurs have no idea where demand exists but supply doesn't.

## The Solution

LocalPulse AI is the **hyperlocal intelligence platform** for Indian neighborhoods.

![Search](https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=800&q=80)

### Three things that make us different

| Feature | What it does |
|---|---|
| 🧠 AI Onboarding | Shop owner sends WhatsApp message in Tamil/English → AI generates full profile in 30 seconds |
| 🔍 Smart Search | Customers search in Tamil, English, or Tanglish → finds what's open RIGHT NOW nearby |
| 🗺️ Gap Radar | Tracks unmet demand → shows entrepreneurs exactly where to open next |

## Live Demo

- 🌐 **Frontend**: [localpulse-ai.vercel.app](https://localpulse-ai.vercel.app)
- ⚡ **Backend API**: [localpulse-ai.up.railway.app](https://localpulse-ai.up.railway.app/docs)

## Tech Stack
Frontend   → React + Vite + Tailwind CSS

Backend    → FastAPI + Python 3.13

AI         → Groq Llama 3.1 8B Instant

Database   → Supabase + PostGIS (geo queries)

Deploy     → Vercel (frontend) + Railway (backend)
## Features

- ✅ WhatsApp-style AI onboarding — no tech skills needed
- ✅ Tamil + English NLP search
- ✅ Real-time open/closed status
- ✅ Hyperlocal — street level, not city level
- ✅ Gap Radar — AI business opportunity detection
- ✅ Owner dashboard with weekly AI report
- ✅ PostGIS geo queries for accurate nearby search

## Setup

### Backend
```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
# Fill in your keys
uvicorn main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Environment Variables
```env
GROQ_API_KEY=your_groq_key
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_service_role_key
```

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/shops/onboard` | AI onboard shop from raw text |
| POST | `/search/` | NLP search in Tamil/English |
| GET | `/gaps/{area}` | Demand gap analysis |
| GET | `/dashboard/{phone}` | Owner weekly AI report |

## Built for

**Track 05 — Open Startup** • Hackathon 2026

---

*Built with ❤️ for Bharat's 63 million small businesses*