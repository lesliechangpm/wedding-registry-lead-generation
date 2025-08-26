"""
Legitimate data sources for wedding lead generation.
This module demonstrates ethical ways to obtain wedding data.
"""

from typing import List, Dict, Optional
import random
from datetime import datetime, date, timedelta
from dataclasses import dataclass


@dataclass
class LegitimateDataSource:
    name: str
    type: str  # 'partnership', 'public_records', 'opt_in', 'referral'
    description: str
    compliance_notes: str
    data_quality: str  # 'high', 'medium', 'low'
    cost_structure: str


class LegitimateWeddingDataSources:
    """
    Documentation of legitimate ways mortgage companies obtain wedding lead data.
    """
    
    @staticmethod
    def get_legitimate_sources() -> List[LegitimateDataSource]:
        """Return list of legitimate data sources used by real businesses."""
        return [
            LegitimateDataSource(
                name="County Marriage License Records",
                type="public_records",
                description="Public marriage license filings from county clerks",
                compliance_notes="Public records, but must respect privacy laws and waiting periods",
                data_quality="high",
                cost_structure="$50-200/month per county"
            ),
            LegitimateDataSource(
                name="Wedding Vendor Partnerships", 
                type="partnership",
                description="Partnerships with venues, photographers, planners who refer clients",
                compliance_notes="Requires explicit consent from couples and vendors",
                data_quality="high",
                cost_structure="Revenue sharing or referral fees"
            ),
            LegitimateDataSource(
                name="Opt-in Lead Generation",
                type="opt_in", 
                description="Couples who specifically request mortgage information",
                compliance_notes="Requires clear opt-in consent and easy opt-out",
                data_quality="high",
                cost_structure="$25-75 per qualified lead"
            ),
            LegitimateDataSource(
                name="Social Media Advertising",
                type="opt_in",
                description="Facebook/Instagram ads targeting engaged couples",
                compliance_notes="Must comply with platform policies and privacy laws",
                data_quality="medium",
                cost_structure="$5-15 per click, $50-150 per lead"
            ),
            LegitimateDataSource(
                name="Customer Referral Program",
                type="referral",
                description="Existing clients refer newly engaged friends/family",
                compliance_notes="Requires permission from both referrer and referee",
                data_quality="high", 
                cost_structure="$100-500 referral bonus"
            ),
            LegitimateDataSource(
                name="Wedding Industry Publications",
                type="partnership",
                description="Advertising in wedding magazines, websites with lead forms",
                compliance_notes="Couples voluntarily submit information",
                data_quality="medium",
                cost_structure="$1,000-5,000/month advertising"
            )
        ]
    
    @staticmethod
    def get_data_compliance_guidelines() -> Dict[str, List[str]]:
        """Return compliance guidelines for wedding lead data."""
        return {
            "data_collection": [
                "Always obtain explicit consent before collecting personal data",
                "Clearly state how data will be used in privacy policies", 
                "Provide easy opt-out mechanisms on all communications",
                "Respect do-not-call registries and CAN-SPAM requirements"
            ],
            "timing_requirements": [
                "Wait 60-90 days after wedding before initial contact",
                "Respect state and federal cooling-off periods", 
                "Honor couple's communication preferences and timing",
                "Limit contact frequency to avoid harassment"
            ],
            "data_security": [
                "Encrypt all personal data in transit and at rest",
                "Implement role-based access controls",
                "Maintain detailed audit logs of all data access",
                "Regular security assessments and vulnerability testing"
            ],
            "record_keeping": [
                "Document consent for all leads",
                "Track all communications and responses",
                "Maintain opt-out lists indefinitely", 
                "Keep compliance documentation for 3+ years"
            ]
        }


