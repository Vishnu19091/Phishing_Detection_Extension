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

// should done inside a nodejs server
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
let blockedUrl = ``;

async function updateCacheForTab(tabId, changeInfo, tab) {
  if (tab.active && tab.url && /^https?:/i.test(tab.url)) {
    const hostname = new URL(tab.url).hostname;
    const status = await isPhish(tab.url);
    cache[hostname] = status;
    // blockedUrl = `${cache[hostname]}`;
    // console.log(blockedUrl);
    // console.log(`Cached ${hostname} → ${status}`);
  }
}

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

  if (cache[host] === "danger") {
    const redirectURL = browser.runtime.getURL(
      `blocked.html?site=${encodeURIComponent(requestDetails.url)}`
    );

    console.log(`Redirecting to ${redirectURL}`);
    // console.log(`Current request to \'${url}\' is blocked`);

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
