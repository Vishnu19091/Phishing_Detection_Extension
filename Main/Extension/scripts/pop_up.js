"use strict";

const urlstatus = document.getElementById("url-status");
const statusblock = document.getElementById("status-block");

const networkloglist = document.getElementById("list");

const nlog_btn = document.getElementById("nlog-btn");

// Toggle Network Request Logs Visibility
nlog_btn.addEventListener("click", () => {
  if (list.classList.contains("max-h-0")) {
    list.classList.remove("max-h-0", "opacity-0");
    list.classList.add("max-h-96", "opacity-100"); // expands smoothly
  } else {
    list.classList.add("max-h-0", "opacity-0");
    list.classList.remove("max-h-96", "opacity-100");
  }

  if (networkloglist.classList.contains("max-h-0")) {
    nlog_btn.textContent = "Monitor Network Requests";
  } else {
    nlog_btn.textContent = "Hide Network Requests";
  }
});

// <-------- URL STATUS -------->
// <-------- FIX -------->
// captures the extensions address as its hostname fix
function updateStatus() {
  browser.tabs.query({ active: true, lastFocusedWindow: true }).then((tabs) => {
    if (!tabs.length) return;
    const hostname = new URL(tabs[0].url).hostname;

    // console.log(hostname);

    browser.runtime
      .sendMessage({ type: "GET_STATUS", hostname })
      .then((response) => {
        const statusEl = document.getElementById("url-status");
        let resStatus = response.status;

        statusEl.textContent = `Current site is: ${resStatus}`;

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

/* Network Requests Logs */
const STORAGE_KEY = "network_history";

const listEl = document.getElementById("list");

function renderItem(item) {
  const el = document.createElement("div");
  el.className = "item";

  // This only displays the webRequests, so don't worry about the XSS
  el.innerHTML = `<div class="url">${item.url}</div>
  <div class="meta">[${item.type}] ${item.method} ${
    item.statusCode || ""
  } • ${new Date(item.timeStamp).toLocaleTimeString()} • IP:${
    item.ip
  } • Initiator:${item.initiator}</div>`;
  return el;
}

// load stored history and render
async function loadHistory() {
  const { [STORAGE_KEY]: history } = await browser.storage.local.get(
    STORAGE_KEY
  );
  listEl.innerHTML = "";
  const arr = Array.isArray(history) ? history : [];
  for (const item of arr) {
    listEl.appendChild(renderItem(item));
  }
  if (arr.length === 0) {
    listEl.innerHTML = "<div class='item'>No requests logged yet.</div>";
  }
}

/* Appends a single new record to the top

that is each time this function is called

it creates a node in the list block of the html page

so that we can see the webRequests made from our browser
*/
function appendRecord(record) {
  // inserts at top
  const node = renderItem(record);
  listEl.insertBefore(node, listEl.firstChild);
}

/* Listen for messages(sent from background service worker)

and calls the appendRecord() to update the WebRequests History
*/
browser.runtime.onMessage.addListener((msg, sender) => {
  if (msg && msg.type === "network_new" && msg.payload) {
    appendRecord(msg.payload);
  }
});

loadHistory();

// Open Pages
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
