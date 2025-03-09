from sqlalchemy import Boolean, Column, Integer, String
from sqlalchemy.orm import relationship
from database import Base

class Users(Base):
    __tablename__= "users"

    user_id=Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_name=Column(String, unique=True, index=True, nullable=False)
    user_mail=Column(String, unique=True, index=True)
    country=Column(String)
    is_active=Column(Boolean, default=True)