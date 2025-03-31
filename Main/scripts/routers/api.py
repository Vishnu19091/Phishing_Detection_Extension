import sys
sys.path.append("..")
from fastapi import APIRouter
from database import SessionLocal
from urllib.parse import urlparse

from page_content_extractor import *
from exception import *
from collections import Counter

import joblib
import sys
import tldextract
import re

router=APIRouter(prefix="/predict-api",tags=["predict-api"])


def get_db():
    try:
        db=SessionLocal()
        yield db
    finally:
        db.close()


# Loading multiple models
models_dict = {
    "AdaBoostClassifier":joblib.load(r"D:\clg\Project Phase 1\Project\Main\model\AdaBoostClassifier_model.pkl"),
    "DecisionTree": joblib.load(r"D:\clg\Project Phase 1\Project\Main\model\DecisionTreeClassifier_model.pkl"),
    "ExtraTrees": joblib.load(r"D:\clg\Project Phase 1\Project\Main\model\ExtraTreesClassifier_model.pkl"),
    "GaussianNB":joblib.load(r"D:\clg\Project Phase 1\Project\Main\model\GaussianNB_model.pkl"),
    "KNeighborsClassifier":joblib.load(r"D:\clg\Project Phase 1\Project\Main\model\KNeighborsClassifier_model.pkl"),
    "RandomForest": joblib.load(r"D:\clg\Project Phase 1\Project\Main\model\RandomForestClassifier_model.pkl"),
    "SGDClassifier":joblib.load(r"D:\clg\Project Phase 1\Project\Main\model\SGDClassifier_model.pkl")
}


# Extracting the features from the URL
def extract_features_single(url):
    parsed = urlparse(url)
    extract = tldextract.extract(url)
    words = re.findall(r'[a-zA-Z]+', parsed.netloc)
    longest_word_length = len(max(words, key=len)) if words else 0
    
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
        longest_word_length,
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
    predictions = [model.predict([features])[0] for model in models_dict.values()]

    # Use Counter to determine the most common prediction
    most_common = Counter(predictions).most_common(1)
    if most_common:
        label, _ = most_common[0]
        return {0: "Benign", 1: "Phishing", 2: "Defacement", 3: "Malware"}.get(label, "Uncertain")
    return "Uncertain"

Link:str=None

# Prediction using query parameter
@router.get("/url/")
async def predicturl(predict_url:str=None):
    if not predict_url:
        return url_http_exception()

    result = classify_url(predict_url)
    message = {
        "Benign": "The URL is trustable, you can visit.",
        "Defacement": "!The given URL might be Defacement or Phishing, proceed with caution!",
        "Phishing": "!The given URL might be Phishing or Defacement, proceed with caution!",
        "Malware": "!The given URL might contain Malware, avoid visiting!",
        "Uncertain": "The system is unable to classify this URL."
    }.get(result, "Something went wrong!")

    return {
        "URL Status": result != "Uncertain",
        "Results": f"The URL '{predict_url}' is classified as {result}",
        "Message": message
    }
    
@router.get("/merged_links/")
async def display_merged_links(url:str=None):
    if not url:
        return url_http_exception()
    
    mergedlinks= ltohtml(url)
    return {"Links merged":mergedlinks}

