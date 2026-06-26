-- ==========================================
-- LocalPulse AI — Supabase RPC Functions
-- Run this AFTER schema.sql in SQL Editor
-- ==========================================

-- nearby_shops: PostGIS-powered geo search with category + keyword filter
create or replace function nearby_shops(
  search_lat double precision,
  search_lng double precision,
  radius_meters double precision default 2000,
  category_filter text default null,
  keyword_filter text[] default '{}'
)
returns table (
  id uuid,
  shop_name text,
  category text,
  description text,
  specialties text[],
  area text,
  address text,
  lat double precision,
  lng double precision,
  is_open boolean,
  status text,
  today_special text,
  trust_score float,
  distance_meters double precision
)
language sql
as $$
  select
    s.id,
    s.shop_name,
    s.category,
    s.description,
    s.specialties,
    s.area,
    s.address,
    s.lat,
    s.lng,
    s.is_open,
    s.status,
    s.today_special,
    s.trust_score,
    ST_Distance(
      s.location,
      ST_SetSRID(ST_MakePoint(search_lng, search_lat), 4326)::geography
    ) as distance_meters
  from shops s
  where
    ST_DWithin(
      s.location,
      ST_SetSRID(ST_MakePoint(search_lng, search_lat), 4326)::geography,
      radius_meters
    )
    and (category_filter is null or s.category = category_filter)
    and (
      array_length(keyword_filter, 1) is null
      or s.tags && keyword_filter
      or s.specialties && keyword_filter
    )
  order by
    s.is_open desc,          -- open shops first
    distance_meters asc,     -- then nearest
    s.trust_score desc       -- then highest rated
  limit 20;
$$;
