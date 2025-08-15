from fastapi import FastAPI, UploadFile
from uvicorn.middleware.proxy_headers import ProxyHeadersMiddleware # Import the middleware
from .api.v1.routes import api_router
from .db.base import Base
from .db.session import engine, SessionLocal
from .services import admin_service
from fastapi.staticfiles import StaticFiles
import os
from .services.submission_service import validate_file_type


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

@app.post("/upload")
async def upload_file(file: UploadFile):
    validate_file_type(file)

    file_path = os.path.join(UPLOAD_DIRECTORY, file.filename)
    with open(file_path, "wb") as f:
        f.write(await file.read())

    return {"filename": file.filename}