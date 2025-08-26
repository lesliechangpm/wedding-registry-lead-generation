from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer
from sqlalchemy.orm import Session
import os
from dotenv import load_dotenv

from api import leads, couples, campaigns, loan_officers, analytics
from models.database import Base
from utils.database import engine, get_db
from utils.auth import get_current_user

# Load environment variables
load_dotenv()

# Create database tables
Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI(
    title="Wedding Registry Lead Generation API",
    description="API for managing wedding-based mortgage lead generation",
    version="1.0.0",
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # React dev servers
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy", "message": "Wedding Registry Integration API is running"}

# Include API routers
app.include_router(leads.router, prefix="/api/v1/leads", tags=["leads"])
app.include_router(couples.router, prefix="/api/v1/couples", tags=["couples"])
app.include_router(campaigns.router, prefix="/api/v1/campaigns", tags=["campaigns"])
app.include_router(loan_officers.router, prefix="/api/v1/loan-officers", tags=["loan-officers"])
app.include_router(analytics.router, prefix="/api/v1/analytics", tags=["analytics"])

# Root endpoint
@app.get("/")
async def root():
    return {
        "message": "Wedding Registry Lead Generation API",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/health"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)