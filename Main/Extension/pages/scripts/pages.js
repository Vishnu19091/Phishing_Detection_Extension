const KEY_NAME = "blocked_domains";
const domainInput = document.getElementById("domainInput");
const addBtn = document.getElementById("addBtn");
const domainList = document.getElementById("domainList");

// Load and render existing domains
async function loadDomains() {
  const result = await browser.storage.local.get(KEY_NAME);
  const domains = result[KEY_NAME] || [];
  renderDomains(domains);
}

// Save updated list
async function saveDomains(domains) {
  await browser.storage.local.set({ [KEY_NAME]: domains });
}

// Render domains as list
function renderDomains(domains) {
  domainList.innerHTML = "";
  domains.forEach((domain, index) => {
    const li = document.createElement("li");
    li.className =
      "flex justify-between items-center bg-[#1e1e1e] p-3 rounded-md text-lg";

    // This element displays the blocked domains
    li.innerHTML = `
      <span class='text-2xl'>${domain}</span>
      <button data-index="${index}"
        class="removeBtn bg-gray-700 hover:bg-red-600 px-3 py-1 rounded-md text-white">
        Remove
      </button>
    `;

    domainList.appendChild(li);
  });

  // Attach remove listeners
  document.querySelectorAll(".removeBtn").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      const idx = parseInt(e.target.getAttribute("data-index"));
      const result = await browser.storage.local.get(KEY_NAME);
      const domains = result[KEY_NAME] || [];
      domains.splice(idx, 1);
      await saveDomains(domains);
      loadDomains();
    });
  });
}

// Extracts Domain name from a URL
function ExtractDomainName(url) {
  const urlObject = new URL(url);
  // console.log(urlObject);

  if (urlObject.protocol !== "moz-extension:") {
    return urlObject.hostname;
  } else {
    alert("Invalid data received");
  }
}

// Store blocked domain in storage
addBtn.addEventListener("click", async () => {
  const url = domainInput.value.trim();

  const newDomain = ExtractDomainName(url);
  if (!newDomain) return;

  const result = await browser.storage.local.get(KEY_NAME);
  const domains = result[KEY_NAME] || [];

  if (!domains.includes(newDomain)) {
    domains.push(newDomain);
    await saveDomains(domains);
    domainInput.value = "";
    loadDomains();
  } else {
    alert("This domain is already blocked!");
  }
});

// Live update if background modifies storage
browser.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && changes[KEY_NAME]) {
    loadDomains();
  }
});

// Load on open
loadDomains();
