from fastapi import FastAPI
from .api.v1.routes import api_router
from .db.base import Base
from .db.session import engine, SessionLocal
from .services import admin_service

# Create all database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Back to School Campaign API")

# The "/api" prefix has been removed from here
app.include_router(api_router, prefix="/v1")

@app.on_event("startup")
def on_startup():
    """
    Event handler for application startup.
    Creates the global admin if it doesn't exist.
    """
    db = SessionLocal()
    try:
        admin_service.create_global_admin_if_not_exists(db)
    finally:
        db.close()

@app.get('/')
def root():
    return {"message": "Hello from backend!"}
