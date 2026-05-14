"use strict";

// <-------- URL STATUS -------->
function updateStatus() {
  browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
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
        const statusblock = document.getElementById("status-block");

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

  const length = ip.length ? ip.length : 0;

  ipState = length ? true : false;

  return { ip, ipState, length };
}

const ipblock = document.getElementById("ip-block");
const ipcount = document.getElementById("ip-count");
const ipaddress = document.getElementById("ip-addr");

// Get active tab ID first, then read its specific storage entry
browser.tabs.query({ active: true }).then((tabs) => {
  let url;
  url = new URL(tabs[0].url).href;

  let ipaddr = getIPAddresses(url);

  if (ipaddr.ipState) {
    ipblock.classList.remove("hidden");
    ipaddress.textContent = ipaddr.ip;
    ipcount.textContent = ipaddr.length;
    ipblock.style.backgroundColor = "#cc00002f";
  } else {
    ipblock.classList.add("hidden");
  }
});

browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
  const tabId = tabs[0].id;
  const storageKey = `page_links_${tabId}`;

  // Read this tab's stored links
  browser.storage.local.get(storageKey).then((result) => {
    const data = result[storageKey];
    updateLinksUI(data);
  });

  // Ask content script to re-scan fresh
  browser.tabs.sendMessage(tabId, { type: "GET_LINKS" }).catch(() => {});
});

// Listen for fresh scan results
browser.runtime.onMessage.addListener((msg) => {
  if (msg.type === "LINKS_FOUND") {
    updateLinksUI({
      count: msg.count,
      links: msg.links,
      url: msg.url,
    });
  }
});

/**
 * Updates current page links element of the pop_up.html
 * @param {*} data
 * @returns
 */
function updateLinksUI(data) {
  const links_count = document.getElementById("no_of_links");
  if (!links_count || !data || !data.url) return;

  let hostname = data.url;
  let fullUrl = data.url;

  try {
    hostname = new URL(data.url).hostname;
    fullUrl = new URL(data.url).href;
  } catch (error) {
    return;
  }

  links_count.innerHTML = "";
  const message = document.createElement("p");
  message.innerHTML = `Total <span class="text-blue-400">links</span> in <strong class="text-green-400">${new URL(data.url).hostname}</strong><span title="${new URL(data.url)}">(hover me for current page link)</span>: <span class="text-green-400">${data.count}</span>`;
  links_count.appendChild(message);
}
