"use strict";

const urlstatus = document.getElementById("url-status");
const statusblock = document.getElementById("status-block");

// <-------- URL STATUS -------->
function updateStatus() {
  browser.tabs.query({ active: true, lastFocusedWindow: true }).then((tabs) => {
    if (!tabs.length) return;

    let hostname;

    if (new URL(tabs[0].url).href.includes("https")) {
      hostname = new URL(tabs[0].url).hostname;
    } else {
      hostname = "UNKNOWN";
    }

    // console.log(new URL(tabs[0].url).href);

    browser.runtime
      .sendMessage({ type: "GET_STATUS", hostname })
      .then((response) => {
        const statusEl = document.getElementById("url-status");
        let resStatus = response.status;

        statusEl.textContent = `Domain '${hostname}' is ${resStatus}`;

        if (resStatus === "unknown") {
          statusEl.style.color = "purple";
        } else if (resStatus === "danger") {
          statusEl.style.color = "red";
        } else {
          statusEl.style.color = "green";
        }
      });
  });
}

updateStatus();

// <---------- Menu Button modal ---------->
let modal = document.getElementById("menu-modal");
let btn = document.getElementById("modal-btn");
let closeBtn = document.getElementById("close-modal");

// Open modal
btn.addEventListener("click", () => {
  modal.classList.add("show");
  modal.classList.remove("hidden");
});

// Close modal
closeBtn.addEventListener("click", () => {
  modal.classList.remove("show");
  setTimeout(() => modal.classList.add("hidden"), 200);
});

// Close when clicking outside modal content
modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.remove("show");
    setTimeout(() => modal.classList.add("hidden"), 200);
  }
});

// <---------- Extension Pages Navigation Links ---------->
const blockDomain = document.getElementById("block-domain");
blockDomain.addEventListener("click", () => {
  browser.tabs.update({
    url: browser.runtime.getURL("pages/block_domain.html"),
  });
});

const about = document.getElementById("about");
about.addEventListener("click", () => {
  browser.tabs.update({
    url: browser.runtime.getURL("pages/about.html"),
  });
});

const test = document.getElementById("test");
test.addEventListener("click", () => {
  browser.tabs.update({
    url: browser.runtime.getURL("pages/test.html"),
  });
});

const dashboard = document.getElementById("dashboard");
dashboard.addEventListener("click", () => {
  browser.tabs.update({
    url: browser.runtime.getURL("pages/dashboard.html"),
  });
});

/* <---------- Presence of IP indicator block ---------->*/

/**
 * Determines whether IPv4/IPv6

 * is present inside a URL of current user tab

 * @param {*} url

 * @returns ip, ipState, length
 */
function getIPAddresses(url) {
  let ipState = false;
  const combinedIpRegex =
    /(\b25[0-5]|\b2[0-4][0-9]|\b1[0-9]{2}|\b[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])\b|(([0-9a-fA-F]{1,4}:){7}([0-9a-fA-F]{1,4})|([0-9a-fA-F]{1,4}:){1,7}:([0-9a-fA-F]{1,4}:){0,6}([0-9a-fA-F]{1,4})|([0-9a-fA-F]{1,4}:){1,6}(:[0-9a-fA-F]{1,4}){1,7})/g;

  const ip = url.match(combinedIpRegex);

  const length = ip.length;

  ipState = length ? true : false;

  return { ip, ipState, length };
}

const ipblock = document.getElementById("ip-block");
const ipcount = document.getElementById("ip-count");
const ipaddress = document.getElementById("ip-addr");

browser.tabs.query({ active: true }).then((tabs) => {
  let url;
  url = new URL(tabs[0].url).href;

  let ipaddr = getIPAddresses(url);

  if (ipaddr.ipState) {
    ipblock.classList.remove("hidden");
    ipaddress.textContent = ipaddr.ip;
    ipcount.textContent = ipaddr.length;
  } else {
    ipblock.classList.add("hidden");
  }
});
