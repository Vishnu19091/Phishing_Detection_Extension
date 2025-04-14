////// fetch user info \\\\\\\
const req = chrome.storage.local.get(["profile"], (data) => {
  const user_profile = data.profile;
  document.getElementById("user_profile").src = user_profile;
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
  }
});
