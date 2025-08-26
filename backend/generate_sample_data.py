"""
Generate realistic wedding registry data for demonstration purposes.
This creates synthetic data that looks like real wedding data without violating privacy.
"""

import json
import sys
import os

# Add the current directory to Python path
sys.path.append(os.path.dirname(__file__))

from services.data_sources import RealisticWeddingDataGenerator
# from services.lead_scoring import LeadScoringService


def generate_and_save_data():
    """Generate realistic wedding data and save to JSON files."""
    
    print("Generating realistic wedding registry data...")
    
    # Generate realistic dataset
    generator = RealisticWeddingDataGenerator()
    dataset = generator.generate_realistic_dataset(num_couples=100)
    
    print(f"Generated {len(dataset['couples'])} couples and {len(dataset['leads'])} leads")
    
    # Calculate lead scores for each lead
    print("Calculating lead scores...")
    
    # Create a simple scoring implementation for our sample data
    for lead in dataset['leads']:
        couple = next(c for c in dataset['couples'] if c['id'] == lead['couple_id'])
        
        score = 0.0
        
        # Wedding budget scoring (25 points max)
        budget = couple.get('wedding_budget', 0)
        if budget >= 50000:
            score += 25.0
        elif budget >= 30000:
            score += 20.0
        elif budget >= 20000:
            score += 15.0
        elif budget >= 10000:
            score += 10.0
        else:
            score += 5.0
        
        # Timeline scoring (20 points max) 
        stage = couple.get('wedding_stage', '')
        stage_scores = {
            "engaged": 20.0,
            "planning": 15.0, 
            "recently_married": 10.0
        }
        score += stage_scores.get(stage, 10.0)
        
        # Income scoring (25 points max)
        income = lead.get('estimated_income', 0)
        if income >= 100000:
            score += 25.0
        elif income >= 75000:
            score += 20.0
        elif income >= 50000:
            score += 15.0
        else:
            score += 10.0
        
        # Location scoring (15 points max) - high value markets
        state = couple.get('wedding_state', '')
        high_value_states = ['CA', 'NY', 'MA', 'CT', 'NJ', 'WA', 'DC', 'MD', 'VA']
        if state in high_value_states:
            score += 15.0
        else:
            score += 8.0
        
        # Credit score bonus (15 points max)
        credit = lead.get('credit_score_range', '')
        credit_scores = {
            'excellent': 15.0,
            'very_good': 12.0,
            'good': 8.0,
            'fair': 4.0
        }
        score += credit_scores.get(credit, 4.0)
        
        # Clamp to 0-100 range
        lead['lead_score'] = min(100.0, max(0.0, score))
        lead['qualification_score'] = lead['lead_score'] * 0.85  # Slightly lower qualification score
    
    # Save the data
    with open('sample_couples.json', 'w') as f:
        json.dump(dataset['couples'], f, indent=2)
    
    with open('sample_leads.json', 'w') as f:
        json.dump(dataset['leads'], f, indent=2)
    
    # Generate summary statistics
    lead_scores = [lead['lead_score'] for lead in dataset['leads']]
    avg_score = sum(lead_scores) / len(lead_scores) if lead_scores else 0
    
    high_score_leads = [l for l in dataset['leads'] if l['lead_score'] >= 80]
    qualified_leads = [l for l in dataset['leads'] if l['status'] in ['qualified', 'converted']]
    
    print(f"\nDATA SUMMARY:")
    print(f"   Average Lead Score: {avg_score:.1f}")
    print(f"   High Score Leads (80+): {len(high_score_leads)}")
    print(f"   Qualified/Converted: {len(qualified_leads)}")
    print(f"   Top States: {', '.join(list(set([c['wedding_state'] for c in dataset['couples']])))}")
    
    # Show some sample records
    print(f"\nSAMPLE COUPLES:")
    for couple in dataset['couples'][:3]:
        print(f"   {couple['partner_1_name']} & {couple['partner_2_name']}")
        print(f"   Wedding: {couple['wedding_date']} in {couple['wedding_city']}, {couple['wedding_state']}")
        print(f"   Budget: ${couple['wedding_budget']:,} | Stage: {couple['wedding_stage']}")
        print()
    
    print(f"\nSAMPLE LEADS:")
    for lead in dataset['leads'][:3]:
        couple = next(c for c in dataset['couples'] if c['id'] == lead['couple_id'])
        print(f"   Lead #{lead['id']} | Score: {lead['lead_score']:.1f} | Status: {lead['status']}")
        print(f"   Target: ${lead['target_purchase_price']:,} in {lead['target_location']}")
        print(f"   Income: ${lead['estimated_income']:,} | Credit: {lead['credit_score_range']}")
        print()
    
    print("Realistic sample data generated successfully!")
    print("Files saved: sample_couples.json, sample_leads.json")
    
    return dataset


if __name__ == "__main__":
    generate_and_save_data()