from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import json
from datetime import datetime, date
from typing import List, Optional
from pydantic import BaseModel
import os

# Create FastAPI app
app = FastAPI(
    title="Wedding Registry Lead Generation API - Realistic Data",
    description="Demo with realistic wedding registry data",
    version="1.0.0-realistic",
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load realistic data
def load_data():
    """Load the generated realistic data."""
    try:
        with open('sample_couples.json', 'r') as f:
            couples = json.load(f)
        
        with open('sample_leads.json', 'r') as f:
            leads = json.load(f)
        
        return couples, leads
    except FileNotFoundError:
        print("Sample data files not found. Run generate_sample_data.py first!")
        return [], []

COUPLES_DATA, LEADS_DATA = load_data()

# Pydantic models for response validation
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

# Calculate metrics from real data
def calculate_metrics():
    """Calculate dashboard metrics from realistic data."""
    total_couples = len(COUPLES_DATA)
    total_leads = len(LEADS_DATA)
    
    qualified_leads = len([l for l in LEADS_DATA if l['status'] in ['qualified', 'converted']])
    converted_leads = len([l for l in LEADS_DATA if l['status'] == 'converted'])
    
    # Calculate average lead score
    if LEADS_DATA:
        avg_score = sum(l['lead_score'] for l in LEADS_DATA) / len(LEADS_DATA)
    else:
        avg_score = 0
    
    # Calculate conversion rate
    conversion_rate = (converted_leads / total_leads * 100) if total_leads > 0 else 0
    
    # Calculate leads ready for contact (those with status 'new')
    ready_for_contact = len([l for l in LEADS_DATA if l['status'] == 'new'])
    
    # Estimate revenue (converted leads * avg loan amount * commission)
    avg_loan_amount = 400000  # Average home price
    commission_rate = 0.006   # ~0.6% commission
    total_revenue = converted_leads * avg_loan_amount * commission_rate
    
    return DashboardMetrics(
        total_couples=total_couples,
        total_leads=total_leads,
        qualified_leads=qualified_leads,
        converted_leads=converted_leads,
        total_revenue=total_revenue,
        average_lead_score=round(avg_score, 1),
        conversion_rate=round(conversion_rate, 1),
        leads_ready_for_contact=ready_for_contact
    )

def calculate_leads_by_stage():
    """Calculate lead distribution by stage."""
    stage_counts = {}
    for lead in LEADS_DATA:
        status = lead['status']
        stage_counts[status] = stage_counts.get(status, 0) + 1
    
    return [LeadsByStage(stage=stage, count=count) for stage, count in stage_counts.items()]

def calculate_geographic_distribution():
    """Calculate geographic distribution from real data."""
    state_counts = {}
    city_counts = {}
    
    for couple in COUPLES_DATA:
        state = couple.get('wedding_state', '')
        city = couple.get('wedding_city', '')
        
        if state:
            state_counts[state] = state_counts.get(state, 0) + 1
        
        if city and state:
            city_key = f"{city}, {state}"
            city_counts[city_key] = city_counts.get(city_key, 0) + 1
    
    # Sort by count
    by_state = [{"state": state, "count": count} for state, count in 
               sorted(state_counts.items(), key=lambda x: x[1], reverse=True)]
    
    top_cities = [{"city": city, "count": count} for city, count in 
                  sorted(city_counts.items(), key=lambda x: x[1], reverse=True)[:10]]
    
    return {
        "by_state": by_state,
        "top_cities": top_cities
    }

# Health check
@app.get("/health")
async def health_check():
    return {
        "status": "healthy", 
        "message": "Wedding Registry Integration API with Realistic Data",
        "data_loaded": len(COUPLES_DATA) > 0,
        "couples_count": len(COUPLES_DATA),
        "leads_count": len(LEADS_DATA)
    }

# Analytics endpoints
@app.get("/api/v1/analytics/dashboard")
async def get_dashboard_metrics():
    return calculate_metrics()

@app.get("/api/v1/analytics/leads-by-stage")
async def get_leads_by_stage():
    return calculate_leads_by_stage()

@app.get("/api/v1/analytics/geographic-distribution")
async def get_geographic_distribution():
    return calculate_geographic_distribution()

@app.get("/api/v1/analytics/campaign-performance")
async def get_campaign_performance():
    # Simulate campaign performance based on lead data
    total_campaigns = 5
    total_sends = len(COUPLES_DATA) * 3  # Assume 3 emails per couple on average
    
    # Simulate realistic email performance
    total_opens = int(total_sends * 0.68)     # 68% open rate
    total_clicks = int(total_sends * 0.23)    # 23% click rate  
    total_conversions = len([l for l in LEADS_DATA if l['status'] == 'converted'])
    
    return {
        "total_campaigns": total_campaigns,
        "total_sends": total_sends,
        "total_opens": total_opens,
        "total_clicks": total_clicks,
        "total_conversions": total_conversions,
        "average_open_rate": 68.0,
        "average_click_rate": 23.0,
        "average_conversion_rate": round((total_conversions / total_sends * 100), 2)
    }

@app.get("/api/v1/analytics/timeline-analysis")
async def get_timeline_analysis():
    # Generate timeline data from couples/leads creation dates
    timeline_data = {
        "leads_timeline": [],
        "couples_timeline": []
    }
    
    # Simulate daily counts over the last 30 days
    from datetime import datetime, timedelta
    for i in range(30):
        date_str = (datetime.now() - timedelta(days=29-i)).strftime("%Y-%m-%d")
        # Simulate realistic daily counts
        timeline_data["leads_timeline"].append({
            "date": date_str,
            "count": max(0, int(len(LEADS_DATA) / 30 + (i % 7 - 3)))  # Vary by day
        })
        timeline_data["couples_timeline"].append({
            "date": date_str, 
            "count": max(0, int(len(COUPLES_DATA) / 30 + (i % 5 - 2)))
        })
    
    return timeline_data

# Leads endpoints
@app.get("/api/v1/leads")
async def get_leads(page: int = 1, page_size: int = 20, status: Optional[str] = None, min_score: Optional[float] = None):
    filtered_leads = LEADS_DATA.copy()
    
    # Apply filters
    if status:
        filtered_leads = [l for l in filtered_leads if l['status'] == status]
    
    if min_score is not None:
        filtered_leads = [l for l in filtered_leads if l['lead_score'] >= min_score]
    
    # Sort by lead score (highest first)
    filtered_leads.sort(key=lambda x: x['lead_score'], reverse=True)
    
    # Apply pagination
    start_idx = (page - 1) * page_size
    end_idx = start_idx + page_size
    page_leads = filtered_leads[start_idx:end_idx]
    
    return {
        "leads": page_leads,
        "total_count": len(filtered_leads),
        "page": page,
        "page_size": page_size
    }

@app.get("/api/v1/leads/{lead_id}")
async def get_lead(lead_id: int):
    lead = next((l for l in LEADS_DATA if l['id'] == lead_id), None)
    if not lead:
        return {"error": "Lead not found"}
    return lead

# Couples endpoints  
@app.get("/api/v1/couples")
async def get_couples(page: int = 1, page_size: int = 50, wedding_stage: Optional[str] = None, 
                     city: Optional[str] = None, state: Optional[str] = None):
    filtered_couples = COUPLES_DATA.copy()
    
    # Apply filters
    if wedding_stage:
        filtered_couples = [c for c in filtered_couples if c['wedding_stage'] == wedding_stage]
    
    if city:
        filtered_couples = [c for c in filtered_couples if city.lower() in c.get('wedding_city', '').lower()]
    
    if state:
        filtered_couples = [c for c in filtered_couples if state.upper() == c.get('wedding_state', '')]
    
    # Sort by creation date (newest first)
    filtered_couples.sort(key=lambda x: x['created_at'], reverse=True)
    
    # Apply pagination
    start_idx = (page - 1) * page_size
    end_idx = start_idx + page_size
    page_couples = filtered_couples[start_idx:end_idx]
    
    return page_couples

@app.get("/api/v1/couples/{couple_id}")
async def get_couple(couple_id: int):
    couple = next((c for c in COUPLES_DATA if c['id'] == couple_id), None)
    if not couple:
        return {"error": "Couple not found"}
    return couple

# Campaigns endpoints (simulated)
@app.get("/api/v1/campaigns")
async def get_campaigns():
    # Return some realistic sample campaigns
    return [
        {
            "id": 1,
            "name": "Engagement Congratulations Campaign", 
            "description": "Welcome newly engaged couples with home buying information",
            "campaign_type": "email",
            "status": "active",
            "total_sends": len([c for c in COUPLES_DATA if c['wedding_stage'] == 'engaged']),
            "total_opens": 45,
            "total_clicks": 18,
            "total_conversions": 4,
            "created_at": "2024-01-01T00:00:00"
        },
        {
            "id": 2,
            "name": "Post-Wedding Home Buyers",
            "description": "Reach out to recently married couples",
            "campaign_type": "email", 
            "status": "completed",
            "total_sends": len([c for c in COUPLES_DATA if c['wedding_stage'] == 'recently_married']),
            "total_opens": 32,
            "total_clicks": 15,
            "total_conversions": 6,
            "created_at": "2024-01-15T00:00:00"
        },
        {
            "id": 3,
            "name": "Wedding Planning Timeline",
            "description": "Educational content for couples in planning phase",
            "campaign_type": "email",
            "status": "active", 
            "total_sends": len([c for c in COUPLES_DATA if c['wedding_stage'] == 'planning']),
            "total_opens": 28,
            "total_clicks": 12,
            "total_conversions": 2,
            "created_at": "2024-02-01T00:00:00"
        }
    ]

# Root endpoint
@app.get("/")
async def root():
    return {
        "message": "Wedding Registry Lead Generation API - Realistic Data",
        "version": "1.0.0-realistic",
        "docs": "/docs",
        "health": "/health",
        "data_summary": {
            "couples": len(COUPLES_DATA),
            "leads": len(LEADS_DATA),
            "avg_lead_score": round(sum(l['lead_score'] for l in LEADS_DATA) / len(LEADS_DATA), 1) if LEADS_DATA else 0,
            "top_states": list(set([c['wedding_state'] for c in COUPLES_DATA[:10]]))
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main_realistic:app", host="0.0.0.0", port=8000, reload=True)