from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ....db.session import get_db
from ....services import dashboard_service
from ....db.schemas.dashboard import DashboardStats
from ....db.schemas.submission import Submission # Import the Submission schema for the response
from ...dependencies import get_current_admin
from ....db.models.admin import Admin

router = APIRouter()

@router.get("/stats", response_model=DashboardStats)
def handle_get_dashboard_stats(
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin) # Protects the endpoint
):
    """
    Protected endpoint for admins to retrieve dashboard statistics.
    """
    stats = dashboard_service.get_dashboard_stats(db)
    return stats

@router.post("/generate-winner", response_model=Submission)
def handle_generate_winner(
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin) # Protects the endpoint
):
    """
    Protected endpoint to select and return a single random winner.
    """
    winner = dashboard_service.select_random_winner(db)
    if not winner:
        raise HTTPException(
            status_code=404,
            detail="No submissions found to select a winner from.",
        )
    return winner
