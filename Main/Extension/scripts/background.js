"use strict";
import { updateActiveTabURL } from "./rules/tab_rules.js";

/* 
In this file you have to write the logic that communicates
to nodejs server and that server communicates to the google safe browsing api

it simply forwards the response of the GSB API, because to secure API_KEY


- **Length** → URLs longer than 100–150 chars are suspicious. ✅ done

- **Special Characters** → `@`, `-`, `=`, `?`, multiple `//`. ✅ done

- **IP Address in URL** → `http://192.168.0.1/...` instead of domain name.

regex for IP Address
\b((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b


- **Too Many Subdomains** → `login.secure.bank.fake.com`.
- **Misspelled Brand Names** → e.g., `paypa1.com`, `g00gle.net`.

- **Top-Level Domain Check** → Free TLDs like `.tk`, `.ml`, `.ga`, `.cf`, `.gq` are often used in phishing.
*/

/*
blocks specified url

TODO: send current url to gsb API and
if not malicious then allow loading
the request else don't load it.
*/

/* 
curl -s -X POST "https://safebrowsing.googleapis.com/v4/threatMatches:find?key=AIzaSyB9gx6RcLfV1_cBRlgVthDnt_b2mzbeNks" \
  -H "Content-Type: application/json" \
  -d '{
    "client": {"clientId":"demo-app","clientVersion":"1.0"},
    "threatInfo": {
      "threatTypes":["MALWARE","SOCIAL_ENGINEERING","UNWANTED_SOFTWARE"],
      "platformTypes":["ANY_PLATFORM"],
      "threatEntryTypes":["URL"],
      "threatEntries":[{"url":"http://testsafebrowsing.appspot.com/s/malware.html"}]
    }
  }


  async function checkSafeBrowsing(url) {
  const API_KEY = "YOUR_API_KEY"; // ⚠️ not safe for production
  const body = {
    client: { clientId: "chrome-extension-test", clientVersion: "1.0" },
    threatInfo: {
      threatTypes: ["MALWARE","SOCIAL_ENGINEERING","UNWANTED_SOFTWARE"],
      platformTypes: ["ANY_PLATFORM"],
      threatEntryTypes: ["URL"],
      threatEntries: [{url}]
    }
  };

  const response = await fetch(
    `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${API_KEY}`,
    {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(body)
    }
  );

  const data = await response.json();
  return data.matches && data.matches.length > 0 ? "danger" : "safe";
}
*/

// should done inside a nodejs server
async function isPhish(url) {
  if (url) {
    try {
      const res = await fetch("https://jsonplaceholder.typicode.com/users");
      const data = res.json();
    } catch {
      console.error("Something went Wrong!");
    }
  }

  return;
}

const blockedUrl = "https://www.youtube.com/";

function blockRequest(requestDetails) {
  // Store the status of current url from gsb
  // then do actions based on the status
  const url = requestDetails.url;

  if (url.startsWith(blockedUrl)) {
    console.log(`Current request to \'${url}\' is blocked`);
    return { cancel: true }; // Block the request
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
  //     details.url
  //   );
  // },
  { urls: ["<all_urls>"] }, // Listen for all URLs
  ["blocking"] // Required to modify or cancel requests
);

// Detects new tab
browser.tabs.onActivated.addListener(updateActiveTabURL);
