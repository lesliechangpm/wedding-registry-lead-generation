from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc, asc
from datetime import datetime, timedelta

from models.database import Lead, Couple, LoanOfficer, LeadStatus
from utils.database import get_db
from utils.auth import get_current_user
from services.lead_scoring import LeadScoringService

router = APIRouter()

# Pydantic models for request/response
from pydantic import BaseModel, Field

class LeadBase(BaseModel):
    target_purchase_price: Optional[float] = None
    target_down_payment: Optional[float] = None
    target_location: Optional[str] = None
    property_type_interest: Optional[str] = None
    timeline_to_purchase: Optional[str] = None
    estimated_income: Optional[float] = None
    current_rent: Optional[float] = None
    has_existing_mortgage: bool = False
    credit_score_range: Optional[str] = None

class LeadCreate(LeadBase):
    couple_id: int

class LeadUpdate(LeadBase):
    status: Optional[LeadStatus] = None
    assigned_loan_officer_id: Optional[int] = None
    next_follow_up_date: Optional[datetime] = None

class LeadResponse(LeadBase):
    id: int
    couple_id: int
    lead_score: float
    qualification_score: float
    status: LeadStatus
    assigned_loan_officer_id: Optional[int]
    earliest_contact_date: Optional[datetime]
    last_contact_date: Optional[datetime]
    next_follow_up_date: Optional[datetime]
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class LeadListResponse(BaseModel):
    leads: List[LeadResponse]
    total_count: int
    page: int
    page_size: int

@router.get("/", response_model=LeadListResponse)
async def get_leads(
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=100),
    status: Optional[LeadStatus] = None,
    assigned_to_me: bool = False,
    min_score: Optional[float] = None,
    sort_by: str = Query("created_at", regex="^(created_at|lead_score|last_contact_date)$"),
    sort_order: str = Query("desc", regex="^(asc|desc)$"),
    db: Session = Depends(get_db),
    current_user: LoanOfficer = Depends(get_current_user)
):
    """Get paginated list of leads with filtering and sorting."""
    query = db.query(Lead)
    
    # Apply filters
    if status:
        query = query.filter(Lead.status == status)
    
    if assigned_to_me:
        query = query.filter(Lead.assigned_loan_officer_id == current_user.id)
    
    if min_score is not None:
        query = query.filter(Lead.lead_score >= min_score)
    
    # Apply sorting
    order_func = desc if sort_order == "desc" else asc
    if sort_by == "created_at":
        query = query.order_by(order_func(Lead.created_at))
    elif sort_by == "lead_score":
        query = query.order_by(order_func(Lead.lead_score))
    elif sort_by == "last_contact_date":
        query = query.order_by(order_func(Lead.last_contact_date))
    
    # Get total count
    total_count = query.count()
    
    # Apply pagination
    offset = (page - 1) * page_size
    leads = query.offset(offset).limit(page_size).all()
    
    return LeadListResponse(
        leads=leads,
        total_count=total_count,
        page=page,
        page_size=page_size
    )

@router.get("/{lead_id}", response_model=LeadResponse)
async def get_lead(
    lead_id: int,
    db: Session = Depends(get_db),
    current_user: LoanOfficer = Depends(get_current_user)
):
    """Get a specific lead by ID."""
    lead = db.query(Lead).filter(Lead.id == lead_id).first()
    if not lead:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lead not found"
        )
    return lead

@router.post("/", response_model=LeadResponse, status_code=status.HTTP_201_CREATED)
async def create_lead(
    lead_data: LeadCreate,
    db: Session = Depends(get_db),
    current_user: LoanOfficer = Depends(get_current_user)
):
    """Create a new lead."""
    # Verify couple exists
    couple = db.query(Couple).filter(Couple.id == lead_data.couple_id).first()
    if not couple:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Couple not found"
        )
    
    # Check if lead already exists for this couple
    existing_lead = db.query(Lead).filter(Lead.couple_id == lead_data.couple_id).first()
    if existing_lead:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Lead already exists for this couple"
        )
    
    # Create the lead
    lead = Lead(**lead_data.dict())
    
    # Calculate initial lead score
    scoring_service = LeadScoringService(db)
    lead.lead_score = scoring_service.calculate_lead_score(lead, couple)
    
    # Set earliest contact date (compliance waiting period)
    if couple.wedding_date:
        # Wait 60 days after wedding
        lead.earliest_contact_date = couple.wedding_date + timedelta(days=60)
    else:
        # Default to immediate contact if no wedding date
        lead.earliest_contact_date = datetime.now()
    
    db.add(lead)
    db.commit()
    db.refresh(lead)
    
    return lead

@router.put("/{lead_id}", response_model=LeadResponse)
async def update_lead(
    lead_id: int,
    lead_data: LeadUpdate,
    db: Session = Depends(get_db),
    current_user: LoanOfficer = Depends(get_current_user)
):
    """Update a lead."""
    lead = db.query(Lead).filter(Lead.id == lead_id).first()
    if not lead:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lead not found"
        )
    
    # Update fields
    update_data = lead_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(lead, field, value)
    
    # Recalculate lead score if relevant data changed
    scoring_service = LeadScoringService(db)
    couple = db.query(Couple).filter(Couple.id == lead.couple_id).first()
    lead.lead_score = scoring_service.calculate_lead_score(lead, couple)
    
    lead.updated_at = datetime.now()
    db.commit()
    db.refresh(lead)
    
    return lead

@router.post("/{lead_id}/assign")
async def assign_lead(
    lead_id: int,
    loan_officer_id: int,
    db: Session = Depends(get_db),
    current_user: LoanOfficer = Depends(get_current_user)
):
    """Assign a lead to a loan officer."""
    lead = db.query(Lead).filter(Lead.id == lead_id).first()
    if not lead:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lead not found"
        )
    
    # Verify loan officer exists
    loan_officer = db.query(LoanOfficer).filter(LoanOfficer.id == loan_officer_id).first()
    if not loan_officer:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Loan officer not found"
        )
    
    lead.assigned_loan_officer_id = loan_officer_id
    lead.updated_at = datetime.now()
    
    db.commit()
    db.refresh(lead)
    
    return {"message": f"Lead {lead_id} assigned to {loan_officer.name}"}

@router.get("/ready-for-contact/")
async def get_leads_ready_for_contact(
    db: Session = Depends(get_db),
    current_user: LoanOfficer = Depends(get_current_user)
):
    """Get leads that are past their waiting period and ready for contact."""
    now = datetime.now()
    
    leads = db.query(Lead).filter(
        Lead.earliest_contact_date <= now,
        Lead.status == LeadStatus.NEW,
        Lead.last_contact_date.is_(None)
    ).order_by(desc(Lead.lead_score)).all()
    
    return {"leads": leads, "count": len(leads)}