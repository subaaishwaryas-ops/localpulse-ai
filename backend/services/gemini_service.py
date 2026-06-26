import json
from groq import Groq
from config import settings
from prompts.onboarding import (
    ONBOARDING_PROMPT,
    SEARCH_INTENT_PROMPT,
    GAP_ANALYSIS_PROMPT,
    DASHBOARD_REPORT_PROMPT,
    STATUS_UPDATE_PROMPT,
)

client = Groq(api_key=settings.GROQ_API_KEY)


def _call_groq(prompt: str) -> dict | list:
    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.3,
        response_format={"type": "json_object"},
    )
    return json.loads(response.choices[0].message.content)


def generate_shop_profile(raw_input: str) -> dict:
    return _call_groq(ONBOARDING_PROMPT.format(raw_input=raw_input))

def extract_search_intent(query: str, area: str, language: str = "en") -> dict:
    return _call_groq(SEARCH_INTENT_PROMPT.format(query=query, area=area, language=language))

def analyze_demand_gaps(area: str, gap_data: list) -> list:
    result = _call_groq(GAP_ANALYSIS_PROMPT.format(area=area, gap_data=json.dumps(gap_data, indent=2)))
    return result if isinstance(result, list) else result.get("gaps", [])

def generate_dashboard_report(shop_data: dict, metrics: dict) -> dict:
    return _call_groq(DASHBOARD_REPORT_PROMPT.format(
        shop_name=shop_data["shop_name"],
        category=shop_data["category"],
        area=shop_data["area"],
        profile_views=metrics.get("profile_views", 0),
        direction_clicks=metrics.get("direction_clicks", 0),
        search_appearances=metrics.get("search_appearances", 0),
        new_reviews=metrics.get("new_reviews", 0),
        avg_rating=metrics.get("avg_rating", "N/A"),
        competitor_count=metrics.get("competitor_count", 0),
    ))

def parse_status_update(message: str) -> dict:
    return _call_groq(STATUS_UPDATE_PROMPT.format(message=message))