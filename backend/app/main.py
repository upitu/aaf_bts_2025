from fastapi import FastAPI
from uvicorn.middleware.proxy_headers import ProxyHeadersMiddleware # Import the middleware
from .api.v1.routes import api_router
from .db.base import Base
from .db.session import engine, SessionLocal
from .services import admin_service
from fastapi.staticfiles import StaticFiles
import os


# Create all database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Back to School Campaign API")
UPLOAD_DIRECTORY = os.getenv("UPLOAD_DIRECTORY", "/app/uploads")
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIRECTORY), name="uploads")

# --- ADD THIS MIDDLEWARE ---
# This tells FastAPI to trust the X-Forwarded-Proto header sent by your Nginx proxy.
app.add_middleware(ProxyHeadersMiddleware, trusted_hosts="*")
# -------------------------

# Use the full /api/v1 prefix to match the Nginx location block
app.include_router(api_router, prefix="/api/v1")

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
