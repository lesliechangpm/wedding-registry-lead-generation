from datetime import datetime, timedelta
from typing import List, Dict, Optional
from sqlalchemy.orm import Session
from sqlalchemy import and_

from models.database import (
    Couple, Lead, Campaign, CampaignSend, 
    LeadStatus, WeddingStage, LoanOfficer
)
from services.email_service import EmailService, EmailTemplateLibrary
from utils.database import get_db


class CampaignAutomationService:
    """Service for automated campaign management and lead nurturing."""
    
    def __init__(self, db: Session):
        self.db = db
        self.email_service = EmailService()
        self.template_library = EmailTemplateLibrary()
    
    def run_automated_campaigns(self) -> Dict[str, int]:
        """Run all automated campaigns and return summary stats."""
        results = {
            'engagement_emails_sent': 0,
            'post_wedding_emails_sent': 0,
            'nurture_emails_sent': 0,
            'follow_up_emails_sent': 0,
            'errors': 0
        }
        
        try:
            # Process engagement announcements
            results['engagement_emails_sent'] = self._process_engagement_campaigns()
            
            # Process post-wedding campaigns
            results['post_wedding_emails_sent'] = self._process_post_wedding_campaigns()
            
            # Process nurture campaigns
            results['nurture_emails_sent'] = self._process_nurture_campaigns()
            
            # Process follow-up campaigns
            results['follow_up_emails_sent'] = self._process_follow_up_campaigns()
            
        except Exception as e:
            print(f"Error in automated campaigns: {str(e)}")
            results['errors'] += 1
        
        return results
    
    def _process_engagement_campaigns(self) -> int:
        """Process engagement announcement campaigns."""
        # Find newly engaged couples who haven't been contacted
        eligible_couples = self.db.query(Couple).join(Lead).filter(
            and_(
                Couple.wedding_stage == WeddingStage.ENGAGED,
                Couple.opted_out == False,
                Lead.status == LeadStatus.NEW,
                Lead.earliest_contact_date <= datetime.now(),
                Lead.last_contact_date.is_(None)
            )
        ).all()
        
        sent_count = 0
        template = self.template_library.get_engagement_announcement_template()
        
        for couple in eligible_couples:
            lead = couple.leads[0] if couple.leads else None
            if not lead:
                continue
            
            # Get assigned loan officer
            loan_officer = self._get_loan_officer_for_lead(lead)
            if not loan_officer:
                continue
            
            # Send email
            if self._send_campaign_email(couple, lead, template, loan_officer, 'engagement'):
                sent_count += 1
                
                # Update lead status
                lead.status = LeadStatus.CONTACTED
                lead.last_contact_date = datetime.now()
                lead.next_follow_up_date = datetime.now() + timedelta(days=14)
        
        self.db.commit()
        return sent_count
    
    def _process_post_wedding_campaigns(self) -> int:
        """Process post-wedding campaigns."""
        # Find recently married couples ready for contact
        cutoff_date = datetime.now() - timedelta(days=60)  # 60 days post-wedding
        recent_wedding_date = datetime.now() - timedelta(days=180)  # Within last 6 months
        
        eligible_couples = self.db.query(Couple).join(Lead).filter(
            and_(
                Couple.wedding_stage == WeddingStage.RECENTLY_MARRIED,
                Couple.wedding_date >= recent_wedding_date.date(),
                Couple.wedding_date <= cutoff_date.date(),
                Couple.opted_out == False,
                Lead.status == LeadStatus.NEW,
                Lead.last_contact_date.is_(None)
            )
        ).all()
        
        sent_count = 0
        template = self.template_library.get_post_wedding_template()
        
        for couple in eligible_couples:
            lead = couple.leads[0] if couple.leads else None
            if not lead:
                continue
            
            loan_officer = self._get_loan_officer_for_lead(lead)
            if not loan_officer:
                continue
            
            if self._send_campaign_email(couple, lead, template, loan_officer, 'post_wedding'):
                sent_count += 1
                
                lead.status = LeadStatus.CONTACTED
                lead.last_contact_date = datetime.now()
                lead.next_follow_up_date = datetime.now() + timedelta(days=21)
        
        self.db.commit()
        return sent_count
    
    def _process_nurture_campaigns(self) -> int:
        """Process nurture campaigns for existing leads."""
        # Find leads ready for nurture follow-up
        eligible_leads = self.db.query(Lead).join(Couple).filter(
            and_(
                Lead.status.in_([LeadStatus.CONTACTED, LeadStatus.NURTURING]),
                Lead.next_follow_up_date <= datetime.now(),
                Couple.opted_out == False
            )
        ).all()
        
        sent_count = 0
        template = self.template_library.get_nurture_template()
        
        for lead in eligible_leads:
            couple = lead.couple
            loan_officer = self._get_loan_officer_for_lead(lead)
            if not loan_officer:
                continue
            
            if self._send_campaign_email(couple, lead, template, loan_officer, 'nurture'):
                sent_count += 1
                
                lead.status = LeadStatus.NURTURING
                lead.last_contact_date = datetime.now()
                lead.next_follow_up_date = datetime.now() + timedelta(days=30)
        
        self.db.commit()
        return sent_count
    
    def _process_follow_up_campaigns(self) -> int:
        """Process follow-up campaigns for qualified leads."""
        # Find qualified leads that need follow-up
        eligible_leads = self.db.query(Lead).join(Couple).filter(
            and_(
                Lead.status == LeadStatus.QUALIFIED,
                Lead.next_follow_up_date <= datetime.now(),
                Couple.opted_out == False
            )
        ).all()
        
        sent_count = 0
        
        for lead in eligible_leads:
            # Create custom follow-up based on lead data
            custom_template = self._create_follow_up_template(lead)
            if not custom_template:
                continue
            
            couple = lead.couple
            loan_officer = self._get_loan_officer_for_lead(lead)
            if not loan_officer:
                continue
            
            if self._send_campaign_email(couple, lead, custom_template, loan_officer, 'follow_up'):
                sent_count += 1
                
                # Extend follow-up schedule
                lead.last_contact_date = datetime.now()
                lead.next_follow_up_date = datetime.now() + timedelta(days=14)
        
        self.db.commit()
        return sent_count
    
    def _send_campaign_email(
        self,
        couple: Couple,
        lead: Lead,
        template,
        loan_officer: LoanOfficer,
        campaign_type: str
    ) -> bool:
        """Send a campaign email and record the send."""
        try:
            loan_officer_data = {
                'name': loan_officer.name,
                'company': 'Your Mortgage Company',  # Would come from config
                'phone': loan_officer.phone,
                'email': loan_officer.email
            }
            
            # Send email
            success = self.email_service.send_campaign_email(
                couple=couple,
                lead=lead,
                template=template,
                loan_officer_data=loan_officer_data
            )
            
            if success:
                # Record the campaign send
                campaign_send = CampaignSend(
                    campaign_id=self._get_or_create_auto_campaign(campaign_type).id,
                    lead_id=lead.id,
                    sent_at=datetime.now(),
                    send_status='sent'
                )
                self.db.add(campaign_send)
                
                return True
            
        except Exception as e:
            print(f"Error sending campaign email to couple {couple.id}: {str(e)}")
            return False
        
        return False
    
    def _get_loan_officer_for_lead(self, lead: Lead) -> Optional[LoanOfficer]:
        """Get the assigned loan officer for a lead, or auto-assign one."""
        if lead.assigned_loan_officer_id:
            return self.db.query(LoanOfficer).filter(
                LoanOfficer.id == lead.assigned_loan_officer_id
            ).first()
        
        # Auto-assign based on service areas and workload
        available_officers = self.db.query(LoanOfficer).filter(
            LoanOfficer.auto_assign_leads == True
        ).all()
        
        if not available_officers:
            return None
        
        # Simple round-robin assignment (could be more sophisticated)
        least_loaded = min(available_officers, key=lambda x: x.total_leads_assigned)
        
        # Assign the lead
        lead.assigned_loan_officer_id = least_loaded.id
        least_loaded.total_leads_assigned += 1
        
        return least_loaded
    
    def _get_or_create_auto_campaign(self, campaign_type: str) -> Campaign:
        """Get or create an automated campaign for the given type."""
        campaign = self.db.query(Campaign).filter(
            Campaign.name == f"Automated {campaign_type.title()} Campaign"
        ).first()
        
        if not campaign:
            campaign = Campaign(
                name=f"Automated {campaign_type.title()} Campaign",
                description=f"Automated {campaign_type} emails for wedding leads",
                campaign_type="email",
                status="active"
            )
            self.db.add(campaign)
            self.db.commit()
        
        return campaign
    
    def _create_follow_up_template(self, lead: Lead):
        """Create a custom follow-up template based on lead data."""
        from services.email_service import EmailTemplate
        
        # Customize based on lead score and data
        if lead.lead_score >= 80:
            subject = "Exclusive Program Alert: Perfect Match for {{ partner_1_name }} & {{ partner_2_name }}"
            focus = "premium programs"
        elif lead.target_purchase_price and lead.target_purchase_price > 500000:
            subject = "Luxury Home Financing Options for {{ partner_1_name }} & {{ partner_2_name }}"
            focus = "jumbo loan programs"
        else:
            subject = "Your Home Buying Journey: Next Steps for {{ partner_1_name }} & {{ partner_2_name }}"
            focus = "getting started"
        
        html_content = f"""
        <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #2c5aa0;">Hi {{{{ partner_1_name }}}} & {{{{ partner_2_name }}}},</h2>
                
                <p>I hope you're doing well! I wanted to follow up on our previous conversation about your home buying goals.</p>
                
                <p>Based on what you've shared, I think you'd be particularly interested in our {focus}. I've been working with couples just like you and have some great success stories to share.</p>
                
                <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="color: #2c5aa0; margin-top: 0;">What's Next?</h3>
                    <p>I'd love to schedule a brief 15-minute call to discuss your specific situation and see how I can help make your homeownership dreams a reality.</p>
                </div>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="{{{{ consultation_link }}}}" style="background: #2c5aa0; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Schedule Your Call</a>
                </div>
                
                <p>Best regards,<br>{{{{ loan_officer_name }}}}</p>
            </div>
        </body>
        </html>
        """
        
        return EmailTemplate(
            name="Custom Follow-up",
            subject=subject,
            html_content=html_content,
            plain_content=html_content.replace('<br>', '\n').replace('</p>', '\n'),
            category="follow_up"
        )
    
    def create_drip_campaign(
        self,
        couple: Couple,
        campaign_sequence: List[Dict]
    ) -> bool:
        """Create a drip campaign sequence for a specific couple."""
        try:
            for i, step in enumerate(campaign_sequence):
                # Schedule each step
                send_date = datetime.now() + timedelta(days=step.get('delay_days', i * 7))
                
                # Create campaign send record
                campaign_send = CampaignSend(
                    campaign_id=step['campaign_id'],
                    lead_id=couple.leads[0].id if couple.leads else None,
                    scheduled_send_date=send_date,
                    send_status='scheduled'
                )
                self.db.add(campaign_send)
            
            self.db.commit()
            return True
            
        except Exception as e:
            print(f"Error creating drip campaign for couple {couple.id}: {str(e)}")
            return False