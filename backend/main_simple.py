from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import json
from datetime import datetime, date
from typing import List, Optional
from pydantic import BaseModel

# Create FastAPI app
app = FastAPI(
    title="Wedding Registry Lead Generation API - Demo",
    description="Demo version with sample data",
    version="1.0.0-demo",
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Sample data models
class DashboardMetrics(BaseModel):
    total_couples: int = 156
    total_leads: int = 89
    qualified_leads: int = 34
    converted_leads: int = 12
    total_revenue: float = 2400000.0
    average_lead_score: float = 72.3
    conversion_rate: float = 13.5
    leads_ready_for_contact: int = 23

class LeadsByStage(BaseModel):
    stage: str
    count: int

class Lead(BaseModel):
    id: int
    couple_id: int
    lead_score: float
    qualification_score: float
    status: str
    target_purchase_price: Optional[float]
    target_location: Optional[str]
    estimated_income: Optional[float]
    created_at: str
    updated_at: str

class Couple(BaseModel):
    id: int
    partner_1_name: str
    partner_2_name: str
    partner_1_email: Optional[str]
    partner_2_email: Optional[str]
    wedding_date: Optional[str]
    wedding_stage: str
    wedding_city: Optional[str]
    wedding_state: Optional[str]
    wedding_budget: Optional[float]
    source_platform: Optional[str]
    created_at: str

class Campaign(BaseModel):
    id: int
    name: str
    description: Optional[str]
    campaign_type: str
    status: str
    total_sends: int
    total_opens: int
    total_clicks: int
    total_conversions: int
    created_at: str

# Sample data
SAMPLE_LEADS = [
    Lead(
        id=1, couple_id=1, lead_score=85.2, qualification_score=78.5,
        status="qualified", target_purchase_price=450000, target_location="San Francisco, CA",
        estimated_income=120000, created_at="2024-01-15T10:30:00", updated_at="2024-01-20T14:15:00"
    ),
    Lead(
        id=2, couple_id=2, lead_score=67.8, qualification_score=65.2,
        status="contacted", target_purchase_price=320000, target_location="Austin, TX",
        estimated_income=85000, created_at="2024-01-18T09:15:00", updated_at="2024-01-22T11:30:00"
    ),
    Lead(
        id=3, couple_id=3, lead_score=92.1, qualification_score=88.9,
        status="converted", target_purchase_price=680000, target_location="Seattle, WA",
        estimated_income=150000, created_at="2024-01-10T16:45:00", updated_at="2024-01-25T13:20:00"
    ),
]

SAMPLE_COUPLES = [
    Couple(
        id=1, partner_1_name="Sarah Johnson", partner_2_name="Mike Thompson",
        partner_1_email="sarah@email.com", partner_2_email="mike@email.com",
        wedding_date="2024-06-15", wedding_stage="engaged", wedding_city="San Francisco",
        wedding_state="CA", wedding_budget=35000, source_platform="the_knot",
        created_at="2024-01-15T10:30:00"
    ),
    Couple(
        id=2, partner_1_name="Emma Wilson", partner_2_name="David Brown",
        partner_1_email="emma@email.com", partner_2_email="david@email.com",
        wedding_date="2024-04-20", wedding_stage="planning", wedding_city="Austin",
        wedding_state="TX", wedding_budget=28000, source_platform="zola",
        created_at="2024-01-18T09:15:00"
    ),
    Couple(
        id=3, partner_1_name="Lisa Chen", partner_2_name="James Rodriguez",
        partner_1_email="lisa@email.com", partner_2_email="james@email.com",
        wedding_date="2023-12-10", wedding_stage="recently_married", wedding_city="Seattle",
        wedding_state="WA", wedding_budget=45000, source_platform="weddingwire",
        created_at="2024-01-10T16:45:00"
    ),
]

SAMPLE_CAMPAIGNS = [
    Campaign(
        id=1, name="Engagement Congratulations", description="Welcome new couples",
        campaign_type="email", status="active", total_sends=125, total_opens=89,
        total_clicks=34, total_conversions=8, created_at="2024-01-01T00:00:00"
    ),
    Campaign(
        id=2, name="Post-Wedding Home Buying", description="Reach out to newlyweds",
        campaign_type="email", status="completed", total_sends=67, total_opens=45,
        total_clicks=18, total_conversions=4, created_at="2024-01-10T00:00:00"
    ),
]

# Health check
@app.get("/health")
async def health_check():
    return {"status": "healthy", "message": "Wedding Registry Integration API Demo is running"}

# Analytics endpoints
@app.get("/api/v1/analytics/dashboard")
async def get_dashboard_metrics():
    return DashboardMetrics()

@app.get("/api/v1/analytics/leads-by-stage")
async def get_leads_by_stage():
    return [
        LeadsByStage(stage="new", count=23),
        LeadsByStage(stage="contacted", count=31),
        LeadsByStage(stage="qualified", count=18),
        LeadsByStage(stage="nurturing", count=12),
        LeadsByStage(stage="converted", count=5),
    ]

@app.get("/api/v1/analytics/geographic-distribution")
async def get_geographic_distribution():
    return {
        "by_state": [
            {"state": "CA", "count": 45},
            {"state": "TX", "count": 32},
            {"state": "NY", "count": 28},
            {"state": "FL", "count": 24},
            {"state": "WA", "count": 18},
        ],
        "top_cities": [
            {"city": "San Francisco, CA", "count": 23},
            {"city": "Austin, TX", "count": 19},
            {"city": "New York, NY", "count": 17},
            {"city": "Miami, FL", "count": 15},
            {"city": "Seattle, WA", "count": 12},
        ]
    }

@app.get("/api/v1/analytics/campaign-performance")
async def get_campaign_performance():
    return {
        "total_campaigns": 8,
        "total_sends": 2340,
        "total_opens": 1678,
        "total_clicks": 534,
        "total_conversions": 89,
        "average_open_rate": 71.7,
        "average_click_rate": 22.8,
        "average_conversion_rate": 3.8
    }

@app.get("/api/v1/analytics/timeline-analysis")
async def get_timeline_analysis():
    return {
        "leads_timeline": [
            {"date": "2024-01-01", "count": 5},
            {"date": "2024-01-02", "count": 3},
            {"date": "2024-01-03", "count": 8},
            {"date": "2024-01-04", "count": 6},
            {"date": "2024-01-05", "count": 12},
        ],
        "couples_timeline": [
            {"date": "2024-01-01", "count": 7},
            {"date": "2024-01-02", "count": 4},
            {"date": "2024-01-03", "count": 9},
            {"date": "2024-01-04", "count": 8},
            {"date": "2024-01-05", "count": 15},
        ]
    }

# Leads endpoints
@app.get("/api/v1/leads")
async def get_leads():
    return {
        "leads": SAMPLE_LEADS,
        "total_count": len(SAMPLE_LEADS),
        "page": 1,
        "page_size": 20
    }

@app.get("/api/v1/leads/{lead_id}")
async def get_lead(lead_id: int):
    lead = next((l for l in SAMPLE_LEADS if l.id == lead_id), None)
    if not lead:
        return {"error": "Lead not found"}
    return lead

# Couples endpoints
@app.get("/api/v1/couples")
async def get_couples():
    return SAMPLE_COUPLES

@app.get("/api/v1/couples/{couple_id}")
async def get_couple(couple_id: int):
    couple = next((c for c in SAMPLE_COUPLES if c.id == couple_id), None)
    if not couple:
        return {"error": "Couple not found"}
    return couple

# Campaigns endpoints
@app.get("/api/v1/campaigns")
async def get_campaigns():
    return SAMPLE_CAMPAIGNS

@app.get("/api/v1/campaigns/{campaign_id}")
async def get_campaign(campaign_id: int):
    campaign = next((c for c in SAMPLE_CAMPAIGNS if c.id == campaign_id), None)
    if not campaign:
        return {"error": "Campaign not found"}
    return campaign

@app.get("/api/v1/campaigns/{campaign_id}/performance")
async def get_campaign_performance_detail(campaign_id: int):
    campaign = next((c for c in SAMPLE_CAMPAIGNS if c.id == campaign_id), None)
    if not campaign:
        return {"error": "Campaign not found"}
    
    open_rate = (campaign.total_opens / campaign.total_sends * 100) if campaign.total_sends > 0 else 0
    click_rate = (campaign.total_clicks / campaign.total_sends * 100) if campaign.total_sends > 0 else 0
    response_rate = 0  # Would calculate from responses
    conversion_rate = (campaign.total_conversions / campaign.total_sends * 100) if campaign.total_sends > 0 else 0
    
    return {
        "campaign_id": campaign_id,
        "total_sends": campaign.total_sends,
        "total_opens": campaign.total_opens,
        "total_clicks": campaign.total_clicks,
        "total_responses": 0,
        "total_conversions": campaign.total_conversions,
        "open_rate": round(open_rate, 2),
        "click_rate": round(click_rate, 2),
        "response_rate": round(response_rate, 2),
        "conversion_rate": round(conversion_rate, 2)
    }

# Root endpoint
@app.get("/")
async def root():
    return {
        "message": "Wedding Registry Lead Generation API - Demo Version",
        "version": "1.0.0-demo",
        "docs": "/docs",
        "health": "/health",
        "note": "This is a demo version with sample data"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main_simple:app", host="0.0.0.0", port=8000, reload=True)