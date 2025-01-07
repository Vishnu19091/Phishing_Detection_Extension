// Get the mode switch button
const modeBtn = document.querySelector(".mode") as HTMLButtonElement;

// Get the icons
const sunIcon = document.querySelector<HTMLElement>(
  'ion-icon[name="sunny-outline"]'
);
const moonIcon = document.querySelector<HTMLElement>(
  'ion-icon[name="moon-outline"]'
);

// Check if icons and button exist
if (modeBtn && sunIcon && moonIcon) {
  // Add an event listener to the button
  modeBtn.addEventListener("click", () => {
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
