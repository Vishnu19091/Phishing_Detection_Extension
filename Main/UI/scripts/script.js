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
var width = window.innerWidth;
function showBrowserWidth() {
    var height = window.innerHeight;
    var res = document.querySelector(".resolution");
    res.innerText = "Width: ".concat(width, "px, Height: ").concat(height, "px");
}
window.onload = showBrowserWidth;
window.onresize = showBrowserWidth;
var modalbtn = document.getElementById("modal-btn");
var modalopen = document.querySelector('ion-icon[name="grid-outline"]');
var modalclose = document.querySelector('ion-icon[name="close-outline"]');
var navbtn = document.querySelector(".mnav");
// console.log(width, height);
var enablemodal = function () {
    modalopen === null || modalopen === void 0 ? void 0 : modalopen.classList.add("hidden"); // Hide the open icon
    modalclose === null || modalclose === void 0 ? void 0 : modalclose.classList.remove("hidden"); // Show the close icon
    navbtn.classList.add("mobile-nav");
    navbtn.classList.remove("hidden");
};
var disablemodal = function () {
    modalopen === null || modalopen === void 0 ? void 0 : modalopen.classList.remove("hidden"); // Show the open icon
    modalclose === null || modalclose === void 0 ? void 0 : modalclose.classList.add("hidden"); // Hide the close icon
    navbtn.classList.add("hidden");
    navbtn.classList.remove("mobile-nav");
};
// Add an event listener for toggling the modal
if ((width == 360 || width == 640 || width == 768 || width == 980) && navbtn) {
    navbtn.classList.add("hidden");
    navbtn.classList.remove("mobile-nav");
    modalbtn.addEventListener("click", function () {
        if (modalopen === null || modalopen === void 0 ? void 0 : modalopen.classList.contains("hidden")) {
            disablemodal();
        }
        else {
            enablemodal();
        }
    });
}
else {
    navbtn.classList.add("hidden");
}
