////// fetch user info \\\\\\\

const statusblock = document.getElementById("url-status");

const fetch_results = function (url) {
  fetch(
    `https://samp-fast-api.onrender.com/predict-api/url/?predict_url=${url}`
  )
    .then((res) => res.json())
    .then((data) => {
      let result_obj = {
        URL_Status: data["URL Status"],
        Results: data["Message"],
        Message: data["Results"],
      };
      statusblock.textContent = `${result_obj.Message}`;
      statusblock.style.color = "#3b82f6 ";
    });
};

chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  const currentTab = tabs[0];
  const currentURL = currentTab.url;

  fetch_results(currentURL);
});

const req = chrome.storage.local.get(["profile"], (data) => {
  const user_profile = data.profile;
  document.getElementById("user_profile").src = user_profile;
  if (user_profile) {
    document.getElementById("user-status").style.display = "none";
  } else document.getElementById("user-status").style.display = "flex";
});
//////////////////////////////////

document.addEventListener("DOMContentLoaded", () => {
  const docsBtn = document.getElementById("docs-btn");
  const reportBtn = document.getElementById("report-btn");
  const dashBtn = document.getElementById("dashboard-btn");
  const authbtn = document.getElementById("auth-btn");

  if (docsBtn) {
    docsBtn.addEventListener("click", () => {
      chrome.tabs.update({ url: "https://anti-phish.netlify.app/docs" });
    });
  }

  if (reportBtn) {
    reportBtn.addEventListener("click", () => {
      chrome.tabs.update({ url: "https://anti-phish.netlify.app/report" });
    });
  }

  if (dashBtn) {
    dashBtn.addEventListener("click", () => {
      chrome.tabs.update({ url: "https://anti-phish.netlify.app/dashboard" });
    });
  }
  if (authbtn) {
    authbtn.addEventListener("click", () => {
      chrome.tabs.update({ url: "https://anti-phish.netlify.app/" });
    });
  } else return;
});
