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

const width: number = window.innerWidth;

function showBrowserWidth(): void {
  const height: number = window.innerHeight;
  const res = document.querySelector(".resolution") as HTMLElement;
  res.innerText = `Width: ${width}px, Height: ${height}px`;
}
window.onload = showBrowserWidth;
window.onresize = showBrowserWidth;

const modalbtn = document.getElementById("modal-btn") as HTMLButtonElement;

const modalopen = document.querySelector<HTMLElement>(
  'ion-icon[name="grid-outline"]'
);

const modalclose = document.querySelector<HTMLElement>(
  'ion-icon[name="close-outline"]'
);
const navbtn = document.querySelector(".mnav") as HTMLElement;

// console.log(width, height);

const enablemodal = () => {
  modalopen?.classList.add("hidden"); // Hide the open icon
  modalclose?.classList.remove("hidden"); // Show the close icon
  navbtn.classList.add("mobile-nav");
  navbtn.classList.remove("hidden");
};

const disablemodal = () => {
  modalopen?.classList.remove("hidden"); // Show the open icon
  modalclose?.classList.add("hidden"); // Hide the close icon
  navbtn.classList.add("hidden");
  navbtn.classList.remove("mobile-nav");
};

// Add an event listener for toggling the modal

if ((width == 360 || width == 640 || width == 768 || width == 980) && navbtn) {
  navbtn.classList.add("hidden");
  navbtn.classList.remove("mobile-nav");

  modalbtn.addEventListener("click", () => {
    if (modalopen?.classList.contains("hidden")) {
      disablemodal();
    } else {
      enablemodal();
    }
  });
} else {
  navbtn.classList.add("hidden");
}

window.addEventListener("pagehide", (event: PageTransitionEvent) => {
  if (event.persisted) {
    console.log("Page is being saved into the bfcache");
  }
});

window.addEventListener("pageshow", (event: PageTransitionEvent) => {
  if (event.persisted) {
    console.log("Page was restored from the bfcache");
  }
});
