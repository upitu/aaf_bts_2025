import random
from datetime import datetime, timedelta
from jose import JWTError, jwt
from .config import settings

# A simple in-memory store for OTPs.
# In a production environment, you should use a more persistent store like Redis or your database.
otp_storage = {}

def create_access_token(data: dict):
    """Creates a new JWT access token."""
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def generate_otp() -> str:
    """Generates a 6-digit one-time password."""
    return str(random.randint(100000, 999999))

def store_otp(email: str, otp: str):
    """Stores the OTP for a user. In a real app, this would also have an expiration."""
    otp_storage[email] = otp
    print(f"OTP for {email}: {otp}") # For debugging - REMOVE IN PRODUCTION

def verify_otp(email: str, otp: str) -> bool:
    """Verifies if the provided OTP is correct."""
    stored_otp = otp_storage.get(email)
    if stored_otp and stored_otp == otp:
        # OTP is correct, remove it after verification
        del otp_storage[email]
        return True
    return False

def send_otp_email(email: str, otp: str):
    """
    Placeholder function to simulate sending an email with the OTP.
    In a real application, you would integrate an email service like SendGrid, Mailgun, or AWS SES here.
    """
    print("--- SIMULATING EMAIL ---")
    print(f"To: {email}")
    print(f"Subject: Your Login Code")
    print(f"Your one-time password is: {otp}")
    print("------------------------")
    # In a real app, you would have something like:
    # email_service.send(to=email, subject="Login Code", body=f"Your code is {otp}")
