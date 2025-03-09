from typing import Optional
from fastapi import FastAPI, Depends, HTTPException
from database import engine, SessionLocal
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session
import models

app=FastAPI()

models.Base.metadata.create_all(bind=engine)

def get_db():
    try:
        db=SessionLocal()
        yield db
    finally:
        db.close()

class User(BaseModel):
    user_name: str = Field(min_length=1)
    user_mail: str = Field(min_length=1, description="someone@gmail.com")
    country: Optional[str] = Field(min_length=1)
    is_active: bool

#To create db
# @app.get("/")
# async def create_db():
#     return {"Database":"Created"}

@app.get("/")
async def index():
    return successful_response(200)

def successful_response(status_code:int):
    return {
        "status_code": status_code,
        "status": "Successful"
    }

def http_exception():
    raise HTTPException(status_code=404, detail="Something went wrong!")