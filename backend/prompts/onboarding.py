"""
LocalPulse AI — Gemini Prompt Templates
All prompts return structured JSON. No markdown, no preamble.
"""

ONBOARDING_PROMPT = """
You are LocalPulse AI, an assistant that helps small shop owners in India get online in 30 seconds.

A shop owner has sent this message describing their shop (could be in Tamil, English, or Tanglish):
"{raw_input}"

Extract and generate a complete shop profile. Return ONLY valid JSON, no explanation:

{{
  "shop_name": "exact or cleaned shop name",
  "owner_name": "owner name if mentioned, else 'Shop Owner'",
  "category": "one of: tailor | medical | tiffin | grocery | electronics | repair | salon | bakery | stationery | hardware | other",
  "description": "2-sentence compelling description of the shop in simple English, highlighting what makes it special",
  "specialties": ["list", "of", "key", "items", "or", "services"],
  "tags": ["searchable", "keywords", "including", "tamil", "transliterations"],
  "opens_at": "HH:MM in 24hr format or null",
  "closes_at": "HH:MM in 24hr format or null",
  "today_special": "any special offer mentioned today or null",
  "address": "address if mentioned or null",
  "area": "neighborhood/area name if mentioned or null",
  "confidence": 0.0-1.0
}}

Rules:
- If shop name is not clear, infer from context
- Tags must include Tamil transliterations (e.g. "tailor" → also add "tailoring", "thaiyyal", "stitch")
- Specialties should be specific items/services, not generic
- description should sound human and warm, not corporate
- If info is missing, use null — never guess critical fields like address
"""

SEARCH_INTENT_PROMPT = """
A user in Chennai searched: "{query}"
Their location area: "{area}"
Detected language: "{language}"

Extract search intent. Return ONLY valid JSON:
{{
  "category": "best matching category: tailor|medical|tiffin|grocery|electronics|repair|salon|bakery|stationery|hardware|other",
  "keywords": ["cleaned", "search", "keywords"],
  "intent": "find_shop | check_open | get_price | find_specialty",
  "priority_filters": ["open_now", "nearest", "highest_rated"],
  "translated_query": "English version of query if it was in Tamil"
}}
"""

GAP_ANALYSIS_PROMPT = """
You are an urban economist analyzing hyperlocal business gaps in Chennai neighborhoods.

This week's unmet demand data for area "{area}":
{gap_data}

Generate opportunity insights. Return ONLY valid JSON array:
[
  {{
    "category": "category name",
    "search_count": number,
    "shop_count": number,
    "opportunity_label": "one punchy line e.g. 'High demand, zero competition'",
    "insight": "2-sentence business case for opening this shop here",
    "estimated_daily_customers": number,
    "competition_level": "none | low | medium | high"
  }}
]

Sort by opportunity (highest gap_score first). Max 5 items.
"""

DASHBOARD_REPORT_PROMPT = """
Generate a weekly performance report for a shop owner on LocalPulse AI.

Shop: {shop_name}
Category: {category}
Area: {area}

This week's data:
- Profile views: {profile_views}
- Direction clicks: {direction_clicks}
- Search appearances: {search_appearances}
- New reviews: {new_reviews}
- Average rating: {avg_rating}
- Competitor shops nearby: {competitor_count}

Return ONLY valid JSON:
{{
  "headline": "one encouraging headline summarizing the week",
  "performance": "great | good | average | needs_attention",
  "insights": [
    "insight 1 — specific and actionable",
    "insight 2",
    "insight 3"
  ],
  "ai_tips": [
    "specific tip to improve visibility",
    "tip about what nearby customers are searching for",
    "tip about competitor gap they can exploit"
  ],
  "next_week_goal": "one specific goal for next week"
}}
"""

STATUS_UPDATE_PROMPT = """
A shop owner sent this WhatsApp message about today's status:
"{message}"

Extract status update. Return ONLY valid JSON:
{{
  "is_open": true/false,
  "status": "open | closed | busy | special",
  "today_special": "offer text or null",
  "closes_early_at": "HH:MM or null",
  "message_to_customers": "friendly 1-line status message for customers"
}}
"""
