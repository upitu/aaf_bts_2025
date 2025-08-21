from sqlalchemy.orm import Session
from sqlalchemy import func
from collections import Counter, defaultdict
from datetime import timezone
from typing import Dict, List
from app.db.models.submission import Submission
from app.db.schemas.dashboard import DashboardStats
from app.utils.emirates import normalize_emirate, EMIRATE_COLORS
import random
import re

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

# Simple Arabic letters detection
_ARABIC_RE = re.compile(r'[\u0600-\u06FF]')

def _guess_lang(*texts: str) -> str:
    """Return 'ar' if any provided text contains Arabic letters, else 'en'."""
    joined = " ".join([t or "" for t in texts])
    return "ar" if _ARABIC_RE.search(joined) else "en"

# Normalize emirate names so EN/AR collapse to one bucket
_EMIRATE_NORMALIZE = {
    "abu dhabi": "Abu Dhabi", "أبوظبي": "Abu Dhabi", "ابو ظبي": "Abu Dhabi",
    "dubai": "Dubai", "دبي": "Dubai",
    "sharjah": "Sharjah", "الشارقة": "Sharjah",
    "ajman": "Ajman", "عجمان": "Ajman",
    "umm al quwain": "Umm Al Quwain", "أم القيوين": "Umm Al Quwain",
    "ras al khaimah": "Ras Al Khaimah", "رأس الخيمة": "Ras Al Khaimah",
    "fujairah": "Fujairah", "الفجيرة": "Fujairah",
}
def normalize_emirate(val: str) -> str:
    key = (val or "").strip().lower()
    return _EMIRATE_NORMALIZE.get(key, val or "").strip() or "Unknown"

# Stable colors per normalized emirate (frontend can use these)
EMIRATE_COLORS: Dict[str, str] = {
    "Abu Dhabi": "#3B82F6",
    "Dubai": "#EF4444",
    "Sharjah": "#22C55E",
    "Ajman": "#F59E0B",
    "Umm Al Quwain": "#8B5CF6",
    "Ras Al Khaimah": "#14B8A6",
    "Fujairah": "#E11D48",
    "Unknown": "#6B7280",
}

def get_dashboard_stats(db: Session):
    rows: List[Submission] = db.query(Submission).all()
    total = len(rows)

    # 1) Emirate counts (merge EN/AR)
    emirate_counts: Counter = Counter()
    for r in rows:
        emirate_counts[normalize_emirate(getattr(r, "emirate", "") or "")] += 1

    # 2) Language counts – infer from user-provided fields
    lang_counts: Dict[str, int] = {"en": 0, "ar": 0}
    for r in rows:
        lang = _guess_lang(getattr(r, "emirate", ""), getattr(r, "name", ""), getattr(r, "email", ""))
        lang_counts[lang] = lang_counts.get(lang, 0) + 1

    # 3) Submissions over time – hourly buckets (UTC-safe)
    buckets: Dict[str, int] = defaultdict(int)
    for r in rows:
        dt = getattr(r, "submitted_at", None)
        if not dt:
            continue
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=timezone.utc)
        hour_label = dt.strftime("%Y-%m-%d %H:00")
        buckets[hour_label] += 1

    over_time = [{"bucket": k, "count": buckets[k]} for k in sorted(buckets.keys())]

    # 4) Peak hour
    peak_hour = None
    if over_time:
        peak = max(over_time, key=lambda x: x["count"])
        peak_hour = {"hour_label": peak["bucket"], "count": peak["count"]}

    # Sort emirates by count desc (optional, nicer chart order)
    emirate_sorted = dict(sorted(emirate_counts.items(), key=lambda kv: kv[1], reverse=True))

    return {
        "total_submissions": total,
        "submissions_by_emirate": emirate_sorted,
        "emirate_colors": EMIRATE_COLORS,
        "submissions_by_language": lang_counts,         # always present
        "submissions_over_time": over_time,             # always a list
        "peak_hour": peak_hour,                         # or None if no data
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
