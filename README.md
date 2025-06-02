# Phishing Detection with Machine Learning Integration

### This is a browser extension-based project that detects phishing websites in real-time and alerts the user.

# Introduction

---

This work presents a **real-time phishing detection system** that integrates machine learning models to effectively identify and prevent phishing attacks, spam, and defaced websites. The system is **designed to analyze key URL features** such as:

- URL length
- Domain and subdomain structure
- Numeric and special characters
- HTTPS presence

The system is implemented as a **browser extension** with features like:

- Total number of scans
- Number of phishing websites detected
- Ability for authenticated users to manually report spam websites

# 📼Project DEMO

---

![ScreenShot-1](Presentation/Screenshot_2.png)

<br/>

![ScreenShot-2](Presentation/Screenshot_1.png)

<br/>

![ScreenShot-3](Presentation/Screenshot_3.png)

<br/>

# 💫 Features of the system

---

- All Phishing Detection is done via a **FastAPI** backend.

- **Authenticated Users** can report a Malicious URL in the extension.

- Reported URLs are then used in the model to **retrain and enhance prediction**.

- Authenticated Users can **track their activity via a dashboard**.

# ⚙️ Tools and Frameworks

---

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

- SQLite3 (local)
- PostgreSQL(production)
</div>

# 🧑🏻‍💻 Installation on local machine

---

### Initializing Backend Server

The backend server runs on Python, so we must install the libraries.

- Before installing libraries, create a venv.

```bash
python -m venv venv-name
```

- After executing the above line.

- Activate the venv and install requirements.

- To **install Python dependencies**, find the **requirements.txt** file, then go to the directory where the file is located run the below line in the terminal.

```bash
pip install -r requirements.txt
```

- Navigate to **/Main/scripts/** then execute below line to run the server.

```bash
uvicorn main:app --port 8000
```

> 📌**Remember the server only runs on localhostport:8000**

#### ⚠️ Issues

- If Database issues arise at the initial stage, create a directory named **'Database'**. Then try to run the server.

> For OAuth issues. Add the Oauth credentials **(Client ID & Secret) which is created by you from [Google Cloud Account](https://console.cloud.google.com/)🙂.** Then store the credentials in the '.env' file. To those who don't know how to set up Oauth Credentials [click here](https://youtu.be/TjMhPr59qn4?si=fF22b_77npApIcur).
> <br/>

# Conclusion

---

This system offers a sophisticated approach to mitigating the risks associated with phishing attacks. That's all

<h1 style="text-align:center;">Thank you</h1>
