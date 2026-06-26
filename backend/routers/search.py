from fastapi import APIRouter
from models.schemas import SearchRequest
from services.gemini_service import extract_search_intent
from database import get_db
from langdetect import detect

router = APIRouter(prefix="/search", tags=["search"])


@router.post("/")
async def search_shops(req: SearchRequest):
    """
    AI-powered local shop search.
    Supports Tamil, English, Tanglish.
    Logs every search (even failed ones) for Gap Map.
    """
    db = get_db()

    # Detect language
    try:
        lang = detect(req.query)
        language = "ta" if lang == "ta" else "en"
    except Exception:
        language = req.language

    # Get area name from coordinates (reverse geocode via Supabase or cache)
    area = _get_area_from_coords(req.lat, req.lng)

    # AI extracts search intent
    intent = extract_search_intent(req.query, area, language)

    # Build geo query — find shops within radius using PostGIS
    # Supabase RPC call to a custom PostgreSQL function
    results = db.rpc("nearby_shops", {
        "search_lat": req.lat,
        "search_lng": req.lng,
        "radius_meters": req.radius_km * 1000,
        "category_filter": intent.get("category"),
        "keyword_filter": intent.get("keywords", []),
    }).execute()

    shops = results.data or []

    # Log this search for Gap Map intelligence
    db.table("search_logs").insert({
        "query": req.query,
        "detected_category": intent.get("category"),
        "area": area,
        "lat": req.lat,
        "lng": req.lng,
        "results_found": len(shops),
        "language": language,
    }).execute()

    return {
        "query": req.query,
        "intent": intent,
        "area": area,
        "results_count": len(shops),
        "shops": shops,
        "zero_results": len(shops) == 0,
        "zero_results_message": (
            f"No {intent.get('category', 'shops')} found nearby. "
            "We've noted this gap — someone might open one soon! 🌱"
        ) if len(shops) == 0 else None
    }


@router.get("/nearby")
async def nearby_shops(lat: float, lng: float, radius_km: float = 2.0):
    """Get all open shops near a location — no query needed."""
    db = get_db()

    results = db.rpc("nearby_shops", {
        "search_lat": lat,
        "search_lng": lng,
        "radius_meters": radius_km * 1000,
        "category_filter": None,
        "keyword_filter": [],
    }).execute()

    return {"shops": results.data or []}


def _get_area_from_coords(lat: float, lng: float) -> str:
    """
    Simple area lookup — in production use Google Geocoding API.
    For hackathon demo, return a default area.
    """
    # TODO: integrate Google Reverse Geocoding
    return "Chennai"
