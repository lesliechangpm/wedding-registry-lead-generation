"""
Database models for Wedding Registry Lead Generation Platform
"""

from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, Text, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from datetime import datetime

Base = declarative_base()


class Couple(Base):
    __tablename__ = "couples"
    
    id = Column(Integer, primary_key=True, index=True)
    partner_1_name = Column(String(100), nullable=False)
    partner_2_name = Column(String(100), nullable=False)
    partner_1_email = Column(String(255), nullable=False)
    partner_2_email = Column(String(255), nullable=False)
    engagement_date = Column(String(20), nullable=False)
    wedding_date = Column(String(20), nullable=False)
    wedding_stage = Column(String(50), nullable=False)  # engaged, planning, recently_married
    wedding_venue = Column(String(200))
    wedding_city = Column(String(100), nullable=False)
    wedding_state = Column(String(10), nullable=False)
    wedding_budget = Column(Integer, nullable=False)
    guest_count = Column(Integer)
    source_platform = Column(String(50))  # the_knot, zola, etc.
    source_url = Column(String(500))
    registry_urls = Column(Text)  # JSON string of URLs
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    # Relationship
    leads = relationship("Lead", back_populates="couple")


class Lead(Base):
    __tablename__ = "leads"
    
    id = Column(Integer, primary_key=True, index=True)
    couple_id = Column(Integer, ForeignKey("couples.id"), nullable=False)
    target_purchase_price = Column(Integer, nullable=False)
    target_down_payment = Column(Integer, nullable=False)
    target_location = Column(String(200), nullable=False)
    property_type_interest = Column(String(50))  # single_family, condo, townhouse
    timeline_to_purchase = Column(String(20))  # 3_months, 6_months, etc.
    estimated_income = Column(Integer, nullable=False)
    current_rent = Column(Integer)
    has_existing_mortgage = Column(Boolean, default=False)
    credit_score_range = Column(String(20))  # excellent, very_good, good, fair
    debt_to_income_ratio = Column(Float)
    status = Column(String(20), default="new")  # new, contacted, qualified, nurturing, converted
    lead_score = Column(Integer, default=0)  # Calculated lead score
    assigned_loan_officer_id = Column(Integer, ForeignKey("loan_officers.id"), nullable=True)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    # Relationships
    couple = relationship("Couple", back_populates="leads")
    loan_officer = relationship("LoanOfficer", back_populates="leads")
    activities = relationship("LeadActivity", back_populates="lead")


class LoanOfficer(Base):
    __tablename__ = "loan_officers"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(255), nullable=False)
    phone = Column(String(20))
    specialty = Column(String(100))  # first_time_buyers, luxury_homes, etc.
    active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=func.now())
    
    # Relationship
    leads = relationship("Lead", back_populates="loan_officer")


class LeadActivity(Base):
    __tablename__ = "lead_activities"
    
    id = Column(Integer, primary_key=True, index=True)
    lead_id = Column(Integer, ForeignKey("leads.id"), nullable=False)
    activity_type = Column(String(50), nullable=False)  # email, call, meeting, note
    description = Column(Text)
    outcome = Column(String(100))
    created_at = Column(DateTime, default=func.now())
    created_by = Column(String(100))  # loan officer name or system
    
    # Relationship
    lead = relationship("Lead", back_populates="activities")


class Campaign(Base):
    __tablename__ = "campaigns"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    type = Column(String(50), nullable=False)  # email, social, direct_mail
    status = Column(String(20), default="draft")  # draft, active, paused, completed
    target_criteria = Column(Text)  # JSON string of targeting criteria
    content_template = Column(Text)
    total_sends = Column(Integer, default=0)
    total_opens = Column(Integer, default=0)
    total_clicks = Column(Integer, default=0)
    total_responses = Column(Integer, default=0)
    budget = Column(Float, default=0.0)
    spend = Column(Float, default=0.0)
    start_date = Column(DateTime)
    end_date = Column(DateTime)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())


class Setting(Base):
    __tablename__ = "settings"
    
    id = Column(Integer, primary_key=True, index=True)
    key = Column(String(100), unique=True, nullable=False)
    value = Column(Text)
    description = Column(String(500))
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())