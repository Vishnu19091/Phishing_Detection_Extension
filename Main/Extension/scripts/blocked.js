"use strict";

const params = new URLSearchParams(window.location.search);
const site = params.get("site");

document.getElementById("site").textContent = `Blocked URL: ${site}`;
