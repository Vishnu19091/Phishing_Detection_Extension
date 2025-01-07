// Get the mode switch button
var modeBtn = document.querySelector(".mode");
// Get the icons
var sunIcon = document.querySelector('ion-icon[name="sunny-outline"]');
var moonIcon = document.querySelector('ion-icon[name="moon-outline"]');
// Check if icons and button exist
if (modeBtn && sunIcon && moonIcon) {
  // Add an event listener to the button
  modeBtn.addEventListener("click", function () {
    // Toggle visibility using Tailwind's 'hidden' class
    if (sunIcon.classList.contains("hidden")) {
      sunIcon.classList.remove("hidden");
      moonIcon.classList.add("hidden");
      // Optional: Add logic to switch to light mode (e.g., set theme class)
      //   document.documentElement.classList.remove("dark");
    } else {
      sunIcon.classList.add("hidden");
      moonIcon.classList.remove("hidden");
      // Optional: Add logic to switch to dark mode (e.g., set theme class)
      //   document.documentElement.classList.add("dark");
    }
  });
} else {
  console.error("Mode switch button or icons not found.");
}
