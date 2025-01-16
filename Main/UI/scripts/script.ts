// Get the mode switch button
const modeBtn = document.querySelector(".mode") as HTMLButtonElement;

// Get the icons
const sunIcon = document.querySelector<HTMLElement>(
  'ion-icon[name="sunny-outline"]'
);
const moonIcon = document.querySelector<HTMLElement>(
  'ion-icon[name="moon-outline"]'
);

let darkmode = localStorage.getItem("dark");

const enableDark = () => {
  sunIcon?.classList.add("hidden");
  moonIcon?.classList.remove("hidden");
  // Optional: Add logic to switch to dark mode (e.g., set theme class)
  document.documentElement.classList.add("dark");
  localStorage.setItem("dark", "active");
};

const disableDark = () => {
  sunIcon?.classList.remove("hidden");
  moonIcon?.classList.add("hidden");
  // Optional: Add logic to switch to light mode (e.g., set theme class)
  document.documentElement.classList.remove("dark");
  localStorage.setItem("dark", "inactive");
};

if (darkmode === "active") enableDark();
else disableDark();

// Add an event listener to the button
modeBtn.addEventListener("click", () => {
  // Toggle visibility using Tailwind's 'hidden' class
  darkmode = localStorage.getItem("darkmode");
  if (sunIcon?.classList.contains("hidden")) {
    disableDark();
  } else {
    enableDark();
  }
});
