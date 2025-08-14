from sqlalchemy.orm import Session
from sqlalchemy import func
from ..db.models.submission import Submission
from ..db.schemas.dashboard import DashboardStats
from typing import Dict
import random

def get_dashboard_stats(db: Session) -> DashboardStats:
    """
    Calculates and returns key statistics for the admin dashboard.
    """
    total_submissions = db.query(Submission).count()
    emirate_counts_query = db.query(
        Submission.emirate, 
        func.count(Submission.emirate).label("count")
    ).group_by(Submission.emirate).all()
    submissions_by_emirate: Dict[str, int] = {
        emirate: count for emirate, count in emirate_counts_query
    }
    return DashboardStats(
        total_submissions=total_submissions,
        submissions_by_emirate=submissions_by_emirate
    )

def select_random_winner(db: Session) -> Submission | None:
    """
    Selects a single random winner from all submissions.
    """
    # Fetch all submission IDs first to be memory efficient
    submission_ids = db.query(Submission.id).all()
    if not submission_ids:
        return None
    
    # Choose a random ID from the list
    random_submission_id = random.choice(submission_ids)[0]
    
    # Fetch the full submission object for the chosen ID
    winner = db.query(Submission).filter(Submission.id == random_submission_id).first()
    return winner
