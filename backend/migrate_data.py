"""
Migration script to move existing JSON data to database
"""

import json
from datetime import datetime
import sys
import os
from pathlib import Path

# Add the backend directory to Python path
sys.path.append(str(Path(__file__).parent))

from database.connection import init_database, SessionLocal
from models.database_models import Couple, Lead, Campaign


def calculate_lead_score(lead_data, couple_data):
    """Calculate lead score based on various factors"""
    score = 0
    
    # Wedding budget factor (higher budget = higher score)
    budget = couple_data.get('wedding_budget', 0)
    if budget >= 50000:
        score += 25
    elif budget >= 35000:
        score += 20
    elif budget >= 25000:
        score += 15
    else:
        score += 10
    
    # Timeline factor (sooner purchase = higher score)
    timeline = lead_data.get('timeline_to_purchase', '')
    if timeline == '3_months':
        score += 20
    elif timeline == '6_months':
        score += 15
    elif timeline == '12_months':
        score += 10
    else:
        score += 5
        
    # Credit score factor
    credit = lead_data.get('credit_score_range', '')
    if credit == 'excellent':
        score += 15
    elif credit == 'very_good':
        score += 12
    elif credit == 'good':
        score += 8
    else:
        score += 3
        
    # Income factor
    estimated_income = lead_data.get('estimated_income', 0)
    if estimated_income >= 150000:
        score += 15
    elif estimated_income >= 100000:
        score += 12
    elif estimated_income >= 75000:
        score += 8
    else:
        score += 3
        
    # Wedding stage factor (recently married = higher score)
    stage = couple_data.get('wedding_stage', '')
    if stage == 'recently_married':
        score += 15
    elif stage == 'planning':
        score += 10
    else:
        score += 5
    
    return min(score, 100)  # Cap at 100


