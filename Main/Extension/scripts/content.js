// <------- display year in footer span ------->
// Guard footer (only exists on extension pages)
const footer = document.getElementById("footer");
if (footer) {
  footer.textContent = new Date().getFullYear();
}

// Extract and log all HTTP links
function extractLinks() {
  const links = [...document.querySelectorAll("a[href]")]
    .map((a) => a.href)
    .filter((href) => href.startsWith("http"));

  // Get current tab ID then save under that key
  browser.runtime
    .sendMessage({
      type: "SAVE_LINKS",
      payload: {
        count: links.length,
        links: links,
        url: window.location.href,
      },
    })
    .catch(() => {});

  browser.runtime
    .sendMessage({
      type: "LINKS_FOUND",
      count: links.length,
      links: links,
      url: window.location.href,
    })
    .catch(() => {});

  return links;
}

// Initial extraction
extractLinks();

// Re-extract on background ping (page reload / navigation)
browser.runtime.onMessage.addListener((msg) => {
  if (msg.type === "PAGE_LOADED") {
    extractLinks();
  }
});

// Re-extract when DOM changes (SPAs)
let debounceTimer;
const observer = new MutationObserver(() => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(extractLinks, 500);
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
});
