from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from datetime import datetime, date

from models.database import Couple, WeddingStage
from utils.database import get_db
from utils.auth import get_current_user

router = APIRouter()

# Pydantic models
from pydantic import BaseModel, EmailStr

class CoupleBase(BaseModel):
    partner_1_name: str
    partner_1_email: Optional[EmailStr] = None
    partner_1_phone: Optional[str] = None
    partner_2_name: str
    partner_2_email: Optional[EmailStr] = None
    partner_2_phone: Optional[str] = None
    wedding_date: Optional[date] = None
    engagement_date: Optional[date] = None
    wedding_stage: WeddingStage = WeddingStage.ENGAGED
    wedding_venue: Optional[str] = None
    wedding_city: Optional[str] = None
    wedding_state: Optional[str] = None
    wedding_budget: Optional[float] = None
    guest_count: Optional[int] = None
    source_platform: Optional[str] = None
    source_url: Optional[str] = None

class CoupleCreate(CoupleBase):
    pass

class CoupleUpdate(CoupleBase):
    partner_1_name: Optional[str] = None
    partner_2_name: Optional[str] = None

class CoupleResponse(CoupleBase):
    id: int
    preferred_contact_method: str
    opted_out: bool
    opt_out_date: Optional[datetime]
    registry_urls: Optional[List[str]]
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

@router.get("/", response_model=List[CoupleResponse])
async def get_couples(
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=100),
    wedding_stage: Optional[WeddingStage] = None,
    city: Optional[str] = None,
    state: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Get paginated list of couples with filtering."""
    query = db.query(Couple)
    
    # Apply filters
    if wedding_stage:
        query = query.filter(Couple.wedding_stage == wedding_stage)
    
    if city:
        query = query.filter(Couple.wedding_city.ilike(f"%{city}%"))
    
    if state:
        query = query.filter(Couple.wedding_state.ilike(f"%{state}%"))
    
    # Apply pagination
    offset = (page - 1) * page_size
    couples = query.offset(offset).limit(page_size).all()
    
    return couples

@router.get("/{couple_id}", response_model=CoupleResponse)
async def get_couple(
    couple_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Get a specific couple by ID."""
    couple = db.query(Couple).filter(Couple.id == couple_id).first()
    if not couple:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Couple not found"
        )
    return couple

@router.post("/", response_model=CoupleResponse, status_code=status.HTTP_201_CREATED)
async def create_couple(
    couple_data: CoupleCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Create a new couple record."""
    # Check for duplicate based on names and email
    existing = db.query(Couple).filter(
        Couple.partner_1_name == couple_data.partner_1_name,
        Couple.partner_2_name == couple_data.partner_2_name
    ).first()
    
    if existing and (
        existing.partner_1_email == couple_data.partner_1_email or
        existing.partner_2_email == couple_data.partner_2_email
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Couple already exists"
        )
    
    couple = Couple(**couple_data.dict())
    db.add(couple)
    db.commit()
    db.refresh(couple)
    
    return couple

@router.put("/{couple_id}", response_model=CoupleResponse)
async def update_couple(
    couple_id: int,
    couple_data: CoupleUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Update a couple record."""
    couple = db.query(Couple).filter(Couple.id == couple_id).first()
    if not couple:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Couple not found"
        )
    
    # Update fields
    update_data = couple_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(couple, field, value)
    
    couple.updated_at = datetime.now()
    db.commit()
    db.refresh(couple)
    
    return couple

@router.post("/{couple_id}/opt-out")
async def opt_out_couple(
    couple_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Mark a couple as opted out from communications."""
    couple = db.query(Couple).filter(Couple.id == couple_id).first()
    if not couple:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Couple not found"
        )
    
    couple.opted_out = True
    couple.opt_out_date = datetime.now()
    couple.updated_at = datetime.now()
    
    db.commit()
    db.refresh(couple)
    
    return {"message": f"Couple {couple_id} has been opted out"}

@router.get("/search/upcoming-weddings")
async def get_upcoming_weddings(
    days_ahead: int = Query(30, ge=1, le=365),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Get couples with weddings coming up within specified days."""
    from datetime import timedelta
    
    end_date = date.today() + timedelta(days=days_ahead)
    
    couples = db.query(Couple).filter(
        Couple.wedding_date >= date.today(),
        Couple.wedding_date <= end_date,
        Couple.opted_out == False
    ).order_by(Couple.wedding_date).all()
    
    return {"couples": couples, "count": len(couples)}