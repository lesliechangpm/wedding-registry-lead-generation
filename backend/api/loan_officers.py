from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime

from models.database import LoanOfficer
from utils.database import get_db
from utils.auth import get_current_user, get_password_hash

router = APIRouter()

# Pydantic models
from pydantic import BaseModel, EmailStr

class LoanOfficerBase(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    license_number: Optional[str] = None
    service_areas: Optional[List[str]] = None
    specializations: Optional[List[str]] = None
    max_leads_per_day: int = 10
    auto_assign_leads: bool = True

class LoanOfficerCreate(LoanOfficerBase):
    password: str

class LoanOfficerUpdate(LoanOfficerBase):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None

class LoanOfficerResponse(LoanOfficerBase):
    id: int
    total_leads_assigned: int
    total_loans_closed: int
    conversion_rate: float
    average_loan_amount: float
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

@router.get("/me", response_model=LoanOfficerResponse)
async def get_current_loan_officer(
    current_user: LoanOfficer = Depends(get_current_user)
):
    """Get current loan officer profile."""
    return current_user

@router.get("/", response_model=List[LoanOfficerResponse])
async def get_loan_officers(
    db: Session = Depends(get_db),
    current_user: LoanOfficer = Depends(get_current_user)
):
    """Get all loan officers (admin only for now)."""
    officers = db.query(LoanOfficer).order_by(LoanOfficer.name).all()
    return officers

@router.get("/{officer_id}", response_model=LoanOfficerResponse)
async def get_loan_officer(
    officer_id: int,
    db: Session = Depends(get_db),
    current_user: LoanOfficer = Depends(get_current_user)
):
    """Get a specific loan officer."""
    officer = db.query(LoanOfficer).filter(LoanOfficer.id == officer_id).first()
    if not officer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Loan officer not found"
        )
    return officer

@router.post("/", response_model=LoanOfficerResponse, status_code=status.HTTP_201_CREATED)
async def create_loan_officer(
    officer_data: LoanOfficerCreate,
    db: Session = Depends(get_db),
    current_user: LoanOfficer = Depends(get_current_user)
):
    """Create a new loan officer."""
    # Check if email already exists
    existing = db.query(LoanOfficer).filter(LoanOfficer.email == officer_data.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Hash password
    hashed_password = get_password_hash(officer_data.password)
    
    # Create officer
    officer_dict = officer_data.dict()
    del officer_dict["password"]
    
    officer = LoanOfficer(**officer_dict, hashed_password=hashed_password)
    
    db.add(officer)
    db.commit()
    db.refresh(officer)
    
    return officer

@router.put("/me", response_model=LoanOfficerResponse)
async def update_current_loan_officer(
    officer_data: LoanOfficerUpdate,
    db: Session = Depends(get_db),
    current_user: LoanOfficer = Depends(get_current_user)
):
    """Update current loan officer profile."""
    # Update fields
    update_data = officer_data.dict(exclude_unset=True)
    
    # Handle password separately
    if "password" in update_data:
        hashed_password = get_password_hash(update_data.pop("password"))
        current_user.hashed_password = hashed_password
    
    for field, value in update_data.items():
        setattr(current_user, field, value)
    
    current_user.updated_at = datetime.now()
    db.commit()
    db.refresh(current_user)
    
    return current_user

@router.get("/{officer_id}/performance")
async def get_loan_officer_performance(
    officer_id: int,
    db: Session = Depends(get_db),
    current_user: LoanOfficer = Depends(get_current_user)
):
    """Get performance metrics for a loan officer."""
    officer = db.query(LoanOfficer).filter(LoanOfficer.id == officer_id).first()
    if not officer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Loan officer not found"
        )
    
    # Calculate additional metrics
    from models.database import Lead, LeadStatus
    
    total_leads = db.query(Lead).filter(Lead.assigned_loan_officer_id == officer_id).count()
    qualified_leads = db.query(Lead).filter(
        Lead.assigned_loan_officer_id == officer_id,
        Lead.status == LeadStatus.QUALIFIED
    ).count()
    converted_leads = db.query(Lead).filter(
        Lead.assigned_loan_officer_id == officer_id,
        Lead.status == LeadStatus.CONVERTED
    ).count()
    
    qualification_rate = (qualified_leads / total_leads * 100) if total_leads > 0 else 0
    
    return {
        "officer_id": officer_id,
        "name": officer.name,
        "total_leads_assigned": officer.total_leads_assigned,
        "total_loans_closed": officer.total_loans_closed,
        "conversion_rate": officer.conversion_rate,
        "average_loan_amount": officer.average_loan_amount,
        "current_qualified_leads": qualified_leads,
        "current_converted_leads": converted_leads,
        "qualification_rate": round(qualification_rate, 2)
    }