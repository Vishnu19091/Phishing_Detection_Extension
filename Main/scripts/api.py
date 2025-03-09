from fastapi.middleware.cors import CORSMiddleware

from typing import Optional
from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel, Field

from urllib.parse import urlparse

from page_content_extractor import *
from main import *

import joblib
import sys
import tldextract
import re
import numpy as np

app=FastAPI()


origins = [
    "http://127.0.0.1:5500",  # Your frontend's origin
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # You can specify methods like ["GET", "POST"] if needed
    allow_headers=["*"],  # You can specify headers if needed
)


# Loading multiple models
models_dict = {
    "DecisionTree": joblib.load(r"D:\clg\Project Phase 1\Project\Main\model\modelphishing_detection_model_DecisionTreeClassifier.pkl"),
    "RandomForest": joblib.load(r"D:\clg\Project Phase 1\Project\Main\model\modelphishing_detection_model_RandomForestClassifier.pkl"),
    "ExtraTrees": joblib.load(r"D:\clg\Project Phase 1\Project\Main\model\modelphishing_detection_model_ExtraTreesClassifier.pkl"),
}


# Extracting the features from the URL
def extract_features_single(url):
    parsed = urlparse(url)
    extract = tldextract.extract(url)
    features = [
        len(url),
        len(parsed.netloc),
        parsed.netloc.count('.'),
        1 if parsed.scheme == 'https' else 0,
        len(parsed.path),
        len(extract.domain),
        len(extract.suffix),
        url.count('-'),
        url.count('@'),
        url.count('//'),
        len(parsed.query),
        url.count('www'),
        1 if re.search(r'\d', parsed.netloc) else 0,
        len(max(re.findall(r'[a-zA-Z]+', parsed.netloc),key=len, default='')),
        1 if re.match(r'\d+\.\d+\.\d+\.\d+', parsed.netloc) else 0,
        url.count('http'),
        sum(c.isdigit() for c in url),
        1 if any(tld in url for tld in ['.com', '.org', '.net', '.int', '.edu', '.gov', '.mil']) else 0,
        1 if len(extract.subdomain) > 0 else 0,
        len(re.findall(r'[^a-zA-Z0-9]', url))  # Count of special characters
    ]
    return features

# Applying machine models to predict and classify the URL
def classify_url(url):
    features = extract_features_single(url)
    predictions = []
    for model_name, model in models_dict.items():
        pred = model.predict([features])[0]
        predictions.append(pred)
    
    # Majority voting
    benign_count = predictions.count(0)
    phishing_count = predictions.count(1)
    defacement_count = predictions.count(2)
    malware_count=predictions.count(3)
    
    if benign_count > phishing_count and benign_count > defacement_count:
        return "Benign"
    elif phishing_count > benign_count and phishing_count > defacement_count :
        return "Phishing"
    elif defacement_count > benign_count and defacement_count > phishing_count:
        return "Phishing"
    elif malware_count > benign_count and malware_count > phishing_count:
        return "Malware"
    else:
        return

@app.get("/")
async def index():
        return {"Welcome-Message":"Welcome to the Phishing Detection API"}

Link:str=None

# Prediction using query parameter
@app.get("/predict/")
async def predict(predict_url:str):
    result= classify_url(predict_url)
    Link=predict_url
    if result:
        flag=True
    else:
        flag=False
    
    message=None
    if result=="Benign":
        message="The URL is trustable you can visit."
    elif result=='Defacement':
        message="!The given URL might be Defacement or Phishing proceed with caution!"
    elif result=='Phishing':
        message="!The given URL might be Phishing or Defacement proceed with caution!"

    if predict_url and flag==True:
        return {"URL Status":flag, "Results":f"The URL \'{predict_url}\' is {result}", "Message": message}
    elif not predict_url:
        return {"URL Status":flag,"Message":"Please enter the URL"}
    elif flag!=True:
        return "Something went wrong!"
    
@app.get("/predict/merged_links/")
async def display_merged_links(url:str):
    mergedlinks= ltohtml(url)
    return {"Links merged":mergedlinks}

#Display all users :::: modify this later should visible only to admin or display total no.of users
@app.get("/users/")
async def read_all(db: Session = Depends(get_db)):
    return db.query(models.Users).all()

# Search user by Name, Displays only authenticated users
@app.get("/users/{user_name}")
async def get_user_by_name(user_name: str, db: Session= Depends(get_db)):
    user_model= db.query(models.Users).filter(models.Users.user_name==user_name).first()
    if user_model is not None:
        return user_model
    return f"{user_name} NOT FOUND, try another name😔"

#Create user
@app.post("/")
async def create_user(user: User, db: Session=Depends(get_db)):
    user_model=models.Users()
    if user_model:
        user_model.user_name=user.user_name
        user_model.user_mail=user.user_mail
        user_model.country=user.country
        user_model.is_active=user.is_active
        
        db.add(user_model)
        db.commit()
        return successful_response(200)
    else:
        raise http_exception()

#Modify user's DataBase
@app.put("/{user_name}")
async def update_user(user_name: str, user:User, db:Session=Depends(get_db)):
    user_model=db.query(models.Users).filter(models.Users.user_name==user_name).first()
    
    if user_model is None:
        raise http_exception()
    
    user_model.user_name=user.user_name
    user_model.user_mail=user.user_mail
    user_model.country=user.country
    user_model.is_active=True

    db.add(user_model)
    db.commit()
    
    return successful_response(200)

#Delete user by name
@app.delete("/{user_name}")
async def delete_user_by_name(user_name: str, db: Session=Depends(get_db)):
    user_model=db.query(models.Users).filter(models.Users.user_name == user_name).first()
    
    if user_model is None:
        return f"{user_name} NOT FOUND 😔"
    
    db.query(models.Users).filter(models.Users.user_name == user_name).delete()
    db.commit()

    return successful_response(200)