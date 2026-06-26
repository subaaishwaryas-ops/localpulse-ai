from fastapi import APIRouter, HTTPException
from database import get_db
import services.gemini_service as gemini_service

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/{phone}")
async def get_dashboard(phone: str):
    db = get_db()

    shop = db.table("shops").select("*").eq("phone", phone).single().execute()
    if not shop.data:
        raise HTTPException(status_code=404, detail="Shop not found")

    shop_data = shop.data

    reviews = db.table("reviews").select("rating").eq("shop_id", shop_data["id"]).execute()
    ratings = [r["rating"] for r in reviews.data] if reviews.data else []
    avg_rating = sum(ratings) / len(ratings) if ratings else 0

    competitors = db.rpc("nearby_shops", {
        "search_lat": shop_data["lat"],
        "search_lng": shop_data["lng"],
        "radius_meters": 1000,
        "category_filter": shop_data["category"],
        "keyword_filter": [],
    }).execute()

    competitor_count = len(competitors.data or []) - 1

    metrics = {
        "profile_views": shop_data.get("profile_views", 0),
        "direction_clicks": 0,
        "search_appearances": 0,
        "new_reviews": len(ratings),
        "avg_rating": round(avg_rating, 1),
        "competitor_count": max(0, competitor_count),
    }

    ai_report = gemini_service.generate_dashboard_report(shop_data, metrics)

    return {
        "shop": {
            "id": shop_data["id"],
            "shop_name": shop_data["shop_name"],
            "category": shop_data["category"],
            "area": shop_data["area"],
            "is_open": shop_data["is_open"],
            "status": shop_data["status"],
            "today_special": shop_data.get("today_special"),
            "verified": shop_data["verified"],
        },
        "metrics": metrics,
        "ai_report": ai_report,
    }