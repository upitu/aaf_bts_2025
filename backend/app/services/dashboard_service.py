from sqlalchemy.orm import Session
from sqlalchemy import func
from collections import Counter, defaultdict
from datetime import timezone
from typing import Dict, List
from app.db.models.submission import Submission
from app.db.schemas.dashboard import DashboardStats
from app.utils.emirates import normalize_emirate, EMIRATE_COLORS
import random

# def get_dashboard_stats(db: Session) -> DashboardStats:
#     """
#     Calculates and returns key statistics for the admin dashboard.
#     """
#     total_submissions = db.query(Submission).count()
#     emirate_counts_query = db.query(
#         Submission.emirate, 
#         func.count(Submission.emirate).label("count")
#     ).group_by(Submission.emirate).all()
#     submissions_by_emirate: Dict[str, int] = {
#         emirate: count for emirate, count in emirate_counts_query
#     }
#     return DashboardStats(
#         total_submissions=total_submissions,
#         submissions_by_emirate=submissions_by_emirate
#     )

def get_dashboard_stats(db: Session):
    # Pull only the fields we need
    rows: List[Submission] = db.query(Submission).all()

    total = len(rows)

    # 1) Emirate counts (merge EN/AR)
    emirate_counts: Counter = Counter()
    for r in rows:
        emirate_counts[normalize_emirate(r.emirate or "")] += 1

    # 2) Language counts – if you store language, adjust the attr name
    lang_counts: Dict[str, int] = Counter()
    for r in rows:
        # e.g. r.lang contains "en"/"ar" or derive from name/email if you must
        if hasattr(r, "lang") and r.lang:
            lang_counts[r.lang] += 1

    # 3) Submissions over time – hourly buckets example
    buckets: Dict[str, int] = defaultdict(int)
    for r in rows:
        if not r.submitted_at:
            continue
        dt = r.submitted_at
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=timezone.utc)
        hour_label = dt.strftime("%Y-%m-%d %H:00")
        buckets[hour_label] += 1
    over_time = [{"bucket": k, "count": buckets[k]} for k in sorted(buckets.keys())]

    # 4) Peak hour
    peak_hour = None
    if over_time:
        peak_bucket = max(over_time, key=lambda x: x["count"])
        peak_hour = {"hour_label": peak_bucket["bucket"], "count": peak_bucket["count"]}

    return {
        "total_submissions": total,
        "submissions_by_emirate": dict(emirate_counts),
        "emirate_colors": EMIRATE_COLORS,     # send stable mapping
        "submissions_by_language": dict(lang_counts) or None,
        "submissions_over_time": over_time or None,
        "peak_hour": peak_hour,
    }

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
