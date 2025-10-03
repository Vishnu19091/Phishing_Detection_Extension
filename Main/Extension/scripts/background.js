"use strict";
import { TabChange } from "./rules/tab_rules.js";
import { getIPAddresses } from "./rules/url_rules.js";

/* 
In this file you have to write the logic that communicates
to nodejs server and that server communicates to the google safe browsing api

it simply forwards the response of the GSB API, because to secure API_KEY


- **Length** → URLs longer than 100–150 chars are suspicious. ✅ done

- **Special Characters** → `@`, `-`, `=`, `?`, multiple `//`. ✅ done

- **IP Address in URL** → `http://192.168.0.1/...` instead of domain name.✅ done

- **Too Many Subdomains** → `login.secure.bank.fake.com`.

// these two things will be handled by GSB API
- **Misspelled Brand Names** → e.g., `paypa1.com`, `g00gle.net`. ✅ done

- **Top-Level Domain Check** → Free TLDs like `.tk`, `.ml`, `.ga`, `.cf`, `.gq` are often used in phishing.✅ done
*/

/*
blocks specified url

TODO: send current url to gsb API and
if not malicious then allow loading
the request else don't load it.
*/

/** Makes a request to a nodejs server

 * to fetch the result a webRequest
 * @param {*} url 

 * @returns Safe / Danger
 */
export async function isPhish(url) {
  if (!url) return null;

  try {
    const res = await fetch("http://127.0.0.1:4000/check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });

    const data = await res.json();
    // console.log(data.result);
    return data.result.status;
  } catch {
    console.error("Something went Wrong!");
  }

  return;
}

let cache = {};

/** Updates Cache for tab
 * that is the fetched result from the nodejs server is stored
 * in a variable because the we want to block the requests made
 * from the browser based on the status
 * @param {*} tabId
 * @param {*} changeInfo
 * @param {*} tab
 */
async function updateCacheForTab(tabId, changeInfo, tab) {
  if (tab.active && tab.url && /^https?:/i.test(tab.url)) {
    const hostname = new URL(tab.url).hostname;
    const status = await isPhish(tab.url);
    cache[hostname] = status;
    // console.log(`Cached ${hostname} → ${status}`);
  }
}

// message listener to send status to pop_up html
browser.runtime.onMessage.addListener((message, sender, sendReponse) => {
  if (message.type === "GET_STATUS") {
    const host = message.hostname;

    // Add extension to avoid status conflict
    const status = cache[host] || "unknown";

    sendReponse({ status });
  }

  return true;
});

// fired when tab is switched
// browser.tabs.onActivated.addListener((activeInfo) => {
//   browser.tabs
//     .get(activeInfo.tabId)
//     .then((tab) => updateCacheForTab(activeInfo.tabId, {}, tab));
// });

// fires when url changes
browser.tabs.onUpdated.addListener(updateCacheForTab);

/* This function only works synchronously no async*/
// const { res, containsIP } = getIPAddresses(requestDetails.url);
function blockRequest(requestDetails) {
  // Store the status of current url and cache it from gsb api
  // then do actions based on the status

  const url = requestDetails.url;
  const host = new URL(url).hostname;

  // Fix when the extension detects the phishing url it captures
  // extension id as its hostname
  if (cache[host] === "danger") {
    const redirectURL = browser.runtime.getURL(
      `blocked.html?site=${requestDetails.url}`
    );

    // console.log(`Redirecting to ${redirectURL}`);
    console.log(`Current request to \'${url}\' is blocked`);

    // blocks loading the phish url and loads the blocked html page
    browser.tabs.update(requestDetails.tabId, { url: redirectURL });
    return { cancel: true };
  }

  return {}; // Allow the request
}

/*
<---------- [IMPORTANT] ---------->
Listener function watches for blocked requests
blocks the request before requesting to endpoint
*/
browser.webRequest.onBeforeRequest.addListener(
  blockRequest,

  /* Manual Testing */
  // function (details) {
  //   console.log(
  //     "This is message is from before request function & Requested URL:",
  //     [details.url]
  //   );
  // },
  { urls: ["<all_urls>"] }, // Listen for all URLs
  ["blocking"] // Required to modify or cancel requests
);

// Detects new tab
browser.tabs.onActivated.addListener(TabChange);

/* <----------- Network Requests Log ----------->
 */

const MAX_HISTORY = 200;
const STORAGE_KEY = "network_history";

// Request to Storage to keep track of recent History of the requests made
/**
 * This Async Func() has an array that stores the recent
 
 * records of the webrequests made from our browser

 * it has max history limit

 * and then it's stored into the extension storage not browser's!

 * @param {*} record
 */
async function appendRequest(record) {
  try {
    const { [STORAGE_KEY]: existing } = await browser.storage.local.get(
      STORAGE_KEY
    );

    const arr = Array.isArray(existing) ? existing : [];

    arr.unshift(record);

    if (arr.length > MAX_HISTORY) arr.length = MAX_HISTORY;

    await browser.storage.local.set({ [STORAGE_KEY]: arr });
  } catch (err) {
    console.error("Error appending request: ", err);
  }
}

// Concise record from the webrequest details
/**
 * Takes a plain webRequest of a our browser
 * @param {*} details
 * @returns Structured & valuable details of a webRequest
 */
function buildRecord(details) {
  return {
    id: details.requestId,
    url: details.url,
    method: details.method,
    statusCode: details.statusCode || null,
    timeStamp: new Date(details.timeStamp).toISOString(),
    tabId: details.tabId,
    type: details.type,
    ip: details.ip,
    fromCache: details.fromCache || false,
    initiator: details.initiator || details.originUrl || null,
  };
}

// On completion of each request those request
// are sent to extension storage in a structured Object
browser.webRequest.onCompleted.addListener(
  async (details) => {
    try {
      const rec = buildRecord(details);
      // console.log(rec);
      await appendRequest(rec);
      // Notify any open popup(s). If popup is closed, it's okay — data is in storage.
      chrome.runtime.sendMessage({ type: "network_new", payload: rec });
    } catch (e) {
      console.error("webRequest handler error:", e);
    }
  },
  { urls: ["<all_urls>"] }
  // no extraInfoSpec needed for onCompleted; include["responseHeaders"] if you want headers
);

// Optional: allow popup to request the current history explicitly
// This sends data to pop_up via message event to store the request in extension storage
browser.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg && msg.type === "get_history") {
    browser.storage.local
      .get(STORAGE_KEY)
      .then((data) => {
        sendResponse({ history: data[STORAGE_KEY] || [] });
      })
      .catch((err) => {
        sendResponse({ history: [] });
      });
    return true; // will respond asynchronously
  }
});

/* TODOS -->
1. Check for IP addresses in a URL, if so then
  send it to pop_up and display it in the pop_up
  window.

2. Check URL contains valid Domain name.
*/
