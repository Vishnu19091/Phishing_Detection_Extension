from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import Optional
import models
from passlib.context import CryptContext
from sqlalchemy.orm import Session
from database import SessionLocal, engine
from main import *
from exception import *
from fastapi.security import OAuth2PasswordRequestForm
import sys
sys.path.append("..")


router=APIRouter(prefix="/user", tags=["user"])

def get_db():
    try:
        db=SessionLocal()
        yield db
    finally:
        db.close()


class User(BaseModel):
    user_name: str = Field(min_length=1)
    user_mail: str = Field(min_length=1, description="someone@gmail.com")
    is_active: bool

# :::::::::::::::: Should controlable only to admin ::::::::::::::::
@router.get("/users")
async def read_all_us(db: Session = Depends(get_db)):
    return db.query(models.Users).all()

# Search user by Name, Displays only authenticated users
@router.get("/users/{user_name}")
async def get_user_by_name(user_name: str, db: Session= Depends(get_db)):
    user_model= db.query(models.Users).filter(models.Users.user_name==user_name).first()
    if user_model is not None:
        return user_model
    return f"{user_name} NOT FOUND, try another name😔"

#Create user
@router.post("/")
async def create_user(user: User, db: Session=Depends(get_db)):
    user_model=models.Users()
    if user_model:
        user_model.user_name=user.user_name
        user_model.user_mail=user.user_mail
        user_model.is_active=user.is_active
        
        db.add(user_model)
        db.commit()
        return successful_response(200)
    else:
        raise http_exception()

# :::::::::::::::: Authenticated User can modify name later ::::::::::::::::
#Modify user's DataBase
@router.put("/{user_name}")
async def update_user(user_name: str, user:User, db:Session=Depends(get_db)):
    user_model=db.query(models.Users).filter(models.Users.user_name==user_name).first()
    
    if user_model is None:
        raise http_exception()
    
    user_model.user_name=user.user_name
    user_model.user_mail=user.user_mail
    user_model.is_active=True

    db.add(user_model)
    db.commit()
    
    return successful_response(200)
# :::::::::::::::: Authenticated User can modify name later ::::::::::::::::

#Delete user by name
@router.delete("/{user_name}")
async def delete_user_by_name(user_name: str, db: Session=Depends(get_db)):
    user_model=db.query(models.Users).filter(models.Users.user_name == user_name).first()
    
    if user_model is None:
        return f"{user_name} NOT FOUND 😔"
    
    db.query(models.Users).filter(models.Users.user_name == user_name).delete()
    db.commit()

    return successful_response(200)

# :::::::::::::::: Should controlable only to admin ::::::::::::::::