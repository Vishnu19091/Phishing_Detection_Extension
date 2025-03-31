// Get the mode switch button
var modeBtn = document.querySelector(".mode");
// Get the icons
var sunIcon = document.querySelector('ion-icon[name="sunny-outline"]');
var moonIcon = document.querySelector('ion-icon[name="moon-outline"]');
var darkmode = localStorage.getItem("dark");
var enableDark = function () {
  sunIcon === null || sunIcon === void 0
    ? void 0
    : sunIcon.classList.add("hidden");
  moonIcon === null || moonIcon === void 0
    ? void 0
    : moonIcon.classList.remove("hidden");
  // Optional: Add logic to switch to dark mode (e.g., set theme class)
  document.documentElement.classList.add("dark");
  localStorage.setItem("dark", "active");
};
var disableDark = function () {
  sunIcon === null || sunIcon === void 0
    ? void 0
    : sunIcon.classList.remove("hidden");
  moonIcon === null || moonIcon === void 0
    ? void 0
    : moonIcon.classList.add("hidden");
  // Optional: Add logic to switch to light mode (e.g., set theme class)
  document.documentElement.classList.remove("dark");
  localStorage.setItem("dark", "inactive");
};
if (darkmode === "active") enableDark();
else disableDark();
// Add an event listener to the button
modeBtn.addEventListener("click", function () {
  // Toggle visibility using Tailwind's 'hidden' class
  darkmode = localStorage.getItem("darkmode");
  if (
    sunIcon === null || sunIcon === void 0
      ? void 0
      : sunIcon.classList.contains("hidden")
  ) {
    disableDark();
  } else {
    enableDark();
  }
});
var modalbtn = document.getElementById("modal-btn");
var modalopen = document.querySelector('ion-icon[name="grid-outline"]');
var modalclose = document.querySelector('ion-icon[name="close-outline"]');
var navbtn = document.querySelector(".mnav");
// console.log(width, height);
var enablemodal = function () {
  modalopen === null || modalopen === void 0
    ? void 0
    : modalopen.classList.add("hidden"); // Hide the open icon
  modalclose === null || modalclose === void 0
    ? void 0
    : modalclose.classList.remove("hidden"); // Show the close icon
  navbtn.classList.add("mobile-nav");
  navbtn.classList.remove("hidden");
};
var disablemodal = function () {
  modalopen === null || modalopen === void 0
    ? void 0
    : modalopen.classList.remove("hidden"); // Show the open icon
  modalclose === null || modalclose === void 0
    ? void 0
    : modalclose.classList.add("hidden"); // Hide the close icon
  navbtn.classList.add("hidden");
  navbtn.classList.remove("mobile-nav");
};
// Add an event listener for toggling the modal
if (navbtn) {
  navbtn.classList.add("hidden");
  navbtn.classList.remove("mobile-nav");
  modalbtn.addEventListener("click", function () {
    if (
      modalopen === null || modalopen === void 0
        ? void 0
        : modalopen.classList.contains("hidden")
    ) {
      disablemodal();
    } else {
      enablemodal();
    }
  });
} else {
  navbtn.classList.add("hidden");
}
// Result API
var result_text = document.getElementById("scan_result");
var url = "http://127.0.0.1:8000/predict/?predict_url=";
let response = "";

const result_obj = {
  URL_Status: undefined,
  Results: undefined,
  Message: undefined,
};

const fetch_results = function (url) {
  fetch(`http://127.0.0.1:8000/predict/?predict_url=${url}`)
    .then(function (response) {
      return response.json();
    })
    .then((data) => {
      result_obj.URL_Status = data["URL Status"];
      result_obj.Message = data["Message"];
      result_obj.Results = data["Results"];
      console.log(result_obj);
      result_text.innerText = result_obj.Message;
    });
};

// fetch_results(url);

// Scroll adjustment
document.addEventListener("DOMContentLoaded", function () {
  var targetIds = ["#id1", "#id2", "#id3", "#id4"];
  document.querySelectorAll("a[href]").forEach(function (anchor) {
    var targetId = anchor.getAttribute("href");
    if (targetId && targetIds.indexOf(targetId) !== -1) {
      // Replacing includes() with indexOf()
      anchor.addEventListener("click", function (event) {
        event.preventDefault();
        var targetElement = document.querySelector(targetId);
        if (targetElement) {
          var offset = 65;
          var elementPosition =
            targetElement.getBoundingClientRect().top + window.scrollY;
          window.scrollTo({
            top: elementPosition - offset,
            behavior: "smooth",
          });
        }
      });
    }
  });
});

////// Login button \\\\\\

document.addEventListener("DOMContentLoaded", function () {
  const logButton = document.getElementById("login-btn");

  async function fetchUserInfo() {
    try {
      const response = await fetch("http://localhost:8000/oauth/api/user", {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("User not logged in");
      }

      const data = await response.json();

      // Show user info
      document.getElementById("user-info").style.display = "block";
      document.getElementById("user-name").textContent = data.name;

      // Update button text
      logButton.textContent = "Logout";
    } catch (error) {
      console.error("Error fetching user info:", error);
      logButton.textContent = "Login";
    }

    // Attach event listener based on updated button text
    logButton.addEventListener("click", function () {
      if (logButton.textContent === "Login") {
        window.location.href = "http://localhost:8000/oauth/login";
      } else {
        window.location.href = "http://localhost:8000/oauth/logout";
      }
    });
  }

  fetchUserInfo(); // Fetch user info on page load
});

////// Report URL using API \\\\\\
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("report-form");
  const messageBox = document.getElementById("message");

  form.addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent page refresh

    const url = document.getElementById("url").value.trim();
    if (!url) {
      messageBox.textContent = "Please enter a valid URL!";
      messageBox.style.color = "red";
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/report/api/", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        credentials: "include",
        body: new URLSearchParams({ url }), // Sending in form-urlencoded format
      });

      const data = await response.json();
      messageBox.textContent =
        data.message || "Phishing website reported successfully!";
      messageBox.style.color = response.ok ? "green" : "red";
    } catch (error) {
      console.error("Error:", error);
      messageBox.textContent = "Failed to report URL.";
      messageBox.style.color = "red";
    }

    // Show message and fade out after 3 seconds
    messageBox.style.opacity = "1";
    messageBox.style.transition = "opacity 1s";
    setTimeout(() => {
      messageBox.style.opacity = "0";
    }, 2000); // Wait 2 sec, then fade out in 1 sec

    // Reset message after fade-out completes
    setTimeout(() => {
      messageBox.textContent = "";
      messageBox.style.opacity = "1"; // Reset opacity for next submit
    }, 3000);
  });
});

//////////////////////////////////
