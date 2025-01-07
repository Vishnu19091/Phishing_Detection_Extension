#Importing requied Libraries
import joblib
import sys
from urllib.parse import urlparse
import tldextract
import re
import numpy as np

# Loading multiple models
models = {
    "DecisionTree": joblib.load(r"D:\clg\Project Phase 1\Project\Main\model\modelphishing_detection_model_DecisionTreeClassifier.pkl"),
    "RandomForest": joblib.load(r"D:\clg\Project Phase 1\Project\Main\model\modelphishing_detection_model_RandomForestClassifier.pkl"),
    "ExtraTrees": joblib.load(r"D:\clg\Project Phase 1\Project\Main\model\modelphishing_detection_model_ExtraTreesClassifier.pkl")
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

    print(f'benign_count: {benign_count}, phishing_count: {phishing_count}, defacement_count: {defacement_count}, malware_count: {malware_count}, predictions: {predictions}')
    
    if benign_count > phishing_count and benign_count > defacement_count:
        return "Benign"
    elif phishing_count > benign_count and phishing_count > defacement_count:
        return "Phishing"
    elif defacement_count > benign_count and defacement_count > phishing_count:
        return "Defacement"
    else:
        # In case of a tie, return the more severe classification
        if phishing_count == defacement_count:
            return "Phishing"
        elif phishing_count == benign_count:
            return "Phishing"
        else:
            return "Defacement"

if __name__ == "__main__":
    if len(sys.argv) > 1:
        url = sys.argv[1]
        try:
            result = classify_url(url)
            print(end='\n\n')
            print(f"The URL {url} is classified as: {result}")
            if result=='Benign':
                print(f"The URL is trustable you can visit.")
            elif result=='Defacement':
                print(f"!The given URL might be Defacement or Phishing proceed with caution!")
            elif result=='Phishing':
                print(f"!The given URL might be Phishing or Defacement proceed with caution!")
        except Exception as e:
            print(f"An error occurred: {str(e)}")
    else:
        print("Please provide a 'URL' as a command-line argument.")

    print(end='\n\n')
    