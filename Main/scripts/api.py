from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
from pydantic import BaseModel,Field
from uuid import UUID, uuid4
from page_content_extractor import *

import joblib
import sys
from urllib.parse import urlparse
import tldextract
import re
import numpy as np
import sqlite3

app=FastAPI()

def create_connection():
    connection = sqlite3.connect("D:/clg/Project Phase 1/Project/Main/database/books.db")
    return connection

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
models = {
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
    for model_name, model in models.items():
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
async def index(request:Request):
    if request:
        return {"Welcome-Message":"Welcome to the Phishing Detection API"}
    else:
        raise TimeoutError

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

#BaseModel for Users
class User(BaseModel):
    ID: UUID=Field(default_factory=uuid4)
    Name: str=Field(min_length=1, max_length=30)
    Date_Joined: str=Field(min_length=1, max_length=10)
    Country: str

    model_config={
        "json_schema_extra":{
            "example":{
                "ID":"f918d73c-287f-43fe-b99b-6dcb750594b4",
                "Name":"admin",
                "Date_Joined":"27/02/2025",
                "Country":"India"
            }
        },
        "from_attributes": True
    }


@app.get("/users/all/")
async def get_all_users():
    def get_users():
        connection=create_connection()
        cursor=connection.cursor()
        cursor.execute("SELECT * FROM Users")
        books=cursor.fetchall()
        res=[]
        for book in books:
            res.append(book)
        connection.close()
        return res
    return get_users()

# Add user
@app.post("/")
async def create_user(user:User):  
    return user

"""
#Display particular authenticated users only to admin
@app.get("/users/{user_name}")
async def get_users(user_name:str):
    for user in user_db:
        if user.Name == user_name:
            return {
                f"{user.Name} Found": "Details",
                "ID": user.ID,
                "Country": user.Country,
                "Date Joined": user.ID
                }
    else:
        return f"{user_name} NOT FOUND, try another name😔"

#Display authenticated user's database to user
@app.get("/users/{user_name}/phish_db/")
async def display_users_phish_db(user_name:str):
    for user in user_db:
        if user.Name == user_name:
            return {
                f"Details of {user.Name}'s Database": {
                "ID": user.ID,
                "Date Joined": user.ID,
                "DataBase's Logs": "Log" # Display first 10 database's logs of the user
            }}
    else:
        return f"{user_name} was NOT FOUND!"

"""