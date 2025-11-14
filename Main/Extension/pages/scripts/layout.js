"use strict";

const sidebarContainer = document.getElementById("sidebar");
const footerContainer = document.getElementById("footer");

sidebarContainer.innerHTML = `<header class="absolute left-1">
    <div class="flex flex-row gap-4 items-center">
      <img src="../../icons/icon128.png" width="50" height="50" alt="logo" />
      <h1 class="text-6xl font-bold text-red-600">
        Anti-Phishing
      </h1>
    </div>

    <div class="flex flex-col gap-4 items-start mt-5 ml-4">
    <a class="text-4xl hover:text-red-600 w-fit" href="/pages/block_domain.html"
    >Manage Blocked Domains</a
    >
    <a class="text-4xl hover:text-red-600 w-fit" href="/pages/test.html"
    >Test Extension</a
    >
    <a class="text-4xl hover:text-red-600 w-fit" href="/pages/about.html">About</a>

    <a title="Report bug in GitHub Issues" class="text-4xl mt-14 p-3.5 bg-transparent hover:bg-[#eb4034] border border-red-600 hover:border-transparent text-red-300 hover:text-white w-fit rounded-lg duration-300 transition-all" href="https://github.com/Vishnu19091/Phishing_Detection_Extension/issues/new?template=bug_report.md">Report Bug</a>
    </div>
</header>`;

footerContainer.innerHTML = `
<footer class="absolute bottom-0 left-[50%] -translate-x-[50%] py-4 text-gray-400 text-xl">
  © 2025 Anti-Phishing Extension
</footer>
`;
