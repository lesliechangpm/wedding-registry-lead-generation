import os
import re
from datetime import datetime
from typing import Dict, List, Optional
from dataclasses import dataclass
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail, From, To, Subject, HtmlContent, PlainTextContent
from jinja2 import Template

from models.database import Couple, Lead, Campaign, CampaignSend


@dataclass
class EmailTemplate:
    name: str
    subject: str
    html_content: str
    plain_content: str
    category: str  # 'engagement', 'post_wedding', 'nurture', 'follow_up'


class EmailTemplateLibrary:
    """Library of pre-built email templates for wedding-based mortgage leads."""
    
    @staticmethod
    def get_engagement_announcement_template() -> EmailTemplate:
        return EmailTemplate(
            name="Engagement Congratulations",
            subject="Congratulations on Your Engagement! 🎉 Ready for Your Next Big Step?",
            html_content="""
            <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #2c5aa0;">Congratulations on Your Engagement, {{ partner_1_name }} & {{ partner_2_name }}!</h2>
                    
                    <p>What an exciting time in your lives! As you begin planning your beautiful wedding, you might also be thinking about your future together - including finding the perfect home to start your married life.</p>
                    
                    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="color: #2c5aa0; margin-top: 0;">Why Consider Homeownership Now?</h3>
                        <ul>
                            <li>Lock in today's rates before your wedding</li>
                            <li>Build equity instead of paying rent</li>
                            <li>Create your perfect newlywed nest</li>
                            <li>Take advantage of first-time buyer programs</li>
                        </ul>
                    </div>
                    
                    <p>I'm {{ loan_officer_name }}, a licensed mortgage specialist who helps couples like you navigate the home buying journey. I'd love to offer you a complimentary consultation to explore your options - with no pressure and no obligations.</p>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="{{ consultation_link }}" style="background: #2c5aa0; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Schedule Your Free Consultation</a>
                    </div>
                    
                    <p>Congratulations again, and I wish you all the happiness in the world!</p>
                    
                    <p>Best regards,<br>
                    {{ loan_officer_name }}<br>
                    {{ company_name }}<br>
                    {{ phone }} | {{ email }}</p>
                    
                    <div style="font-size: 12px; color: #666; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">
                        <p>This message was sent because we found your wedding announcement through public records. If you'd prefer not to receive these messages, <a href="{{ unsubscribe_link }}">click here to unsubscribe</a>.</p>
                    </div>
                </div>
            </body>
            </html>
            """,
            plain_content="""
            Congratulations on Your Engagement, {{ partner_1_name }} & {{ partner_2_name }}!

            What an exciting time in your lives! As you begin planning your beautiful wedding, you might also be thinking about your future together - including finding the perfect home to start your married life.

            Why Consider Homeownership Now?
            • Lock in today's rates before your wedding
            • Build equity instead of paying rent
            • Create your perfect newlywed nest
            • Take advantage of first-time buyer programs

            I'm {{ loan_officer_name }}, a licensed mortgage specialist who helps couples like you navigate the home buying journey. I'd love to offer you a complimentary consultation to explore your options - with no pressure and no obligations.

            Schedule your free consultation: {{ consultation_link }}

            Congratulations again, and I wish you all the happiness in the world!

            Best regards,
            {{ loan_officer_name }}
            {{ company_name }}
            {{ phone }} | {{ email }}

            This message was sent because we found your wedding announcement through public records. If you'd prefer not to receive these messages, visit {{ unsubscribe_link }}
            """,
            category="engagement"
        )
    
    @staticmethod
    def get_post_wedding_template() -> EmailTemplate:
        return EmailTemplate(
            name="Post-Wedding Home Buying",
            subject="Welcome to Married Life! Ready to Find Your First Home Together?",
            html_content="""
            <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #2c5aa0;">Congratulations on Your Recent Wedding, {{ partner_1_name }} & {{ partner_2_name }}!</h2>
                    
                    <p>We hope you had the most magical wedding day! Now that you're officially married, you might be thinking about finding the perfect home to begin this exciting new chapter together.</p>
                    
                    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="color: #2c5aa0; margin-top: 0;">Newlywed Home Buying Advantages:</h3>
                        <ul>
                            <li>Combined income may qualify you for better loan terms</li>
                            <li>Tax benefits of homeownership as a married couple</li>
                            <li>Build wealth together from day one</li>
                            <li>Create lasting memories in your own space</li>
                        </ul>
                    </div>
                    
                    <p>Many couples find that the months after their wedding are perfect for house hunting. You've already mastered planning a major event together - buying a home will feel like a breeze!</p>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="{{ consultation_link }}" style="background: #2c5aa0; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Get Your Free Home Buying Guide</a>
                    </div>
                    
                    <p>As a gift for your recent marriage, I'd like to offer you a complimentary home buying consultation and a personalized market analysis for your area.</p>
                    
                    <p>Best wishes for your new life together!</p>
                    
                    <p>{{ loan_officer_name }}<br>
                    {{ company_name }}<br>
                    {{ phone }} | {{ email }}</p>
                </div>
            </body>
            </html>
            """,
            plain_content="""
            Congratulations on Your Recent Wedding, {{ partner_1_name }} & {{ partner_2_name }}!

            We hope you had the most magical wedding day! Now that you're officially married, you might be thinking about finding the perfect home to begin this exciting new chapter together.

            Newlywed Home Buying Advantages:
            • Combined income may qualify you for better loan terms
            • Tax benefits of homeownership as a married couple
            • Build wealth together from day one
            • Create lasting memories in your own space

            Many couples find that the months after their wedding are perfect for house hunting. You've already mastered planning a major event together - buying a home will feel like a breeze!

            Get your free home buying guide: {{ consultation_link }}

            As a gift for your recent marriage, I'd like to offer you a complimentary home buying consultation and a personalized market analysis for your area.

            Best wishes for your new life together!

            {{ loan_officer_name }}
            {{ company_name }}
            {{ phone }} | {{ email }}
            """,
            category="post_wedding"
        )
    
    @staticmethod
    def get_nurture_template() -> EmailTemplate:
        return EmailTemplate(
            name="Market Update & Tips",
            subject="Great News About {{ location }} Home Market + Exclusive Buyer Tips",
            html_content="""
            <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #2c5aa0;">Hi {{ partner_1_name }} & {{ partner_2_name }},</h2>
                    
                    <p>I hope married life is treating you wonderfully! I wanted to share some exciting updates about the {{ location }} housing market that might interest you.</p>
                    
                    <div style="background: #e8f4f8; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="color: #2c5aa0; margin-top: 0;">Current Market Highlights:</h3>
                        <ul>
                            <li>Inventory is up 15% from last month</li>
                            <li>Interest rates remain favorable for qualified buyers</li>
                            <li>Average home prices in your area: ${{ avg_home_price }}</li>
                            <li>New buyer incentive programs available</li>
                        </ul>
                    </div>
                    
                    <h3 style="color: #2c5aa0;">Exclusive Tip for Newlyweds:</h3>
                    <p>Did you know that many lenders offer special programs for recently married couples? These can include reduced fees, flexible down payment options, and expedited processing.</p>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="{{ market_report_link }}" style="background: #2c5aa0; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">View Full Market Report</a>
                    </div>
                    
                    <p>If you're curious about what you might qualify for or want to explore your options, I'm always here to help with a no-pressure conversation.</p>
                    
                    <p>Best regards,<br>{{ loan_officer_name }}</p>
                </div>
            </body>
            </html>
            """,
            plain_content="""
            Hi {{ partner_1_name }} & {{ partner_2_name }},

            I hope married life is treating you wonderfully! I wanted to share some exciting updates about the {{ location }} housing market that might interest you.

            Current Market Highlights:
            • Inventory is up 15% from last month
            • Interest rates remain favorable for qualified buyers
            • Average home prices in your area: ${{ avg_home_price }}
            • New buyer incentive programs available

            Exclusive Tip for Newlyweds:
            Did you know that many lenders offer special programs for recently married couples? These can include reduced fees, flexible down payment options, and expedited processing.

            View full market report: {{ market_report_link }}

            If you're curious about what you might qualify for or want to explore your options, I'm always here to help with a no-pressure conversation.

            Best regards,
            {{ loan_officer_name }}
            """,
            category="nurture"
        )


