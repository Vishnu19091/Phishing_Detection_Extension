import { countSpecialCharacters } from "./url_rules.js";

/*
<---------- Tab reload & url change detection ---------->
TODO: Send api request to GSB whenever the tab updates via nodejs server

This detects tab change
*/
// for testing

let activeTabURL = "";

let URLlength = 0;

let specialCharlength = 0;

let suspicious = false;

let checkResult = {
  "Active Tab URL: ": activeTabURL,
  "URL Lenght: ": URLlength,
  "Special Characters Length: ": specialCharlength,
  "Suspicious: ": suspicious,
};

export function updateActiveTabURL() {
  browser.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length > 0 && tabs[0].url) {
      activeTabURL = tabs[0].url;

      URLlength = activeTabURL.length;
      specialCharlength = countSpecialCharacters(activeTabURL);
      suspicious = activeTabURL.length > 150 && specialCharlength > 40;
      checkResult = {
        "Active Tab URL: ": activeTabURL,
        "URL Lenght: ": URLlength,
        "Special Characters Length: ": specialCharlength,
        "Suspicious: ": suspicious,
      };
      //   console.log(checkResult);
    }
  });
}

// When active tab Updates and when the tab's URL changes (e.g., navigation)
browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.active && changeInfo.url) {
    activeTabURL = changeInfo.url;
    // console.log("Active Tab URL updated:", activeTabURL);
  }
});
