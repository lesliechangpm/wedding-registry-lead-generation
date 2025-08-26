from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, and_
from datetime import datetime, date, timedelta

from models.database import Lead, Couple, Campaign, LoanOfficer, LeadStatus, WeddingStage
from utils.database import get_db
from utils.auth import get_current_user

router = APIRouter()

from pydantic import BaseModel

class DashboardMetrics(BaseModel):
    total_couples: int
    total_leads: int
    qualified_leads: int
    converted_leads: int
    total_revenue: float
    average_lead_score: float
    conversion_rate: float
    leads_ready_for_contact: int

class LeadsByStage(BaseModel):
    stage: str
    count: int

class RevenueByMonth(BaseModel):
    month: str
    revenue: float
    loan_count: int

@router.get("/dashboard", response_model=DashboardMetrics)
async def get_dashboard_metrics(
    db: Session = Depends(get_db),
    current_user: LoanOfficer = Depends(get_current_user)
):
    """Get high-level dashboard metrics."""
    
    # Total couples
    total_couples = db.query(func.count(Couple.id)).scalar()
    
    # Total leads
    total_leads = db.query(func.count(Lead.id)).scalar()
    
    # Qualified leads
    qualified_leads = db.query(func.count(Lead.id)).filter(
        Lead.status == LeadStatus.QUALIFIED
    ).scalar()
    
    # Converted leads
    converted_leads = db.query(func.count(Lead.id)).filter(
        Lead.status == LeadStatus.CONVERTED
    ).scalar()
    
    # Average lead score
    avg_score_result = db.query(func.avg(Lead.lead_score)).scalar()
    average_lead_score = float(avg_score_result) if avg_score_result else 0.0
    
    # Conversion rate
    conversion_rate = (converted_leads / total_leads * 100) if total_leads > 0 else 0.0
    
    # Leads ready for contact (past waiting period)
    now = datetime.now()
    leads_ready = db.query(func.count(Lead.id)).filter(
        Lead.earliest_contact_date <= now,
        Lead.status == LeadStatus.NEW
    ).scalar()
    
    # TODO: Calculate total revenue from closed loans
    total_revenue = 0.0  # This would come from a loans/closings table
    
    return DashboardMetrics(
        total_couples=total_couples,
        total_leads=total_leads,
        qualified_leads=qualified_leads,
        converted_leads=converted_leads,
        total_revenue=total_revenue,
        average_lead_score=round(average_lead_score, 2),
        conversion_rate=round(conversion_rate, 2),
        leads_ready_for_contact=leads_ready
    )

@router.get("/leads-by-stage", response_model=List[LeadsByStage])
async def get_leads_by_stage(
    db: Session = Depends(get_db),
    current_user: LoanOfficer = Depends(get_current_user)
):
    """Get lead distribution by status."""
    results = db.query(
        Lead.status,
        func.count(Lead.id).label('count')
    ).group_by(Lead.status).all()
    
    return [
        LeadsByStage(stage=result[0].value, count=result[1])
        for result in results
    ]

@router.get("/wedding-stages", response_model=List[LeadsByStage])
async def get_couples_by_wedding_stage(
    db: Session = Depends(get_db),
    current_user: LoanOfficer = Depends(get_current_user)
):
    """Get couple distribution by wedding stage."""
    results = db.query(
        Couple.wedding_stage,
        func.count(Couple.id).label('count')
    ).group_by(Couple.wedding_stage).all()
    
    return [
        LeadsByStage(stage=result[0].value, count=result[1])
        for result in results
    ]

@router.get("/lead-scores")
async def get_lead_score_distribution(
    db: Session = Depends(get_db),
    current_user: LoanOfficer = Depends(get_current_user)
):
    """Get lead score distribution."""
    # Group leads by score ranges
    score_ranges = [
        ("0-20", 0, 20),
        ("21-40", 21, 40),
        ("41-60", 41, 60),
        ("61-80", 61, 80),
        ("81-100", 81, 100)
    ]
    
    distribution = []
    for range_name, min_score, max_score in score_ranges:
        count = db.query(func.count(Lead.id)).filter(
            and_(Lead.lead_score >= min_score, Lead.lead_score <= max_score)
        ).scalar()
        
        distribution.append({
            "score_range": range_name,
            "count": count
        })
    
    return distribution

