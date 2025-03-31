# from typing import Optional
from fastapi import FastAPI
from database import engine
from pydantic import BaseModel, Field
import models
from routers import api, auth, report, oauth
from starlette.middleware.sessions import SessionMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

app=FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5500"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

models.Base.metadata.create_all(bind=engine)

app.add_middleware(SessionMiddleware, secret_key="wrextvbhnjxdcghjbkzxcvhjkewfoihj")

app.mount("/ui", StaticFiles(directory="D:/clg/Project Phase 1/Project/Main/UI", html=True), name="ui")

app.include_router(api.router)
app.include_router(auth.router)
app.include_router(report.router)
app.include_router(oauth.router)

class User(BaseModel):
    user_name: str = Field(min_length=1)
    user_mail: str = Field(min_length=1, description="someone@gmail.com")
    is_active: bool

# To create db
# @app.get("/")
# async def create_db():
#     return {"Database":"Created"}

@app.get("/")
async def index():
    return {
        "Welcome-Message":"Welcome to the Phishing Detection API",
        "Status":successful_response(200)
        }

def successful_response(status_code:int):
    return {
        "status_code": status_code,
        "status_message": "Successful"
    }
