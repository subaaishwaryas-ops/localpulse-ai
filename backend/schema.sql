-- ==========================================
-- LocalPulse AI — Supabase Schema
-- Run this in Supabase SQL Editor
-- ==========================================

-- Enable PostGIS for location queries
create extension if not exists postgis;

-- ==========================================
-- SHOPS TABLE
-- ==========================================
create table shops (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),

  -- Owner info
  owner_name text not null,
  phone text unique not null,

  -- Shop info (AI-generated)
  shop_name text not null,
  category text not null,           -- e.g. "tailor", "medical", "tiffin"
  description text,                 -- AI-generated 2-line description
  specialties text[],               -- ["biryani", "mutton", "veg meals"]
  tags text[],                      -- searchable tags

  -- Location
  address text not null,
  area text not null,               -- neighborhood e.g. "Tambaram West"
  city text default 'Chennai',
  lat double precision not null,
  lng double precision not null,
  location geography(Point, 4326),  -- PostGIS point for geo queries

  -- Status (updates daily)
  is_open boolean default true,
  status text default 'open',       -- open | closed | busy | special
  today_special text,               -- "Mutton biryani ₹120 today only"
  opens_at time,
  closes_at time,

  -- Meta
  verified boolean default false,
  trust_score float default 0,
  profile_views int default 0,
  whatsapp_onboarded boolean default false,
  raw_onboarding_text text          -- original owner input for audit
);

-- Auto-update location geography from lat/lng
create or replace function update_location()
returns trigger as $$
begin
  new.location = ST_SetSRID(ST_MakePoint(new.lng, new.lat), 4326)::geography;
  return new;
end;
$$ language plpgsql;

create trigger set_location
  before insert or update on shops
  for each row execute function update_location();

-- ==========================================
-- REVIEWS TABLE
-- ==========================================
create table reviews (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  shop_id uuid references shops(id) on delete cascade,
  reviewer_phone text not null,
  rating int check (rating between 1 and 5),
  comment text,
  verified boolean default false,   -- verified via WhatsApp
  sentiment text                    -- AI: positive | neutral | negative
);

-- ==========================================
-- SEARCH LOGS TABLE (powers Gap Map)
-- ==========================================
create table search_logs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  query text not null,
  detected_category text,           -- AI-extracted category
  area text,                        -- where user searched from
  lat double precision,
  lng double precision,
  results_found int default 0,      -- 0 = unmet demand!
  language text default 'en'        -- en | ta
);

-- ==========================================
-- GAP MAP TABLE (pre-computed demand gaps)
-- ==========================================
create table demand_gaps (
  id uuid primary key default gen_random_uuid(),
  updated_at timestamptz default now(),
  area text not null,
  category text not null,
  search_count int default 0,       -- how many searched this week
  shop_count int default 0,         -- how many shops exist for this
  gap_score float,                  -- (search_count / max(shop_count,1)) normalized
  opportunity_label text,           -- AI: "High demand, zero supply"
  unique(area, category)
);

-- ==========================================
-- INDEXES
-- ==========================================
create index shops_location_idx on shops using gist(location);
create index shops_category_idx on shops(category);
create index shops_area_idx on shops(area);
create index search_logs_area_idx on search_logs(area);
create index search_logs_category_idx on search_logs(detected_category);

-- ==========================================
-- ROW LEVEL SECURITY
-- ==========================================
alter table shops enable row level security;
alter table reviews enable row level security;
alter table search_logs enable row level security;
alter table demand_gaps enable row level security;

-- Public read access
create policy "public read shops" on shops for select using (true);
create policy "public read gaps" on demand_gaps for select using (true);

-- Authenticated write (use service key from backend)
create policy "service write shops" on shops for all using (true);
create policy "service write reviews" on reviews for all using (true);
create policy "service write search_logs" on search_logs for all using (true);
create policy "service write gaps" on demand_gaps for all using (true);
