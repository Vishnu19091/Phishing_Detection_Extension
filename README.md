# Phishing Detection with Machine Learning integration

### This is a browser extension based project which detects phishing websites in real-time and alerts the user.

### Table of Contents:

1. [Introduction](#introduction)

2. [Project Demo](#project-demo)

3. [Goal of the system](#goal-of-the-system)

4. [Features of the system](#features-of-the-system)

5. [Tools and Frameworks](#tools-and-frameworks)

6. [Installation on local machine](#installation-on-local-machine)

7. [Conclusion](#conclusion)

# Introduction

---

### **What is Phishing & Anti-Phishing ?**

<div style="width:85%;">

- **Phishing** refers to the fraudulent practice of sending fake messages or creating deceptive websites that mimic legitimate ones to lure users into disclosing sensitive information, such as usernames, passwords, and credit card details.

- **Anti-Phishing** refers to the measures and technologies designed to detect and prevent phishing attacks, which are deceptive attempts to steal sensitive information like passwords, credit card details, or personal data.

</div>

<div >

This work presents a **real-time phishing detection system** that integrates machine learning models to effectively identify and prevent phishing attacks, spam, and defaced websites. The system is **designed to analyze various key URL features such as length, domain, subdomain, numeric characters, special characters, and the presence of HTTPS, providing a comprehensive approach to phishing detection.**

Also the system will be used as browser extension with some features like: **total no.of scan, no.of phishing websites detected and authenticated users are allowed to report spam websites manually.**

</div>

# Project Demo

Will be added soon.

[![Project demonstration](https://raw.githubusercontent.com/Vishnu19091/yourrepository/main/assets/thumbnail.jpg)](https://raw.githubusercontent.com/Vishnu19091/yourrepository/main/assets/video.mp4)

<br/>

# Goal of the system

- Detect & alert the phishing website.
- Update reported websites to the database as well as ML model training data.

Will be added soon.

# Features of the system

Will be added soon.

<div id="tools-and-frameworks">
<h1 style="margin-bottom: 0;">Tools and Frameworks</h1>
<h3  style="margin-top: 0;margin-bottom: 1rem;">Front-end languages & frameworks used</h3>

- HTML
- CSS
- JavaScript
- TailwindCSS

<h3  style="margin-top: 0;margin-bottom: 1rem;">Back-end languages & libraries used</h3>

- Python
- Pandas
- NumPy
- FastAPI

<h3 style="margin-top: 0;margin-bottom: 1rem;">DataBase used</h3>

- SQLite3
</div>

## Installation on local machine

### Initializing Backend Server

Backend requires several Python Dependencies.

- Before installing libraries create venv

```bash
python -m venv venv-name
```

- After executing the above line.
- Activate the venv and install requirements.

- To **install python dependencies**, find the **requirements.txt** file, then run the below line in the terminal.

```bash
pip install -r requirements.txt
```

- Navigate to **/Main/scripts/** then execute the below line to run the server.

```bash
uvicorn api:app --port 8000
```

**Remeber the server only runs on localhostport:8000**

> If DataBase issues arise at initial stage, create dir name **'Database'**. Then try again running the server.

<br/>

# Conclusion

This system offers a sophisticated approach to mitigating the risks associated with phishing attacks. That's all

<h1 style="text-align:center;">Thank you</h1>
