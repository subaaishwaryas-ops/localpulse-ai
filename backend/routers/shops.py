from fastapi import APIRouter, HTTPException
from models.schemas import OnboardingRequest, StatusUpdateRequest, ShopResponse
from services.gemini_service import generate_shop_profile, parse_status_update
from database import get_db

router = APIRouter(prefix="/shops", tags=["shops"])


@router.post("/onboard")
async def onboard_shop(req: OnboardingRequest):
    """
    AI-powered shop onboarding from raw owner text.
    Called when owner sends their first WhatsApp message.
    """
    db = get_db()

    # Check if shop already exists
    existing = db.table("shops").select("id").eq("phone", req.phone).execute()
    if existing.data:
        raise HTTPException(status_code=409, detail="Shop already registered with this number")

    # AI extracts structured profile from raw text
    profile = generate_shop_profile(req.raw_text)

    if profile.get("confidence", 0) < 0.4:
        raise HTTPException(
            status_code=422,
            detail="Couldn't understand the shop description. Please provide more details."
        )

    # Build shop record
    shop_data = {
        "phone": req.phone,
        "owner_name": profile.get("owner_name", "Shop Owner"),
        "shop_name": profile["shop_name"],
        "category": profile["category"],
        "description": profile.get("description"),
        "specialties": profile.get("specialties", []),
        "tags": profile.get("tags", []),
        "opens_at": profile.get("opens_at"),
        "closes_at": profile.get("closes_at"),
        "today_special": profile.get("today_special"),
        "address": req.address or profile.get("address", ""),
        "area": req.area or profile.get("area", ""),
        "lat": req.lat,
        "lng": req.lng,
        "raw_onboarding_text": req.raw_text,
        "whatsapp_onboarded": True,
    }

    result = db.table("shops").insert(shop_data).execute()

    return {
        "success": True,
        "shop_id": result.data[0]["id"],
        "profile": profile,
        "message": f"🎉 {profile['shop_name']} is now live on LocalPulse!"
    }


@router.post("/status")
async def update_status(req: StatusUpdateRequest):
    """
    Owner sends WhatsApp message → AI parses status → updates shop.
    Example: "aaj band hai" → is_open=False, status="closed"
    """
    db = get_db()

    shop = db.table("shops").select("id, shop_name").eq("phone", req.phone).single().execute()
    if not shop.data:
        raise HTTPException(status_code=404, detail="Shop not found")

    status = parse_status_update(req.message)

    db.table("shops").update({
        "is_open": status["is_open"],
        "status": status["status"],
        "today_special": status.get("today_special"),
    }).eq("id", shop.data["id"]).execute()

    return {
        "success": True,
        "parsed_status": status,
        "customer_message": status.get("message_to_customers")
    }


@router.get("/{shop_id}", response_model=dict)
async def get_shop(shop_id: str):
    """Get shop by ID + increment view count."""
    db = get_db()

    shop = db.table("shops").select("*").eq("id", shop_id).single().execute()
    if not shop.data:
        raise HTTPException(status_code=404, detail="Shop not found")

    # Increment view count
    db.table("shops").update({
        "profile_views": shop.data["profile_views"] + 1
    }).eq("id", shop_id).execute()

    return shop.data


@router.get("/owner/{phone}", response_model=dict)
async def get_owner_shop(phone: str):
    """Get shop by owner phone number."""
    db = get_db()
    shop = db.table("shops").select("*").eq("phone", phone).single().execute()
    if not shop.data:
        raise HTTPException(status_code=404, detail="No shop found for this number")
    return shop.data