def migrate_couples_and_leads():
    """Migrate couples and leads from JSON to database"""
    
    # Load existing JSON data
    couples_file = Path(__file__).parent / 'sample_couples.json'
    leads_file = Path(__file__).parent / 'sample_leads.json'
    
    if not couples_file.exists():
        print("sample_couples.json not found")
        return
        
    if not leads_file.exists():
        print("ERROR: sample_leads.json not found")
        return
    
    with open(couples_file, 'r') as f:
        couples_data = json.load(f)
        
    with open(leads_file, 'r') as f:
        leads_data = json.load(f)
    
    db = SessionLocal()
    
    try:
        # Check if data already exists
        if db.query(Couple).count() > 0:
            print("WARNING:  Database already contains couples data. Skipping migration.")
            print(f"   Found {db.query(Couple).count()} couples and {db.query(Lead).count()} leads")
            return
        
        print(f"Starting migration of Starting migration of {len(couples_data)} couples and {len(leads_data)} leads...")
        
        # Create couples-to-leads mapping
        leads_by_couple_id = {lead['couple_id']: lead for lead in leads_data}
        
        # Migrate couples
        couples_created = 0
        leads_created = 0
        
        for couple_data in couples_data:
            # Create couple
            couple = Couple(
                id=couple_data['id'],
                partner_1_name=couple_data['partner_1_name'],
                partner_2_name=couple_data['partner_2_name'],
                partner_1_email=couple_data['partner_1_email'],
                partner_2_email=couple_data['partner_2_email'],
                engagement_date=couple_data['engagement_date'],
                wedding_date=couple_data['wedding_date'],
                wedding_stage=couple_data['wedding_stage'],
                wedding_venue=couple_data.get('wedding_venue', ''),
                wedding_city=couple_data['wedding_city'],
                wedding_state=couple_data['wedding_state'],
                wedding_budget=couple_data['wedding_budget'],
                guest_count=couple_data.get('guest_count', 100),
                source_platform=couple_data.get('source_platform', ''),
                source_url=couple_data.get('source_url', ''),
                registry_urls=json.dumps(couple_data.get('registry_urls', [])),
                created_at=datetime.fromisoformat(couple_data.get('created_at', datetime.now().isoformat()).replace('Z', '+00:00'))
            )
            
            db.add(couple)
            couples_created += 1
            
            # Create corresponding lead if exists
            if couple_data['id'] in leads_by_couple_id:
                lead_data = leads_by_couple_id[couple_data['id']]
                
                lead_score = calculate_lead_score(lead_data, couple_data)
                
                lead = Lead(
                    id=lead_data['id'],
                    couple_id=lead_data['couple_id'],
                    target_purchase_price=lead_data['target_purchase_price'],
                    target_down_payment=lead_data['target_down_payment'],
                    target_location=lead_data['target_location'],
                    property_type_interest=lead_data.get('property_type_interest', 'single_family'),
                    timeline_to_purchase=lead_data.get('timeline_to_purchase', '12_months'),
                    estimated_income=lead_data['estimated_income'],
                    current_rent=lead_data.get('current_rent', 0),
                    has_existing_mortgage=lead_data.get('has_existing_mortgage', False),
                    credit_score_range=lead_data.get('credit_score_range', 'good'),
                    debt_to_income_ratio=lead_data.get('debt_to_income_ratio', 0.3),
                    status=lead_data.get('status', 'new'),
                    lead_score=lead_score,
                    created_at=datetime.fromisoformat(lead_data.get('created_at', datetime.now().isoformat()).replace('Z', '+00:00')),
                    updated_at=datetime.fromisoformat(lead_data.get('updated_at', datetime.now().isoformat()).replace('Z', '+00:00'))
                )
                
                db.add(lead)
                leads_created += 1
        
        # Create some sample campaigns
        sample_campaigns = [
            Campaign(
                name="First-Time Homebuyer Email Series",
                type="email",
                status="active",
                target_criteria=json.dumps({
                    "wedding_stage": ["recently_married"],
                    "estimated_income_min": 50000,
                    "timeline_to_purchase": ["3_months", "6_months"]
                }),
                content_template="Welcome to homeownership! Let us help you find your dream home...",
                total_sends=156,
                total_opens=89,
                total_clicks=23,
                total_responses=12,
                budget=2500.00,
                spend=1847.32,
                start_date=datetime.now()
            ),
            Campaign(
                name="High-Value Wedding Lead Outreach",
                type="direct_mail",
                status="active",
                target_criteria=json.dumps({
                    "wedding_budget_min": 40000,
                    "target_purchase_price_min": 500000
                }),
                content_template="Congratulations on your wedding! Ready for your next milestone?",
                total_sends=78,
                total_opens=45,
                total_clicks=18,
                total_responses=8,
                budget=1500.00,
                spend=1203.45,
                start_date=datetime.now()
            ),
            Campaign(
                name="Social Media Engagement Campaign",
                type="social",
                status="paused",
                target_criteria=json.dumps({
                    "age_range": "25-35",
                    "location": ["CA", "TX", "NY"]
                }),
                content_template="Just got married? Time to think about your forever home!",
                total_sends=2340,
                total_opens=834,
                total_clicks=156,
                total_responses=42,
                budget=3000.00,
                spend=2567.89,
                start_date=datetime.now()
            )
        ]
        
        for campaign in sample_campaigns:
            db.add(campaign)
        
        # Commit all changes
        db.commit()
        
        print(f"SUCCESS: Migration completed successfully!")
        print(f"   • Created {couples_created} couples")
        print(f"   • Created {leads_created} leads")
        print(f"   • Created {len(sample_campaigns)} sample campaigns")
        print(f"   • Database file: wedding_registry.db")
        
    except Exception as e:
        print(f"ERROR: Migration failed: {e}")
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    # Initialize database
    init_database()
    
    # Migrate data
    migrate_couples_and_leads()
    
    print("COMPLETE: Database setup complete!")