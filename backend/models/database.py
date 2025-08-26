from datetime import datetime, date
from enum import Enum
from typing import Optional, List
from sqlalchemy import (
    Column, Integer, String, DateTime, Date, Boolean, 
    Float, Text, ForeignKey, Enum as SQLEnum, JSON
)
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, Session
from sqlalchemy.sql import func

Base = declarative_base()


class LeadStatus(str, Enum):
    NEW = "new"
    CONTACTED = "contacted"
    QUALIFIED = "qualified"
    NURTURING = "nurturing"
    CONVERTED = "converted"
    CLOSED_WON = "closed_won"
    CLOSED_LOST = "closed_lost"
    OPT_OUT = "opt_out"


class CampaignStatus(str, Enum):
    DRAFT = "draft"
    ACTIVE = "active"
    PAUSED = "paused"
    COMPLETED = "completed"


class WeddingStage(str, Enum):
    ENGAGED = "engaged"
    PLANNING = "planning"
    RECENTLY_MARRIED = "recently_married"


class Couple(Base):
    __tablename__ = "couples"
    
    id = Column(Integer, primary_key=True, index=True)
    partner_1_name = Column(String(100), nullable=False)
    partner_1_email = Column(String(255), index=True)
    partner_1_phone = Column(String(20))
    partner_2_name = Column(String(100), nullable=False)
    partner_2_email = Column(String(255), index=True)
    partner_2_phone = Column(String(20))
    
    # Wedding details
    wedding_date = Column(Date)
    engagement_date = Column(Date)
    wedding_stage = Column(SQLEnum(WeddingStage), default=WeddingStage.ENGAGED)
    wedding_venue = Column(String(255))
    wedding_city = Column(String(100))
    wedding_state = Column(String(50))
    wedding_budget = Column(Float)
    guest_count = Column(Integer)
    
    # Contact preferences
    preferred_contact_method = Column(String(20), default="email")
    opted_out = Column(Boolean, default=False)
    opt_out_date = Column(DateTime)
    
    # Source tracking
    source_platform = Column(String(50))  # 'the_knot', 'zola', 'weddingwire', etc.
    source_url = Column(String(500))
    registry_urls = Column(JSON)  # List of registry URLs
    
    # Metadata
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    # Relationships
    leads = relationship("Lead", back_populates="couple")
    interactions = relationship("Interaction", back_populates="couple")


class Lead(Base):
    __tablename__ = "leads"
    
    id = Column(Integer, primary_key=True, index=True)
    couple_id = Column(Integer, ForeignKey("couples.id"), nullable=False)
    
    # Lead scoring
    lead_score = Column(Float, default=0.0)
    qualification_score = Column(Float, default=0.0)
    
    # Status tracking
    status = Column(SQLEnum(LeadStatus), default=LeadStatus.NEW)
    assigned_loan_officer_id = Column(Integer, ForeignKey("loan_officers.id"))
    
    # Property interests
    target_purchase_price = Column(Float)
    target_down_payment = Column(Float)
    target_location = Column(String(100))
    property_type_interest = Column(String(50))
    timeline_to_purchase = Column(String(50))
    
    # Financial profile
    estimated_income = Column(Float)
    current_rent = Column(Float)
    has_existing_mortgage = Column(Boolean, default=False)
    credit_score_range = Column(String(20))
    debt_to_income_ratio = Column(Float)
    
    # Contact timing
    earliest_contact_date = Column(DateTime)  # Compliance waiting period
    last_contact_date = Column(DateTime)
    next_follow_up_date = Column(DateTime)
    
    # Metadata
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    # Relationships
    couple = relationship("Couple", back_populates="leads")
    loan_officer = relationship("LoanOfficer", back_populates="leads")
    interactions = relationship("Interaction", back_populates="lead")
    campaign_sends = relationship("CampaignSend", back_populates="lead")


class LoanOfficer(Base):
    __tablename__ = "loan_officers"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    phone = Column(String(20))
    license_number = Column(String(50))
    
    # Territory
    service_areas = Column(JSON)  # List of cities/states they serve
    specializations = Column(JSON)  # List of loan types they specialize in
    
    # Performance metrics
    total_leads_assigned = Column(Integer, default=0)
    total_loans_closed = Column(Integer, default=0)
    conversion_rate = Column(Float, default=0.0)
    average_loan_amount = Column(Float, default=0.0)
    
    # Settings
    max_leads_per_day = Column(Integer, default=10)
    auto_assign_leads = Column(Boolean, default=True)
    
    # Metadata
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    # Relationships
    leads = relationship("Lead", back_populates="loan_officer")
    interactions = relationship("Interaction", back_populates="loan_officer")


