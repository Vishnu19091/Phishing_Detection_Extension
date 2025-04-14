window.addEventListener("message", function (event) {
  if (event.source !== this.window) return;

  if (event.data.type && event.data.type === "AUTH_TOKEN") {
    const token = event.data.token;
    const user_profile = event.data.profile;

    // Store it in chrome.storage.local for later use
    if (token) {
      chrome.storage.local.set({ auth_token: token });
      chrome.storage.local.set({ profile: user_profile });
      console.log("Details Stored in extension Successfully", event.data);
    }
  }
});
