"use strict";

const params = new URLSearchParams(window.location.search);
const site = params.get("site");

document.getElementById("site").textContent = `Blocked URL: ${site}`;

document.getElementById("close").addEventListener("click", close());

function close() {
  let currentTab;
  browser.tabs.query({ active: true, currentWindow: true }, (tabs) => {});
}
