import random
from datetime import datetime, timedelta
from jose import JWTError, jwt
from .config import settings
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

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
    Sends a one-time password to the user's email using SendGrid.
    """
    # Check if the SendGrid API key is configured. If not, simulate the email.
    if not settings.SENDGRID_API_KEY:
        print("--- SENDGRID_API_KEY not found. Simulating email. ---")
        print(f"To: {email}")
        print(f"Subject: Your Login Code")
        print(f"Your one-time password is: {otp}")
        print("----------------------------------------------------")
        return

    # Create the email message
    message = Mail(
        from_email=settings.EMAILS_FROM_EMAIL,
        to_emails=email,
        subject='Your Login Code for Back to School Campaign',
        html_content=f"""
        <div style="font-family: sans-serif; text-align: center; padding: 20px;">
            <h2 style="color: #333;">Here is your login code:</h2>
            <p style="font-size: 28px; font-weight: bold; letter-spacing: 4px; color: #5e35b1; margin: 20px 0;">{otp}</p>
            <p style="color: #666;">This code will expire in 10 minutes.</p>
        </div>
        """
    )
    try:
        # Send the email using the SendGrid client
        sg = SendGridAPIClient(settings.SENDGRID_API_KEY)
        response = sg.send(message)
        print(f"Email sent to {email}. Status code: {response.status_code}")
    except Exception as e:
        print(f"Error sending email: {e}")
