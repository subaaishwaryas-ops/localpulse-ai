from pydantic import BaseModel
from typing import Optional


class OnboardingRequest(BaseModel):
    raw_text: str
    phone: str
    lat: float
    lng: float
    address: Optional[str] = None
    area: Optional[str] = None


class StatusUpdateRequest(BaseModel):
    phone: str
    message: str


class SearchRequest(BaseModel):
    query: str
    lat: float
    lng: float
    radius_km: float = 2.0
    language: str = "en"


class ReviewRequest(BaseModel):
    shop_id: str
    reviewer_phone: str
    rating: int
    comment: Optional[str] = None


class ShopResponse(BaseModel):
    id: str
    shop_name: str
    category: str
    description: Optional[str]
    specialties: Optional[list[str]]
    area: str
    address: str
    lat: float
    lng: float
    is_open: bool
    status: str
    today_special: Optional[str]
    trust_score: float
    distance_km: Optional[float] = None


class GapResponse(BaseModel):
    area: str
    category: str
    search_count: int
    shop_count: int
    opportunity_label: str
    insight: str
    gap_score: float