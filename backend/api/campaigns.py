from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime

from models.database import Campaign, CampaignSend, CampaignStatus
from utils.database import get_db
from utils.auth import get_current_user

router = APIRouter()

# Pydantic models
from pydantic import BaseModel

class CampaignBase(BaseModel):
    name: str
    description: Optional[str] = None
    campaign_type: str = "email"  # email, sms, direct_mail
    subject_line: Optional[str] = None
    email_template: Optional[str] = None
    sms_template: Optional[str] = None
    target_wedding_stages: Optional[List[str]] = None
    target_locations: Optional[List[str]] = None
    min_budget: Optional[float] = None
    max_budget: Optional[float] = None
    min_lead_score: Optional[float] = None

class CampaignCreate(CampaignBase):
    pass

class CampaignUpdate(CampaignBase):
    name: Optional[str] = None
    status: Optional[CampaignStatus] = None
    scheduled_send_date: Optional[datetime] = None

class CampaignResponse(CampaignBase):
    id: int
    status: CampaignStatus
    scheduled_send_date: Optional[datetime]
    total_sends: int
    total_opens: int
    total_clicks: int
    total_responses: int
    total_conversions: int
    created_by_officer_id: Optional[int]
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

@router.get("/", response_model=List[CampaignResponse])
async def get_campaigns(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Get all campaigns for the current user."""
    campaigns = db.query(Campaign).filter(
        Campaign.created_by_officer_id == current_user.id
    ).order_by(Campaign.created_at.desc()).all()
    
    return campaigns

@router.get("/{campaign_id}", response_model=CampaignResponse)
async def get_campaign(
    campaign_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Get a specific campaign."""
    campaign = db.query(Campaign).filter(
        Campaign.id == campaign_id,
        Campaign.created_by_officer_id == current_user.id
    ).first()
    
    if not campaign:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Campaign not found"
        )
    
    return campaign

@router.post("/", response_model=CampaignResponse, status_code=status.HTTP_201_CREATED)
async def create_campaign(
    campaign_data: CampaignCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Create a new campaign."""
    campaign = Campaign(
        **campaign_data.dict(),
        created_by_officer_id=current_user.id
    )
    
    db.add(campaign)
    db.commit()
    db.refresh(campaign)
    
    return campaign

@router.put("/{campaign_id}", response_model=CampaignResponse)
async def update_campaign(
    campaign_id: int,
    campaign_data: CampaignUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Update a campaign."""
    campaign = db.query(Campaign).filter(
        Campaign.id == campaign_id,
        Campaign.created_by_officer_id == current_user.id
    ).first()
    
    if not campaign:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Campaign not found"
        )
    
    # Update fields
    update_data = campaign_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(campaign, field, value)
    
    campaign.updated_at = datetime.now()
    db.commit()
    db.refresh(campaign)
    
    return campaign

@router.post("/{campaign_id}/send")
async def send_campaign(
    campaign_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Send a campaign to all qualified leads."""
    campaign = db.query(Campaign).filter(
        Campaign.id == campaign_id,
        Campaign.created_by_officer_id == current_user.id
    ).first()
    
    if not campaign:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Campaign not found"
        )
    
    if campaign.status != CampaignStatus.ACTIVE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Campaign must be active to send"
        )
    
    # TODO: Implement campaign sending logic
    # This would integrate with email/SMS services
    
    return {"message": f"Campaign {campaign_id} send initiated"}

@router.get("/{campaign_id}/performance")
async def get_campaign_performance(
    campaign_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Get campaign performance metrics."""
    campaign = db.query(Campaign).filter(
        Campaign.id == campaign_id,
        Campaign.created_by_officer_id == current_user.id
    ).first()
    
    if not campaign:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Campaign not found"
        )
    
    # Calculate performance metrics
    open_rate = (campaign.total_opens / campaign.total_sends * 100) if campaign.total_sends > 0 else 0
    click_rate = (campaign.total_clicks / campaign.total_sends * 100) if campaign.total_sends > 0 else 0
    response_rate = (campaign.total_responses / campaign.total_sends * 100) if campaign.total_sends > 0 else 0
    conversion_rate = (campaign.total_conversions / campaign.total_sends * 100) if campaign.total_sends > 0 else 0
    
    return {
        "campaign_id": campaign_id,
        "total_sends": campaign.total_sends,
        "total_opens": campaign.total_opens,
        "total_clicks": campaign.total_clicks,
        "total_responses": campaign.total_responses,
        "total_conversions": campaign.total_conversions,
        "open_rate": round(open_rate, 2),
        "click_rate": round(click_rate, 2),
        "response_rate": round(response_rate, 2),
        "conversion_rate": round(conversion_rate, 2)
    }