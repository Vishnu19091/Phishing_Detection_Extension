from fastapi import Request
from fastapi.responses import RedirectResponse, JSONResponse
# from fastapi.staticfiles import StaticFiles
from starlette.middleware.sessions import SessionMiddleware
import httpx
import jwt
import logging
import traceback
from sqlalchemy.orm import Session
from database import SessionLocal
from fastapi import APIRouter, Request, Depends
from sqlalchemy.orm import Session
from models import Users
from exception import login_exception
import os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter(prefix="/oauth",tags=["oauth"])

def get_db():
    try:
        db=SessionLocal()
        yield db
    finally:
        db.close()


#Google OAuth credentials
CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
REDIRECT_URI = "http://localhost:8000/oauth/auth/callback"

#Serve static files (Your UI directory)
# router.mount("/ui", StaticFiles(directory=r"D:/clg/Project Phase 1/Project/Main/UI/", html=True), name="ui")

#Setup logging
logging.basicConfig(level=logging.DEBUG)

@router.get("/login")
async def login():
    """Redirects the user to Google's OAuth login page"""
    auth_url = (
        "https://accounts.google.com/o/oauth2/auth"
        f"?client_id={CLIENT_ID}"
        f"&redirect_uri={REDIRECT_URI}"
        f"&response_type=code"
        f"&scope=openid%20email%20profile"
        f"&access_type=offline"
        f"&prompt=consent"
    )
    return RedirectResponse(auth_url)

@router.get("/logout")
async def logout(request: Request):
    """Logs out the user by clearing session data"""
    request.session.clear()
    logging.debug("Logged Out Successfully")
    return RedirectResponse(url="http://localhost:5500/UI/home.html")

@router.get("/auth/callback")
async def auth_callback(request: Request, db: Session = Depends(get_db)):
    """Handles Google authentication callback and stores user info in session"""
    try:
        code = request.query_params.get("code")
        if not code:
            return JSONResponse({"error": "Authorization failed"}, status_code=400)

        # Exchange authorization code for access and ID tokens
        token_url = "https://oauth2.googleapis.com/token"
        data = {
            "code": code,
            "client_id": CLIENT_ID,
            "client_secret": CLIENT_SECRET,
            "redirect_uri": REDIRECT_URI,
            "grant_type": "authorization_code"
        }

        async with httpx.AsyncClient() as client:
            response = await client.post(token_url, data=data)
            tokens = response.json()

        logging.debug("Token response: %s", tokens)

        # Decode ID token to get user info
        id_token = tokens.get("id_token")
        if not id_token:
            return JSONResponse({"error": "Failed to retrieve ID token"}, status_code=400)

        decoded_token = jwt.decode(id_token, options={"verify_signature": False})
        email = decoded_token.get("email")
        name = decoded_token.get("name")

        # Store user info in session
        request.session["user_name"] = name
        request.session["user_email"] = email

        # Store in database if new user
        existing_user = db.query(Users).filter(Users.user_mail == email).first()
        if existing_user is None:
            new_user = Users(user_name=name, user_mail=email, is_active=True)
            db.add(new_user)
            db.commit()

        logging.info("New_User authenticated and stored: %s", name)

        return RedirectResponse(url="http://localhost:5500/UI/home.html")

    except Exception as e:
        logging.error("Error in auth_callback: %s", traceback.format_exc())
        return JSONResponse({"error": "Internal Server Error"}, status_code=500)
    
@router.get("/api/user")
async def get_user(request: Request, db: Session = Depends(get_db)):
    """Fetches the authenticated user's details"""
    user_email = request.session.get("user_email")

    if not user_email:
        return JSONResponse({"error": "User not authenticated"}, status_code=401)

    user = db.query(Users).filter(Users.user_mail == user_email).first()
    if user:
        return {"name": user.user_name, "email": user.user_mail}
    else:
        return JSONResponse({"error": "User not found"}, status_code=404)