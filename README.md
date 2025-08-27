# VowCRM - Wedding-Focused CRM Platform

## Overview
VowCRM is a comprehensive wedding-focused CRM system that connects with wedding planning platforms to identify and engage newly engaged/married couples with targeted home loan opportunities.

## Project Structure

```
wedding-registry-integration/
├── backend/
│   ├── api/          # FastAPI routes and endpoints
│   ├── integrations/ # Wedding platform integrations
│   ├── models/       # Database models
│   ├── services/     # Business logic services
│   └── utils/        # Utility functions
├── frontend/
│   ├── components/   # React components
│   ├── pages/        # Application pages
│   ├── hooks/        # Custom React hooks
│   └── utils/        # Frontend utilities
├── database/         # Database migrations and seeds
├── tests/           # Test files
└── docs/            # Project documentation
```

## Features (Planned)

### Phase 1 - MVP
- [ ] Wedding platform data integration
- [ ] Basic lead scoring system
- [ ] Email campaign automation
- [ ] Loan officer dashboard

### Phase 2 - Enhancement
- [ ] Advanced personalization
- [ ] SMS campaigns
- [ ] Analytics dashboard
- [ ] CRM integration

### Phase 3 - Scale
- [ ] AI-powered lead scoring
- [ ] Predictive analytics
- [ ] Mobile optimization

## Tech Stack

**Backend:**
- FastAPI (Python)
- PostgreSQL
- Redis
- Celery

**Frontend:**
- React
- TypeScript
- Tailwind CSS

**Integrations:**
- Wedding platform APIs/webhooks
- Email services (SendGrid)
- SMS services (Twilio)
- CRM systems

## Getting Started

### Prerequisites
- Python 3.9+
- Node.js 16+
- PostgreSQL
- Redis

### Installation
```bash
# Clone the repository
git clone <repo-url>
cd wedding-registry-integration

# Backend setup
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Frontend setup
cd ../frontend
npm install
```

### Environment Variables
Create `.env` files in both backend and frontend directories with necessary configuration.

## API Research Notes

Based on research conducted on major wedding platforms:

- **The Knot**: Limited public API access, uses Mirakl for integrations
- **Zola**: Offers embeddable widgets, no public API
- **WeddingWire**: No public API, now part of The Knot Worldwide

**Alternative Strategy**: Focus on smaller platforms with APIs, web scraping where legally permitted, and webhook integrations where available.

## Legal & Compliance

- TCPA compliance for communications
- GDPR/CCPA data handling
- Opt-out mechanisms
- Secure data storage and transmission

## License

[To be determined]