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
//////////////////////////////////

////// Predict URL API \\\\\\
var result_text = document.getElementById("scan_result");

const result_obj = {
  URL_Status: undefined,
  Results: undefined,
  Message: undefined,
};

const fetch_results = function (url) {
  fetch(
    `https://samp-fast-api.onrender.com/predict-api/url/?predict_url=${url}`
  )
    .then(function (response) {
      return response.json();
    })
    .then((data) => {
      result_obj.URL_Status = data["URL Status"];
      result_obj.Message = data["Message"];
      result_obj.Results = data["Results"];
      console.log(result_obj);
      result_text.innerText = `${result_obj.Message} ${result_obj.Results}`;
      result_text.style.outline = "2px solid green";
      result_text.style.padding = "10px";
      result_text.style.borderRadius = "5px";
      result_text.style.maxWidth = "auto";
    });
};
//////////////////////////////////

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
      const response = await fetch(
        "https://samp-fast-api.onrender.com/oauth/api/user",
        {
          method: "GET",
        }
      );

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
        window.location.href = "https://samp-fast-api.onrender.com/oauth/login";
      } else {
        window.location.href =
          "https://samp-fast-api.onrender.com/oauth/logout";
      }
    });
  }

  fetchUserInfo(); // Fetch user info on page load
});
//////////////////////////////////
