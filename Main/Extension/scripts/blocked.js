"use strict";

const params = new URLSearchParams(window.location.search);
const site = params.get("site");

const url = document.getElementById("url");

url.textContent = `${site}`;

url.style.fontSize = "2rem";
url.style.color = "black";
