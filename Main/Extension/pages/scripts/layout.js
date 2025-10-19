"use strict";

/*<----------- FOOTER----------->

<footer class="text-center py-4 text-gray-400 text-sm">
  © 2025 Anti-Phishing Extension
</footer>

*/

/*<----------- SIDEBAR ----------->
<header>
  <div class="absolute left-1">
    <div class="flex flex-row gap-4 items-center">
      <img src="../../icons/icon128.png" width="50" height="50" alt="logo" />
      <h1 class="text-4xl text-red-600 hover:underline underline-offset-2">
        Anti-Phishing
      </h1>
    </div>

    <a class="text-2xl hover:text-red-600" href="../block_domain.html"
      >Manage Blocked Domains</a
    >
    <a class="text-2xl hover:text-red-600" href="../test.html"
      >Test Extension</a
    >
    <a class="text-2xl hover:text-red-600" href="../about.html">About</a>
  </div>
</header>
*/

const sidebarContainer = document.getElementById("sidebar");
const footerContainer = document.getElementById("footer");

sidebarContainer.innerHTML = `<header class="absolute left-1">
    <div class="flex flex-row gap-4 items-center">
      <img src="../../icons/icon128.png" width="50" height="50" alt="logo" />
      <h1 class="text-6xl font-bold text-red-600">
        Anti-Phishing
      </h1>
    </div>

    <div class="flex flex-col gap-4 items-start mt-5">
    <a class="text-4xl hover:text-red-600 w-fit" href="/pages/block_domain.html"
    >Manage Blocked Domains</a
    >
    <a class="text-4xl hover:text-red-600 w-fit" href="/pages/test.html"
    >Test Extension</a
    >
    <a class="text-4xl hover:text-red-600 w-fit" href="/pages/about.html">About</a>
    </div>
</header>`;

footerContainer.innerHTML = `
<footer class="absolute bottom-0 left-[50%] -translate-x-[50%] py-4 text-gray-400 text-xl">
  © 2025 Anti-Phishing Extension
</footer>
`;
