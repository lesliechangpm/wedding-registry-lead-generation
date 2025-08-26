"""
FastAPI backend for Wedding Registry Lead Generation Platform - Database Version
"""

from fastapi import FastAPI, HTTPException, Depends, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from typing import List, Optional
import json
from datetime import datetime, timedelta

from database.connection import get_db
from models.database_models import Couple, Lead, Campaign, LoanOfficer, LeadActivity, Setting

app = FastAPI(
    title="Wedding Registry Lead Generation API",
    description="Professional wedding registry integration for mortgage lead generation",
    version="2.0.0"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001", 
        "http://localhost:3002",
        "https://wedding-registry-demo.netlify.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health_check():
    return {"status": "healthy", "version": "2.0.0", "database": "connected"}


@app.get("/api/v1/analytics/dashboard")
async def get_dashboard_metrics(db: Session = Depends(get_db)):
    """Get dashboard analytics with real-time data from database"""
    
    # Get total counts
    total_couples = db.query(Couple).count()
    total_leads = db.query(Lead).count()
    
    # Get lead status breakdown
    status_counts = db.query(Lead.status, func.count(Lead.id)).group_by(Lead.status).all()
    status_dict = dict(status_counts)
    
    # Calculate conversion rate
    conversion_rate = round((total_leads / total_couples * 100), 1) if total_couples > 0 else 0
    
    # Get recently married couples (higher value leads)
    recently_married = db.query(Couple).filter(Couple.wedding_stage == "recently_married").count()
    
    # Calculate average wedding budget
    avg_budget_result = db.query(func.avg(Couple.wedding_budget)).scalar()
    avg_budget = int(avg_budget_result) if avg_budget_result else 0
    
    # Get high-value leads (target price > $500K)
    high_value_leads = db.query(Lead).filter(Lead.target_purchase_price >= 500000).count()
    
    # Calculate average lead score
    avg_score_result = db.query(func.avg(Lead.lead_score)).scalar()
    avg_lead_score = round(avg_score_result, 1) if avg_score_result else 0
    
    return {
        "total_couples": total_couples,
        "total_leads": total_leads,
        "conversion_rate": f"{conversion_rate}%",
        "recently_married_couples": recently_married,
        "average_wedding_budget": avg_budget,
        "high_value_leads": high_value_leads,
        "average_lead_score": avg_lead_score,
        "lead_status_breakdown": {
            "new": status_dict.get("new", 0),
            "contacted": status_dict.get("contacted", 0),
            "qualified": status_dict.get("qualified", 0),
            "nurturing": status_dict.get("nurturing", 0),
            "converted": status_dict.get("converted", 0)
        },
        "generated_at": datetime.now().isoformat()
    }


@app.get("/api/v1/leads")
async def get_leads(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    status: Optional[str] = None,
    min_score: Optional[int] = None,
    db: Session = Depends(get_db)
):
    """Get paginated leads with filtering"""
    
    query = db.query(Lead).join(Couple, Lead.couple_id == Couple.id)
    
    # Apply filters
    if status:
        query = query.filter(Lead.status == status)
    if min_score:
        query = query.filter(Lead.lead_score >= min_score)
    
    # Get total count for pagination
    total = query.count()
    
    # Apply pagination and ordering
    leads = query.order_by(desc(Lead.lead_score), desc(Lead.created_at))\
                 .offset((page - 1) * page_size)\
                 .limit(page_size)\
                 .all()
    
    # Format response
    leads_data = []
    for lead in leads:
        couple = lead.couple
        leads_data.append({
            "id": lead.id,
            "couple_id": lead.couple_id,
            "couple_names": f"{couple.partner_1_name} & {couple.partner_2_name}",
            "target_purchase_price": lead.target_purchase_price,
            "target_down_payment": lead.target_down_payment,
            "estimated_income": lead.estimated_income,
            "wedding_budget": couple.wedding_budget,
            "wedding_location": f"{couple.wedding_city}, {couple.wedding_state}",
            "wedding_stage": couple.wedding_stage,
            "timeline_to_purchase": lead.timeline_to_purchase,
            "credit_score_range": lead.credit_score_range,
            "lead_score": lead.lead_score,
            "status": lead.status,
            "created_at": lead.created_at.isoformat(),
            "updated_at": lead.updated_at.isoformat()
        })
    
    return {
        "leads": leads_data,
        "pagination": {
            "page": page,
            "page_size": page_size,
            "total": total,
            "pages": (total + page_size - 1) // page_size
        }
    }


@app.get("/api/v1/couples")
async def get_couples(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    stage: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get paginated couples with filtering"""
    
    query = db.query(Couple)
    
    # Apply filters
    if stage:
        query = query.filter(Couple.wedding_stage == stage)
    
    # Get total count
    total = query.count()
    
    # Apply pagination
    couples = query.order_by(desc(Couple.wedding_budget), desc(Couple.created_at))\
                   .offset((page - 1) * page_size)\
                   .limit(page_size)\
                   .all()
    
    # Format response
    couples_data = []
    for couple in couples:
        # Check if couple has a lead
        has_lead = db.query(Lead).filter(Lead.couple_id == couple.id).first() is not None
        
        couples_data.append({
            "id": couple.id,
            "partner_1_name": couple.partner_1_name,
            "partner_2_name": couple.partner_2_name,
            "wedding_date": couple.wedding_date,
            "wedding_stage": couple.wedding_stage,
            "wedding_venue": couple.wedding_venue,
            "wedding_city": couple.wedding_city,
            "wedding_state": couple.wedding_state,
            "wedding_budget": couple.wedding_budget,
            "guest_count": couple.guest_count,
            "source_platform": couple.source_platform,
            "has_lead": has_lead,
            "created_at": couple.created_at.isoformat()
        })
    
    return {
        "couples": couples_data,
        "pagination": {
            "page": page,
            "page_size": page_size,
            "total": total,
            "pages": (total + page_size - 1) // page_size
        }
    }


@app.get("/api/v1/campaigns")
async def get_campaigns(db: Session = Depends(get_db)):
    """Get all marketing campaigns"""
    
    campaigns = db.query(Campaign).order_by(desc(Campaign.created_at)).all()
    
    campaigns_data = []
    for campaign in campaigns:
        # Calculate performance metrics
        open_rate = (campaign.total_opens / campaign.total_sends * 100) if campaign.total_sends > 0 else 0
        click_rate = (campaign.total_clicks / campaign.total_opens * 100) if campaign.total_opens > 0 else 0
        response_rate = (campaign.total_responses / campaign.total_sends * 100) if campaign.total_sends > 0 else 0
        
        campaigns_data.append({
            "id": campaign.id,
            "name": campaign.name,
            "type": campaign.type,
            "status": campaign.status,
            "total_sends": campaign.total_sends,
            "total_opens": campaign.total_opens,
            "total_clicks": campaign.total_clicks,
            "total_responses": campaign.total_responses,
            "open_rate": round(open_rate, 1),
            "click_rate": round(click_rate, 1),
            "response_rate": round(response_rate, 1),
            "budget": campaign.budget,
            "spend": campaign.spend,
            "roi": round(((campaign.total_responses * 5000 - campaign.spend) / campaign.spend * 100), 1) if campaign.spend > 0 else 0,
            "created_at": campaign.created_at.isoformat()
        })
    
    return {"campaigns": campaigns_data}


@app.get("/api/v1/leads/{lead_id}")
async def get_lead_details(lead_id: int, db: Session = Depends(get_db)):
    """Get detailed information for a specific lead"""
    
    lead = db.query(Lead).filter(Lead.id == lead_id).first()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    
    couple = lead.couple
    activities = db.query(LeadActivity).filter(LeadActivity.lead_id == lead_id)\
                   .order_by(desc(LeadActivity.created_at)).all()
    
    activities_data = [{
        "id": activity.id,
        "activity_type": activity.activity_type,
        "description": activity.description,
        "outcome": activity.outcome,
        "created_at": activity.created_at.isoformat(),
        "created_by": activity.created_by
    } for activity in activities]
    
    return {
        "lead": {
            "id": lead.id,
            "couple_id": lead.couple_id,
            "couple_names": f"{couple.partner_1_name} & {couple.partner_2_name}",
            "target_purchase_price": lead.target_purchase_price,
            "target_down_payment": lead.target_down_payment,
            "estimated_income": lead.estimated_income,
            "current_rent": lead.current_rent,
            "wedding_budget": couple.wedding_budget,
            "wedding_location": f"{couple.wedding_city}, {couple.wedding_state}",
            "wedding_date": couple.wedding_date,
            "wedding_stage": couple.wedding_stage,
            "timeline_to_purchase": lead.timeline_to_purchase,
            "property_type_interest": lead.property_type_interest,
            "credit_score_range": lead.credit_score_range,
            "debt_to_income_ratio": lead.debt_to_income_ratio,
            "lead_score": lead.lead_score,
            "status": lead.status,
            "created_at": lead.created_at.isoformat(),
            "updated_at": lead.updated_at.isoformat()
        },
        "activities": activities_data
    }


@app.get("/api/v1/loan-officers")
async def get_loan_officers(db: Session = Depends(get_db)):
    """Get all loan officers"""
    
    officers = db.query(LoanOfficer).filter(LoanOfficer.active == True).all()
    
    officers_data = []
    for officer in officers:
        # Count assigned leads
        assigned_leads = db.query(Lead).filter(Lead.assigned_loan_officer_id == officer.id).count()
        
        officers_data.append({
            "id": officer.id,
            "name": officer.name,
            "email": officer.email,
            "phone": officer.phone,
            "specialty": officer.specialty,
            "assigned_leads": assigned_leads,
            "active": officer.active
        })
    
    return {"loan_officers": officers_data}


if __name__ == "__main__":
    import uvicorn
    print("Starting Wedding Registry Lead Generation API v2.0 (Database Edition)")
    print("Database: wedding_registry.db")
    print("API Documentation: http://localhost:8000/docs")
    uvicorn.run(app, host="0.0.0.0", port=8000)