class Campaign(Base):
    __tablename__ = "campaigns"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    description = Column(Text)
    campaign_type = Column(String(50))  # 'email', 'sms', 'direct_mail'
    
    # Targeting criteria
    target_wedding_stages = Column(JSON)  # List of wedding stages to target
    target_locations = Column(JSON)  # List of cities/states to target
    min_budget = Column(Float)
    max_budget = Column(Float)
    min_lead_score = Column(Float)
    
    # Campaign content
    subject_line = Column(String(200))
    email_template = Column(Text)
    sms_template = Column(String(160))
    
    # Scheduling
    status = Column(SQLEnum(CampaignStatus), default=CampaignStatus.DRAFT)
    scheduled_send_date = Column(DateTime)
    send_time_preference = Column(String(20))  # 'morning', 'afternoon', 'evening'
    
    # Performance tracking
    total_sends = Column(Integer, default=0)
    total_opens = Column(Integer, default=0)
    total_clicks = Column(Integer, default=0)
    total_responses = Column(Integer, default=0)
    total_conversions = Column(Integer, default=0)
    
    # Metadata
    created_by_officer_id = Column(Integer, ForeignKey("loan_officers.id"))
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    # Relationships
    sends = relationship("CampaignSend", back_populates="campaign")


class CampaignSend(Base):
    __tablename__ = "campaign_sends"
    
    id = Column(Integer, primary_key=True, index=True)
    campaign_id = Column(Integer, ForeignKey("campaigns.id"), nullable=False)
    lead_id = Column(Integer, ForeignKey("leads.id"), nullable=False)
    
    # Delivery tracking
    sent_at = Column(DateTime)
    delivered_at = Column(DateTime)
    opened_at = Column(DateTime)
    clicked_at = Column(DateTime)
    responded_at = Column(DateTime)
    
    # Status
    send_status = Column(String(20), default="pending")  # pending, sent, delivered, failed
    bounce_reason = Column(String(200))
    unsubscribed = Column(Boolean, default=False)
    
    # Metadata
    created_at = Column(DateTime, default=func.now())
    
    # Relationships
    campaign = relationship("Campaign", back_populates="sends")
    lead = relationship("Lead", back_populates="campaign_sends")


class Interaction(Base):
    __tablename__ = "interactions"
    
    id = Column(Integer, primary_key=True, index=True)
    couple_id = Column(Integer, ForeignKey("couples.id"), nullable=False)
    lead_id = Column(Integer, ForeignKey("leads.id"))
    loan_officer_id = Column(Integer, ForeignKey("loan_officers.id"))
    
    # Interaction details
    interaction_type = Column(String(50))  # 'call', 'email', 'meeting', 'application'
    channel = Column(String(50))  # 'phone', 'email', 'in_person', 'video'
    direction = Column(String(20))  # 'inbound', 'outbound'
    
    # Content
    subject = Column(String(200))
    notes = Column(Text)
    outcome = Column(String(100))
    
    # Follow-up
    follow_up_required = Column(Boolean, default=False)
    follow_up_date = Column(DateTime)
    
    # Metadata
    interaction_date = Column(DateTime, default=func.now())
    created_at = Column(DateTime, default=func.now())
    
    # Relationships
    couple = relationship("Couple", back_populates="interactions")
    lead = relationship("Lead", back_populates="interactions")
    loan_officer = relationship("LoanOfficer", back_populates="interactions")


class LeadScoringRule(Base):
    __tablename__ = "lead_scoring_rules"
    
    id = Column(Integer, primary_key=True, index=True)
    rule_name = Column(String(100), nullable=False)
    rule_type = Column(String(50))  # 'budget', 'timeline', 'location', 'demographics'
    
    # Scoring logic
    field_name = Column(String(50))
    operator = Column(String(20))  # 'gt', 'lt', 'eq', 'in', 'contains'
    value = Column(String(200))
    points = Column(Float, nullable=False)
    
    # Status
    is_active = Column(Boolean, default=True)
    
    # Metadata
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())