class RealisticWeddingDataGenerator:
    """
    Generates realistic sample wedding data that mimics real wedding registries
    without violating anyone's privacy.
    """
    
    def __init__(self):
        self.first_names_female = [
            "Emma", "Sarah", "Jessica", "Ashley", "Emily", "Samantha", "Amanda", 
            "Jennifer", "Rachel", "Lauren", "Hannah", "Megan", "Nicole", "Stephanie",
            "Elizabeth", "Katherine", "Michelle", "Danielle", "Rebecca", "Lisa"
        ]
        
        self.first_names_male = [
            "Michael", "David", "James", "John", "Robert", "Christopher", "Daniel",
            "Matthew", "Anthony", "Mark", "Andrew", "Joshua", "Kenneth", "Paul",
            "Steven", "Kevin", "Brian", "George", "Edward", "Ronald"
        ]
        
        self.last_names = [
            "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", 
            "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson",
            "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin", "Lee",
            "Thompson", "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis"
        ]
        
        self.cities_states = [
            ("San Francisco", "CA"), ("Los Angeles", "CA"), ("San Diego", "CA"),
            ("Austin", "TX"), ("Dallas", "TX"), ("Houston", "TX"),
            ("Seattle", "WA"), ("Portland", "OR"), ("Denver", "CO"),
            ("Chicago", "IL"), ("Atlanta", "GA"), ("Miami", "FL"),
            ("New York", "NY"), ("Boston", "MA"), ("Philadelphia", "PA"),
            ("Phoenix", "AZ"), ("Las Vegas", "NV"), ("Nashville", "TN")
        ]
        
        self.venues = [
            "The Grand Ballroom", "Sunset Manor", "Garden View Estate",
            "Riverside Country Club", "Historic Downtown Hotel", "Mountain View Lodge",
            "Oceanfront Resort", "City Rooftop Venue", "Vineyard Estate",
            "Heritage Museum", "Lakeside Pavilion", "Art Gallery Loft"
        ]
        
        self.wedding_platforms = ["the_knot", "zola", "weddingwire", "joy", "minted"]
    
    def generate_couple(self, couple_id: int) -> Dict:
        """Generate a realistic couple profile."""
        partner_1_name = random.choice(self.first_names_female)
        partner_2_name = random.choice(self.first_names_male)
        shared_last_name = random.choice(self.last_names)
        
        city, state = random.choice(self.cities_states)
        
        # Generate realistic wedding timeline
        engagement_months_ago = random.randint(2, 18)
        engagement_date = datetime.now() - timedelta(days=engagement_months_ago * 30)
        
        # Wedding date typically 6-18 months after engagement
        wedding_months_later = random.randint(6, 18)
        wedding_date = engagement_date + timedelta(days=wedding_months_later * 30)
        
        # Determine wedding stage
        if wedding_date > datetime.now():
            if (wedding_date - datetime.now()).days > 90:
                stage = "engaged"
            else:
                stage = "planning"
        else:
            stage = "recently_married"
        
        # Generate realistic budget based on location
        base_budget = 25000
        if state in ["CA", "NY", "MA", "CT", "NJ"]:
            base_budget = 45000
        elif state in ["TX", "FL", "IL", "WA"]:
            base_budget = 35000
        
        budget_variation = random.uniform(0.7, 1.5)
        wedding_budget = int(base_budget * budget_variation)
        
        return {
            "id": couple_id,
            "partner_1_name": partner_1_name,
            "partner_2_name": partner_2_name,
            "partner_1_email": f"{partner_1_name.lower()}.{shared_last_name.lower()}@email.com",
            "partner_2_email": f"{partner_2_name.lower()}.{shared_last_name.lower()}@email.com",
            "engagement_date": engagement_date.date().isoformat(),
            "wedding_date": wedding_date.date().isoformat(),
            "wedding_stage": stage,
            "wedding_venue": random.choice(self.venues),
            "wedding_city": city,
            "wedding_state": state,
            "wedding_budget": wedding_budget,
            "guest_count": random.randint(75, 200),
            "source_platform": random.choice(self.wedding_platforms),
            "source_url": f"https://{random.choice(self.wedding_platforms)}.com/wedding/{partner_1_name.lower()}-{partner_2_name.lower()}",
            "registry_urls": [
                f"https://registry.{random.choice(self.wedding_platforms)}.com/{partner_1_name.lower()}-{partner_2_name.lower()}"
            ],
            "created_at": (datetime.now() - timedelta(days=random.randint(1, 30))).isoformat()
        }
    
    def generate_lead_for_couple(self, couple: Dict, lead_id: int) -> Dict:
        """Generate a realistic lead profile for a couple."""
        
        # Estimate income based on wedding budget (rough correlation)
        budget_to_income_ratio = random.uniform(0.15, 0.35)  # Wedding budget is typically 15-35% of annual income
        estimated_income = int(couple["wedding_budget"] / budget_to_income_ratio)
        
        # Generate target purchase price (typically 2-4x annual income)
        income_multiplier = random.uniform(2.5, 4.0)
        target_price = int(estimated_income * income_multiplier)
        
        # Round to nearest 25k
        target_price = round(target_price / 25000) * 25000
        
        # Current rent (roughly 25-35% of monthly income)
        monthly_income = estimated_income / 12
        rent_ratio = random.uniform(0.25, 0.35)
        current_rent = int(monthly_income * rent_ratio)
        
        # Credit score range
        credit_ranges = ["excellent", "very_good", "good", "fair"]
        credit_weights = [0.3, 0.4, 0.25, 0.05]  # Most couples have good+ credit
        credit_score_range = random.choices(credit_ranges, weights=credit_weights)[0]
        
        return {
            "id": lead_id,
            "couple_id": couple["id"],
            "target_purchase_price": target_price,
            "target_down_payment": int(target_price * random.uniform(0.05, 0.20)),
            "target_location": f"{couple['wedding_city']}, {couple['wedding_state']}",
            "property_type_interest": random.choice(["single_family", "condo", "townhouse"]),
            "timeline_to_purchase": random.choice(["3_months", "6_months", "12_months", "18_months"]),
            "estimated_income": estimated_income,
            "current_rent": current_rent,
            "has_existing_mortgage": random.choice([True, False]),
            "credit_score_range": credit_score_range,
            "debt_to_income_ratio": random.uniform(0.15, 0.45),
            "status": random.choices(
                ["new", "contacted", "qualified", "nurturing", "converted"],
                weights=[0.3, 0.25, 0.2, 0.15, 0.1]
            )[0],
            "created_at": couple["created_at"],
            "updated_at": (datetime.now() - timedelta(days=random.randint(0, 15))).isoformat()
        }
    
    def generate_realistic_dataset(self, num_couples: int = 50) -> Dict:
        """Generate a complete realistic dataset."""
        couples = []
        leads = []
        
        for i in range(1, num_couples + 1):
            couple = self.generate_couple(i)
            couples.append(couple)
            
            # 70% of couples become leads
            if random.random() < 0.7:
                lead = self.generate_lead_for_couple(couple, len(leads) + 1)
                leads.append(lead)
        
        return {
            "couples": couples,
            "leads": leads,
            "generated_at": datetime.now().isoformat(),
            "source": "RealisticWeddingDataGenerator",
            "compliance_note": "This is synthetic data for demonstration purposes only"
        }


def demonstrate_legitimate_approach():
    """Demonstrate how real businesses ethically obtain wedding data."""
    sources = LegitimateWeddingDataSources()
    
    print("=== LEGITIMATE WEDDING DATA SOURCES ===\n")
    
    for source in sources.get_legitimate_sources():
        print(f"📊 {source.name}")
        print(f"   Type: {source.type}")
        print(f"   Description: {source.description}")
        print(f"   Compliance: {source.compliance_notes}")
        print(f"   Quality: {source.data_quality}")
        print(f"   Cost: {source.cost_structure}")
        print()
    
    print("\n=== COMPLIANCE REQUIREMENTS ===\n")
    guidelines = sources.get_data_compliance_guidelines()
    
    for category, rules in guidelines.items():
        print(f"🔒 {category.replace('_', ' ').title()}:")
        for rule in rules:
            print(f"   • {rule}")
        print()


if __name__ == "__main__":
    demonstrate_legitimate_approach()