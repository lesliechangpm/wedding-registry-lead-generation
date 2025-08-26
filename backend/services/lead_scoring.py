from typing import Dict, Any, Optional
from sqlalchemy.orm import Session
from datetime import datetime, date
import re

from models.database import Lead, Couple, LeadScoringRule


class LeadScoringService:
    """Service for calculating lead scores based on various factors."""
    
    def __init__(self, db: Session):
        self.db = db
    
    def calculate_lead_score(self, lead: Lead, couple: Couple) -> float:
        """Calculate comprehensive lead score for a couple/lead."""
        score = 0.0
        
        # Wedding budget scoring (25 points max)
        score += self._score_wedding_budget(couple.wedding_budget)
        
        # Timeline scoring (20 points max)
        score += self._score_timeline(couple.wedding_date, couple.wedding_stage)
        
        # Financial profile scoring (25 points max)
        score += self._score_financial_profile(lead)
        
        # Geographic scoring (15 points max)
        score += self._score_geographic_factors(couple)
        
        # Engagement level scoring (15 points max)
        score += self._score_engagement_level(couple)
        
        # Apply custom scoring rules
        score += self._apply_custom_rules(lead, couple)
        
        return min(100.0, max(0.0, score))  # Clamp between 0-100
    
    def _score_wedding_budget(self, budget: Optional[float]) -> float:
        """Score based on wedding budget as indicator of financial capacity."""
        if not budget:
            return 5.0  # Neutral score for missing data
        
        if budget >= 50000:
            return 25.0  # High budget = high potential
        elif budget >= 30000:
            return 20.0
        elif budget >= 20000:
            return 15.0
        elif budget >= 10000:
            return 10.0
        else:
            return 5.0
    
    def _score_timeline(self, wedding_date: Optional[date], stage: str) -> float:
        """Score based on wedding timeline and stage."""
        score = 0.0
        
        # Stage-based scoring
        stage_scores = {
            "engaged": 20.0,      # Best time to reach out
            "planning": 15.0,     # Still good timing
            "recently_married": 10.0  # Post-wedding opportunity
        }
        score += stage_scores.get(stage, 10.0)
        
        # Timeline-based scoring
        if wedding_date:
            today = date.today()
            days_until_wedding = (wedding_date - today).days
            
            if days_until_wedding < 0:  # Already married
                days_since_wedding = abs(days_until_wedding)
                if days_since_wedding <= 90:  # Recently married
                    score += 5.0
                elif days_since_wedding <= 180:
                    score += 3.0
            else:  # Future wedding
                if 60 <= days_until_wedding <= 365:  # Sweet spot
                    score += 10.0
                elif days_until_wedding <= 60:
                    score += 7.0
                elif days_until_wedding <= 730:  # Up to 2 years
                    score += 5.0
        
        return min(20.0, score)
    
    def _score_financial_profile(self, lead: Lead) -> float:
        """Score based on financial indicators."""
        score = 0.0
        
        # Income scoring
        if lead.estimated_income:
            if lead.estimated_income >= 100000:
                score += 10.0
            elif lead.estimated_income >= 75000:
                score += 8.0
            elif lead.estimated_income >= 50000:
                score += 6.0
            else:
                score += 3.0
        
        # Current rent vs. potential mortgage
        if lead.current_rent and lead.target_purchase_price:
            potential_monthly_payment = lead.target_purchase_price * 0.005  # Rough estimate
            if lead.current_rent >= potential_monthly_payment * 0.8:
                score += 8.0  # They can likely afford it
            elif lead.current_rent >= potential_monthly_payment * 0.6:
                score += 5.0
        
        # Credit score range
        credit_scores = {
            "excellent": 7.0,  # 750+
            "very_good": 6.0,  # 700-749
            "good": 5.0,       # 650-699
            "fair": 3.0,       # 600-649
            "poor": 1.0        # <600
        }
        if lead.credit_score_range:
            score += credit_scores.get(lead.credit_score_range.lower(), 3.0)
        
        return min(25.0, score)
    
    def _score_geographic_factors(self, couple: Couple) -> float:
        """Score based on location and market factors."""
        score = 0.0
        
        # High-value markets (could be configurable)
        high_value_states = [
            'CA', 'NY', 'MA', 'CT', 'NJ', 'WA', 'DC', 'MD', 'VA'
        ]
        
        high_value_cities = [
            'san francisco', 'new york', 'boston', 'seattle', 'los angeles',
            'washington', 'chicago', 'austin', 'denver', 'atlanta'
        ]
        
        if couple.wedding_state in high_value_states:
            score += 8.0
        
        if couple.wedding_city and any(
            city in couple.wedding_city.lower() 
            for city in high_value_cities
        ):
            score += 7.0
        
        return min(15.0, score)
    
    def _score_engagement_level(self, couple: Couple) -> float:
        """Score based on engagement level and data completeness."""
        score = 0.0
        
        # Data completeness indicates engagement
        data_points = [
            couple.partner_1_email,
            couple.partner_2_email,
            couple.wedding_date,
            couple.wedding_venue,
            couple.wedding_budget,
            couple.guest_count
        ]
        
        completeness = sum(1 for point in data_points if point is not None) / len(data_points)
        score += completeness * 10.0  # Up to 10 points for complete data
        
        # Registry presence indicates serious planning
        if couple.registry_urls and len(couple.registry_urls) > 0:
            score += 5.0
        
        return min(15.0, score)
    
    def _apply_custom_rules(self, lead: Lead, couple: Couple) -> float:
        """Apply custom scoring rules defined by users."""
        score = 0.0
        
        # Get active scoring rules
        rules = self.db.query(LeadScoringRule).filter(
            LeadScoringRule.is_active == True
        ).all()
        
        for rule in rules:
            if self._evaluate_rule(rule, lead, couple):
                score += rule.points
        
        return score
    
    def _evaluate_rule(self, rule: LeadScoringRule, lead: Lead, couple: Couple) -> bool:
        """Evaluate a single scoring rule against lead/couple data."""
        try:
            # Get the field value
            if hasattr(lead, rule.field_name):
                field_value = getattr(lead, rule.field_name)
            elif hasattr(couple, rule.field_name):
                field_value = getattr(couple, rule.field_name)
            else:
                return False
            
            if field_value is None:
                return False
            
            # Apply the operator
            rule_value = rule.value
            
            if rule.operator == 'gt':
                return float(field_value) > float(rule_value)
            elif rule.operator == 'lt':
                return float(field_value) < float(rule_value)
            elif rule.operator == 'eq':
                return str(field_value).lower() == str(rule_value).lower()
            elif rule.operator == 'in':
                values = [v.strip().lower() for v in rule_value.split(',')]
                return str(field_value).lower() in values
            elif rule.operator == 'contains':
                return str(rule_value).lower() in str(field_value).lower()
            
        except (ValueError, AttributeError):
            return False
        
        return False
    
    def get_scoring_explanation(self, lead: Lead, couple: Couple) -> Dict[str, Any]:
        """Get detailed breakdown of how the lead score was calculated."""
        explanation = {
            "total_score": 0.0,
            "breakdown": {}
        }
        
        # Calculate each component
        budget_score = self._score_wedding_budget(couple.wedding_budget)
        timeline_score = self._score_timeline(couple.wedding_date, couple.wedding_stage)
        financial_score = self._score_financial_profile(lead)
        geographic_score = self._score_geographic_factors(couple)
        engagement_score = self._score_engagement_level(couple)
        custom_score = self._apply_custom_rules(lead, couple)
        
        explanation["breakdown"] = {
            "wedding_budget": {
                "score": budget_score,
                "max_possible": 25.0,
                "description": f"Based on wedding budget of ${couple.wedding_budget or 0:,.0f}"
            },
            "timeline": {
                "score": timeline_score,
                "max_possible": 20.0,
                "description": f"Based on wedding stage ({couple.wedding_stage}) and date"
            },
            "financial_profile": {
                "score": financial_score,
                "max_possible": 25.0,
                "description": "Based on income, rent, and credit score indicators"
            },
            "geographic": {
                "score": geographic_score,
                "max_possible": 15.0,
                "description": f"Based on location: {couple.wedding_city}, {couple.wedding_state}"
            },
            "engagement": {
                "score": engagement_score,
                "max_possible": 15.0,
                "description": "Based on data completeness and registry presence"
            },
            "custom_rules": {
                "score": custom_score,
                "max_possible": "Variable",
                "description": "Based on custom scoring rules"
            }
        }
        
        total = budget_score + timeline_score + financial_score + geographic_score + engagement_score + custom_score
        explanation["total_score"] = min(100.0, max(0.0, total))
        
        return explanation