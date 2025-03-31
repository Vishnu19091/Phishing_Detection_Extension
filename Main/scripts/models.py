from sqlalchemy import Boolean, Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class Users(Base):
    __tablename__= "users"

    user_id=Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_name=Column(String, unique=True, index=True, nullable=False)
    user_mail=Column(String, unique=True, index=True, nullable=False)
    is_active=Column(Boolean, default=True)

    report_url=relationship("Report_URL", back_populates="users")

class Report_URL(Base):
    __tablename__= "report_url"

    id=Column(Integer, primary_key=True, index=True)
    url=Column(String,nullable=False)
    user_email=Column(Integer, ForeignKey("users.user_mail"))

    users=relationship("Users", back_populates="report_url")