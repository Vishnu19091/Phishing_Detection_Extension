// Get the mode switch button
var modeBtn = document.querySelector(".mode");
// Get the icons
var sunIcon = document.querySelector('ion-icon[name="sunny-outline"]');
var moonIcon = document.querySelector('ion-icon[name="moon-outline"]');
var darkmode = localStorage.getItem("dark");
var enableDark = function () {
    sunIcon === null || sunIcon === void 0 ? void 0 : sunIcon.classList.add("hidden");
    moonIcon === null || moonIcon === void 0 ? void 0 : moonIcon.classList.remove("hidden");
    // Optional: Add logic to switch to dark mode (e.g., set theme class)
    document.documentElement.classList.add("dark");
    localStorage.setItem("dark", "active");
};
var disableDark = function () {
    sunIcon === null || sunIcon === void 0 ? void 0 : sunIcon.classList.remove("hidden");
    moonIcon === null || moonIcon === void 0 ? void 0 : moonIcon.classList.add("hidden");
    // Optional: Add logic to switch to light mode (e.g., set theme class)
    document.documentElement.classList.remove("dark");
    localStorage.setItem("dark", "inactive");
};
if (darkmode === "active")
    enableDark();
else
    disableDark();
// Add an event listener to the button
modeBtn.addEventListener("click", function () {
    // Toggle visibility using Tailwind's 'hidden' class
    darkmode = localStorage.getItem("darkmode");
    if (sunIcon === null || sunIcon === void 0 ? void 0 : sunIcon.classList.contains("hidden")) {
        disableDark();
    }
    else {
        enableDark();
    }
});
