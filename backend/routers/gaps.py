from fastapi import APIRouter
from database import get_db

router = APIRouter(prefix="/gaps", tags=["gap-map"])


@router.get("/{area}")
async def get_area_gaps(area: str):
    db = get_db()

    gaps = db.table("demand_gaps") \
        .select("*") \
        .eq("area", area) \
        .order("gap_score", desc=True) \
        .limit(10) \
        .execute()

    return {"area": area, "gaps": gaps.data or []}


@router.post("/recompute/{area}")
async def recompute_gaps(area: str):
    db = get_db()

    logs = db.table("search_logs") \
        .select("detected_category") \
        .eq("area", area) \
        .eq("results_found", 0) \
        .execute()

    if not logs.data:
        return {"message": "No gap data to compute"}

    from collections import Counter
    category_counts = Counter(
        log["detected_category"] for log in logs.data
        if log["detected_category"]
    )

    shops = db.table("shops").select("category").eq("area", area).execute()
    shop_counts = Counter(s["category"] for s in shops.data)

    for category, search_count in category_counts.items():
        shop_count = shop_counts.get(category, 0)
        gap_score = search_count / max(shop_count, 1)

        db.table("demand_gaps").upsert({
            "area": area,
            "category": category,
            "search_count": search_count,
            "shop_count": shop_count,
            "gap_score": gap_score,
        }, on_conflict="area,category").execute()

    return {"message": f"Recomputed gaps for {area}", "categories": len(category_counts)}


@router.get("/city/heatmap")
async def city_heatmap():
    db = get_db()
    gaps = db.table("demand_gaps") \
        .select("area, category, gap_score, search_count, shop_count") \
        .order("gap_score", desc=True) \
        .execute()

    return {"heatmap": gaps.data or []}