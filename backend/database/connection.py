"""
Database connection and session management
"""

import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.pool import StaticPool
from models.database_models import Base

# Database URL - defaults to SQLite for development
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./wedding_registry.db")

# Create engine
if DATABASE_URL.startswith("sqlite"):
    # SQLite specific configuration
    engine = create_engine(
        DATABASE_URL,
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
        echo=False  # Set to True for SQL logging
    )
else:
    # PostgreSQL/other database configuration
    engine = create_engine(DATABASE_URL, echo=False)

# Create SessionLocal class
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def create_tables():
    """Create all database tables"""
    Base.metadata.create_all(bind=engine)


def get_database_session() -> Session:
    """Get a database session"""
    db = SessionLocal()
    try:
        return db
    except Exception:
        db.close()
        raise


def get_db():
    """Dependency for FastAPI to get database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_database():
    """Initialize database with tables and default data"""
    print("Creating database tables...")
    create_tables()
    print("Database tables created successfully!")
    
    # Check if we need to populate with initial data
    db = SessionLocal()
    try:
        from models.database_models import LoanOfficer, Setting
        
        # Add default loan officers if none exist
        if db.query(LoanOfficer).count() == 0:
            default_officers = [
                LoanOfficer(
                    name="Sarah Johnson",
                    email="sarah.johnson@company.com",
                    phone="(555) 123-4567",
                    specialty="First-time home buyers"
                ),
                LoanOfficer(
                    name="Michael Chen",
                    email="michael.chen@company.com", 
                    phone="(555) 234-5678",
                    specialty="Luxury homes and jumbo loans"
                ),
                LoanOfficer(
                    name="Emily Rodriguez",
                    email="emily.rodriguez@company.com",
                    phone="(555) 345-6789", 
                    specialty="Construction and renovation loans"
                )
            ]
            db.add_all(default_officers)
            
        # Add default settings if none exist
        if db.query(Setting).count() == 0:
            default_settings = [
                Setting(
                    key="lead_scoring_enabled",
                    value="true",
                    description="Enable automatic lead scoring based on wedding budget and demographics"
                ),
                Setting(
                    key="auto_assignment_enabled",
                    value="true",
                    description="Automatically assign new leads to loan officers"
                ),
                Setting(
                    key="email_notifications_enabled", 
                    value="true",
                    description="Send email notifications for new leads and activities"
                )
            ]
            db.add_all(default_settings)
            
        db.commit()
        print("Default data added successfully!")
        
    except Exception as e:
        print(f"Error adding default data: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    init_database()