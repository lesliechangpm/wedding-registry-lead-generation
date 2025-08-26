"""
Legitimate ways to enhance wedding leads with professional information.
This demonstrates ethical approaches used by real mortgage companies.
"""

from typing import Dict, List, Optional
from dataclasses import dataclass


@dataclass
class ProfessionalDataSource:
    name: str
    method: str
    cost: str
    data_quality: str
    legal_status: str
    description: str


class LegitimateProDataEnhancement:
    """
    Ethical ways to enhance wedding leads with professional information.
    """
    
    @staticmethod
    def get_legitimate_sources() -> List[ProfessionalDataSource]:
        """Return legitimate sources for professional data enhancement."""
        return [
            ProfessionalDataSource(
                name="Spokeo/WhitePages Premium",
                method="Licensed data aggregation",
                cost="$0.50-$2.00 per lookup",
                data_quality="Medium-High",
                legal_status="Fully compliant",
                description="Licensed access to public records, employment history, income estimates"
            ),
            ProfessionalDataSource(
                name="Experian/Equifax Data Services", 
                method="Credit bureau data (with consent)",
                cost="$1-5 per authorized lookup",
                data_quality="High",
                legal_status="Regulated/compliant",
                description="Employment verification, income verification (requires consent)"
            ),
            ProfessionalDataSource(
                name="ZoomInfo/Apollo.io",
                method="B2B contact databases",
                cost="$50-200/month subscription",
                data_quality="High for professionals",
                legal_status="Compliant (opt-in based)",
                description="Professional titles, company info, business email addresses"
            ),
            ProfessionalDataSource(
                name="County Property Records",
                method="Public real estate records",
                cost="$0.10-1.00 per lookup",
                data_quality="High",
                legal_status="Public records",
                description="Current property ownership, mortgage history, property values"
            ),
            ProfessionalDataSource(
                name="Voter Registration Records",
                method="Public voting records",
                cost="$50-500 per county/state",
                data_quality="Medium",
                legal_status="Public records",
                description="Address history, age verification, household composition"
            ),
            ProfessionalDataSource(
                name="Professional License Lookups",
                method="State licensing boards",
                cost="Free-$25 per lookup",
                data_quality="High for licensed professions",
                legal_status="Public records", 
                description="Doctors, lawyers, real estate agents, contractors, etc."
            ),
            ProfessionalDataSource(
                name="Corporate SEC Filings",
                method="Executive compensation disclosures",
                cost="Free (public)",
                data_quality="High for executives",
                legal_status="Public records",
                description="C-level executive salaries at public companies"
            ),
            ProfessionalDataSource(
                name="Social Media APIs (Consented)",
                method="Official platform APIs with user consent",
                cost="Varies",
                data_quality="High",
                legal_status="Compliant with consent",
                description="User-authorized access to professional profiles"
            )
        ]
    
    @staticmethod
    def enhanced_lead_profile_example() -> Dict:
        """Show what an enhanced lead profile might look like with legitimate data."""
        return {
            # Original wedding data
            "couple_id": 81,
            "partner_1_name": "Elizabeth",
            "partner_2_name": "Mark", 
            "wedding_budget": 38254,
            "wedding_city": "Austin",
            "wedding_state": "TX",
            
            # Enhanced with legitimate data sources
            "professional_data": {
                "partner_1": {
                    "likely_title": "Senior Marketing Manager",
                    "likely_company_size": "500-1000 employees",
                    "likely_industry": "Technology",
                    "estimated_income_range": "$85K-$120K",
                    "data_source": "ZoomInfo professional lookup",
                    "confidence": "Medium"
                },
                "partner_2": {
                    "likely_title": "Software Engineer",
                    "likely_company_size": "1000+ employees", 
                    "likely_industry": "Technology",
                    "estimated_income_range": "$95K-$140K",
                    "data_source": "Austin tech salary data + professional license lookup",
                    "confidence": "Medium-High"
                },
                "household": {
                    "combined_estimated_income": "$180K-$260K",
                    "property_ownership": "Renter - high-end apartment",
                    "credit_profile": "Likely excellent based on wedding budget",
                    "buying_timeline": "6-12 months post-wedding typical"
                }
            },
            
            # Compliance tracking
            "data_compliance": {
                "consent_obtained": True,
                "sources_documented": True,
                "opt_out_available": True,
                "retention_period": "3 years",
                "last_updated": "2024-01-15"
            }
        }
    
    @staticmethod
    def create_professional_enhancement_workflow():
        """Demonstrate a compliant workflow for professional data enhancement."""
        return {
            "step_1_basic_qualification": {
                "description": "Initial lead qualification using wedding data only",
                "data_used": ["wedding_budget", "location", "timeline"],
                "purpose": "Determine if worth additional research investment"
            },
            
            "step_2_public_records": {
                "description": "Enhance with publicly available information", 
                "sources": ["property_records", "voter_registration", "professional_licenses"],
                "cost": "$1-5 per lead",
                "compliance": "Public records, no consent needed"
            },
            
            "step_3_licensed_data": {
                "description": "Professional data from licensed providers",
                "sources": ["Spokeo", "WhitePages", "ZoomInfo"],
                "cost": "$2-10 per lead", 
                "compliance": "Licensed data, terms of service compliant"
            },
            
            "step_4_consented_enhancement": {
                "description": "High-value data requiring explicit consent",
                "sources": ["LinkedIn Sales Navigator", "Credit reports", "Employment verification"],
                "cost": "$5-25 per lead",
                "compliance": "Requires explicit opt-in consent"
            },
            
            "step_5_manual_research": {
                "description": "Human research for high-value prospects",
                "methods": ["Company website lookup", "News article searches", "Professional association directories"],
                "cost": "$10-50 per lead",
                "compliance": "Public information research"
            }
        }


def demonstrate_professional_enhancement():
    """Show how real businesses enhance wedding leads professionally."""
    
    sources = LegitimateProDataEnhancement()
    
    print("=== LEGITIMATE PROFESSIONAL DATA SOURCES ===\n")
    
    for source in sources.get_legitimate_sources():
        print(f"📊 {source.name}")
        print(f"   Method: {source.method}")
        print(f"   Cost: {source.cost}")
        print(f"   Quality: {source.data_quality}")
        print(f"   Legal: {source.legal_status}")
        print(f"   Description: {source.description}")
        print()
    
    print("\n=== ENHANCED LEAD EXAMPLE ===\n")
    enhanced = sources.enhanced_lead_profile_example()
    
    print(f"Original Couple: {enhanced['partner_1_name']} & {enhanced['partner_2_name']}")
    print(f"Wedding Budget: ${enhanced['wedding_budget']:,}")
    print(f"Location: {enhanced['wedding_city']}, {enhanced['wedding_state']}")
    print()
    
    print("Professional Enhancement:")
    for partner, data in enhanced['professional_data'].items():
        if partner != 'household':
            print(f"  {partner.title()}:")
            for key, value in data.items():
                print(f"    {key.replace('_', ' ').title()}: {value}")
    
    print(f"\nHousehold Profile:")
    for key, value in enhanced['professional_data']['household'].items():
        print(f"  {key.replace('_', ' ').title()}: {value}")


if __name__ == "__main__":
    demonstrate_professional_enhancement()