class EmailService:
    """Service for sending templated emails to wedding leads."""
    
    def __init__(self):
        self.sendgrid = SendGridAPIClient(api_key=os.getenv('SENDGRID_API_KEY'))
        self.from_email = os.getenv('FROM_EMAIL', 'noreply@yourdomain.com')
        self.from_name = os.getenv('FROM_NAME', 'Your Mortgage Company')
        self.template_library = EmailTemplateLibrary()
    
    def send_campaign_email(
        self,
        couple: Couple,
        lead: Lead,
        template: EmailTemplate,
        loan_officer_data: Dict,
        custom_variables: Optional[Dict] = None
    ) -> bool:
        """Send a templated campaign email to a couple."""
        try:
            # Prepare template variables
            variables = self._prepare_template_variables(
                couple, lead, loan_officer_data, custom_variables or {}
            )
            
            # Render templates
            subject = Template(template.subject).render(**variables)
            html_content = Template(template.html_content).render(**variables)
            plain_content = Template(template.plain_content).render(**variables)
            
            # Determine recipient
            to_email, to_name = self._get_primary_contact(couple)
            if not to_email:
                raise ValueError("No email address available for couple")
            
            # Create email
            message = Mail(
                from_email=From(self.from_email, self.from_name),
                to_emails=To(to_email, to_name),
                subject=Subject(subject),
                html_content=HtmlContent(html_content),
                plain_text_content=PlainTextContent(plain_content)
            )
            
            # Add categories for tracking
            message.category = [template.category, 'wedding-leads']
            
            # Send email
            response = self.sendgrid.send(message)
            
            return response.status_code in [200, 202]
            
        except Exception as e:
            print(f"Error sending email to couple {couple.id}: {str(e)}")
            return False
    
    def _prepare_template_variables(
        self,
        couple: Couple,
        lead: Lead,
        loan_officer_data: Dict,
        custom_variables: Dict
    ) -> Dict:
        """Prepare variables for template rendering."""
        base_url = os.getenv('BASE_URL', 'https://yourdomain.com')
        
        variables = {
            # Couple data
            'partner_1_name': couple.partner_1_name,
            'partner_2_name': couple.partner_2_name,
            'wedding_date': couple.wedding_date.strftime('%B %d, %Y') if couple.wedding_date else 'upcoming',
            'wedding_city': couple.wedding_city or 'your area',
            'wedding_state': couple.wedding_state or '',
            'location': f"{couple.wedding_city}, {couple.wedding_state}" if couple.wedding_city and couple.wedding_state else "your area",
            
            # Lead data
            'target_price': f"${lead.target_purchase_price:,.0f}" if lead.target_purchase_price else "$350,000",
            'estimated_income': f"${lead.estimated_income:,.0f}" if lead.estimated_income else "your income level",
            
            # Loan officer data
            'loan_officer_name': loan_officer_data.get('name', 'Your Loan Officer'),
            'company_name': loan_officer_data.get('company', 'Mortgage Company'),
            'phone': loan_officer_data.get('phone', '(555) 123-4567'),
            'email': loan_officer_data.get('email', 'officer@company.com'),
            
            # Links
            'consultation_link': f"{base_url}/book-consultation?lead={lead.id}",
            'market_report_link': f"{base_url}/market-report?location={couple.wedding_state}",
            'unsubscribe_link': f"{base_url}/unsubscribe?couple={couple.id}",
            
            # Market data (would come from real data source)
            'avg_home_price': '$425,000',
            'current_rate': '6.75%',
            
            # Custom variables
            **custom_variables
        }
        
        return variables
    
    def _get_primary_contact(self, couple: Couple) -> tuple[str, str]:
        """Get the primary email contact for a couple."""
        if couple.partner_1_email:
            return couple.partner_1_email, couple.partner_1_name
        elif couple.partner_2_email:
            return couple.partner_2_email, couple.partner_2_name
        else:
            return None, None
    
    def validate_email_content(self, content: str) -> List[str]:
        """Validate email content for compliance and best practices."""
        issues = []
        
        # Check for required elements
        if 'unsubscribe' not in content.lower():
            issues.append("Email must include unsubscribe link")
        
        # Check for spam triggers
        spam_words = ['guaranteed', 'act now', 'limited time', 'no obligation', 'free money']
        for word in spam_words:
            if word in content.lower():
                issues.append(f"Consider removing potential spam trigger: '{word}'")
        
        # Check for personalization
        if '{{' not in content:
            issues.append("Email should include personalization variables")
        
        return issues
    
    def get_template_by_category(self, category: str) -> Optional[EmailTemplate]:
        """Get a template by category."""
        templates = {
            'engagement': self.template_library.get_engagement_announcement_template,
            'post_wedding': self.template_library.get_post_wedding_template,
            'nurture': self.template_library.get_nurture_template,
        }
        
        template_func = templates.get(category)
        return template_func() if template_func else None