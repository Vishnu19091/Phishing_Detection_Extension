"use strict";
import { TabChange } from "./rules/tab_rules.js";

/** Makes a request to a nodejs server

 * to fetch the result a webRequest

 * Sends current url to gsb API and 
 
 * if not malicious then allow loading
 
 * the request else don't load it.
 
 * @param {*} url 

 * @returns Safe / Danger
 */
export async function isPhish(url) {
  if (!url) return null;

  try {
    const res = await fetch("https://anti-phish-proxy.onrender.com/check", {
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

// Stores the data as {"URL":"Status"}
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
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "GET_STATUS") {
    const host = message.hostname;

    // Add extension ID to avoid status conflict
    const status = cache[host] || "unknown";

    // console.log(host);

    sendResponse({ status });
  }

  return true;
});

// fired when tab is switched
browser.tabs.onActivated.addListener((activeInfo) => {
  browser.tabs
    .get(activeInfo.tabId)
    .then((tab) => updateCacheForTab(activeInfo.tabId, {}, tab));
});

// fires when url changes
browser.tabs.onUpdated.addListener(updateCacheForTab);

/* This function only works synchronously no async*/
// const { res, containsIP } = getIPAddresses(requestDetails.url);
function blockRequest(requestDetails) {
  // Store the status of current url and cache it from gsb api
  // then do actions based on the status

  const url = requestDetails.url;

  // don't remove the hostname property
  const host = new URL(url).hostname;
  // const host = new URLSearchParams(window.location.search);
  // console.log(url);

  // Fix when the extension detects the phishing url it captures
  // extension id as its hostname
  const redirectURL = browser.runtime.getURL(
    `pages/blocked.html?site=${requestDetails.url}`
  );

  if (cache[host] === "danger") {
    // console.log(`Detected Phishing URL ${redirectURL}`);
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

  /* Test function */
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

// <--------- Block Custom domains --------->
const KEY_NAME = "blocked_domains";
let blockedDomains = [];

// Load initially
browser.storage.local.get(KEY_NAME).then((result) => {
  blockedDomains = result[KEY_NAME] || [];
  // console.log("Loaded blocked domains:", blockedDomains);
});

// Watch for any updates to storage
browser.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && changes[KEY_NAME]) {
    blockedDomains = normalizeDomains(changes[KEY_NAME].newValue || []);
    // console.log("Updated blocked domains:", blockedDomains);
  }
});

/**
 * To clean & normalize domains to hostnames

 * that is any requests like for example

 * https://www.google.com -> google.com

 * @returns domains
 */
function normalizeDomains(domains) {
  return domains
    .map((d) => {
      try {
        console.log(new URL(d).hostname);
        return new URL(d).hostname;
      } catch {
        return d.replace(/^https?:\/\//, "").split("/")[0];
      }
    })
    .filter(Boolean);
}

// a function to block custom domains from the extension storage
function blckReq(requestDetails) {
  const url = requestDetails.url;
  const domain = new URL(url).hostname;

  if (blockedDomains.includes(domain)) return { cancel: true };

  return {}; // allow
}

// listener function to block custom domains
browser.webRequest.onBeforeRequest.addListener(
  blckReq,
  { urls: ["<all_urls>"] },
  ["blocking"]
);
