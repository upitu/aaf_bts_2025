from fastapi import APIRouter
from .endpoints import auth, admins, submissions, dashboard

api_router = APIRouter()

# Include the authentication routes
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])

# Include the admin management routes
api_router.include_router(admins.router, prefix="/admins", tags=["Admin Management"])

# Include the user submission routes
api_router.include_router(submissions.router, prefix="/submissions", tags=["Submissions"])

# Include the dashboard routes
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["Dashboard"])