@router.get("/campaign-performance")
async def get_campaign_performance_summary(
    db: Session = Depends(get_db),
    current_user: LoanOfficer = Depends(get_current_user)
):
    """Get overall campaign performance metrics."""
    campaigns = db.query(Campaign).filter(
        Campaign.created_by_officer_id == current_user.id
    ).all()
    
    total_campaigns = len(campaigns)
    total_sends = sum(c.total_sends for c in campaigns)
    total_opens = sum(c.total_opens for c in campaigns)
    total_clicks = sum(c.total_clicks for c in campaigns)
    total_conversions = sum(c.total_conversions for c in campaigns)
    
    avg_open_rate = (total_opens / total_sends * 100) if total_sends > 0 else 0
    avg_click_rate = (total_clicks / total_sends * 100) if total_sends > 0 else 0
    avg_conversion_rate = (total_conversions / total_sends * 100) if total_sends > 0 else 0
    
    return {
        "total_campaigns": total_campaigns,
        "total_sends": total_sends,
        "total_opens": total_opens,
        "total_clicks": total_clicks,
        "total_conversions": total_conversions,
        "average_open_rate": round(avg_open_rate, 2),
        "average_click_rate": round(avg_click_rate, 2),
        "average_conversion_rate": round(avg_conversion_rate, 2)
    }

@router.get("/geographic-distribution")
async def get_geographic_distribution(
    db: Session = Depends(get_db),
    current_user: LoanOfficer = Depends(get_current_user)
):
    """Get geographic distribution of couples."""
    # By state
    by_state = db.query(
        Couple.wedding_state,
        func.count(Couple.id).label('count')
    ).filter(
        Couple.wedding_state.isnot(None)
    ).group_by(Couple.wedding_state).order_by(func.count(Couple.id).desc()).all()
    
    # By city (top 10)
    by_city = db.query(
        Couple.wedding_city,
        Couple.wedding_state,
        func.count(Couple.id).label('count')
    ).filter(
        and_(Couple.wedding_city.isnot(None), Couple.wedding_state.isnot(None))
    ).group_by(Couple.wedding_city, Couple.wedding_state).order_by(
        func.count(Couple.id).desc()
    ).limit(10).all()
    
    return {
        "by_state": [
            {"state": result[0], "count": result[1]}
            for result in by_state
        ],
        "top_cities": [
            {"city": f"{result[0]}, {result[1]}", "count": result[2]}
            for result in by_city
        ]
    }

@router.get("/timeline-analysis")
async def get_timeline_analysis(
    days: int = Query(30, ge=1, le=365),
    db: Session = Depends(get_db),
    current_user: LoanOfficer = Depends(get_current_user)
):
    """Get timeline analysis of leads and couples created over time."""
    from datetime import datetime, timedelta
    
    end_date = datetime.now()
    start_date = end_date - timedelta(days=days)
    
    # Leads created over time
    leads_by_day = db.query(
        func.date(Lead.created_at).label('date'),
        func.count(Lead.id).label('count')
    ).filter(
        Lead.created_at >= start_date
    ).group_by(func.date(Lead.created_at)).order_by(func.date(Lead.created_at)).all()
    
    # Couples added over time
    couples_by_day = db.query(
        func.date(Couple.created_at).label('date'),
        func.count(Couple.id).label('count')
    ).filter(
        Couple.created_at >= start_date
    ).group_by(func.date(Couple.created_at)).order_by(func.date(Couple.created_at)).all()
    
    return {
        "leads_timeline": [
            {"date": result[0].isoformat(), "count": result[1]}
            for result in leads_by_day
        ],
        "couples_timeline": [
            {"date": result[0].isoformat(), "count": result[1]}
            for result in couples_by_day
        ]
    }