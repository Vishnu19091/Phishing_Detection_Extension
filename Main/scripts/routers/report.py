import sys
sys.path.append("..")
from fastapi import Depends, Request, APIRouter, Form
from database import SessionLocal
from sqlalchemy.orm import Session
from main import *
from exception import *
from models import Report_URL

router=APIRouter(prefix="/report", tags=["report"])

def get_db():
    try:
        db=SessionLocal()
        yield db
    finally:
        db.close()

@router.get("/show-reports/")
async def display_all_reported_urls(db:Session=Depends(get_db)):
    report_model=db.query(models.Report_URL).all()
    if report_model is not None:
        return report_model
    elif report_model is None: 
        return{"DataBase":None}
    else: 
        return "Something went wrong!"

@router.post("/api/")
async def report_url(request: Request, url: str=Form(...), db: Session = Depends(get_db)):
    if url is not None:
        user_mail=request.session.get("user_email")

        if not user_mail:
            raise login_exception()

        # Save reported URL in the database
        report_entry = Report_URL(url=url, user_email=user_mail)
        db.add(report_entry)
        db.commit()

    return {"message": "Phishing website reported successfully!"}
