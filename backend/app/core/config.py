import os
from dotenv import load_dotenv

load_dotenv()

def get_bool_env(var_name: str, default: bool = False) -> bool:
    """Helper to convert string env vars to booleans."""
    return os.getenv(var_name, str(default)).lower() in ('true', '1', 't')

class Settings:
    # --- Database Connection Settings ---
    DB_USER: str = os.getenv("DB_USER", "postgres")
    DB_PASSWORD: str = os.getenv("DB_PASSWORD", "password")
    DB_HOST: str = os.getenv("DB_HOST", "db")
    DB_PORT: str = os.getenv("DB_PORT", "5432")
    DB_NAME: str = os.getenv("DB_NAME", "app")
    
    # Assemble the database URL from the individual components
    DATABASE_URL: str = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

    # Global Admin Email
    GLOBAL_ADMIN_EMAIL: str = os.getenv("GLOBAL_ADMIN_EMAIL", "elias@digitaljunkies.ae")

    # JWT Settings
    SECRET_KEY: str = os.getenv("SECRET_KEY", "")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 8 # 8 hours

    # Google Tag Manager ID
    GTM_ID: str = os.getenv("GTM_ID", "")

    # SendGrid Settings
    SENDGRID_API_KEY: str = os.getenv("SENDGRID_API_KEY")
    EMAILS_FROM_EMAIL: str = os.getenv("EMAILS_FROM_EMAIL", "noreply@yourdomain.com")

    # Set these to 'True' or 'False' in your .env files
    ENFORCE_UNIQUE_EMAIL: bool = get_bool_env("ENFORCE_UNIQUE_EMAIL", False)
    ENFORCE_UNIQUE_MOBILE: bool = get_bool_env("ENFORCE_UNIQUE_MOBILE", False)

settings = Settings()