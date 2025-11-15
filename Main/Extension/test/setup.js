import { jest } from "@jest/globals";


// Mock Firefox "browser" API used by the extension
global.browser = {
  storage: {
    local: {
      data: {},

      get: jest.fn((key) => {
        if (typeof key === "string") {
          return Promise.resolve({
            [key]: global.browser.storage.local.data[key] || []
          });
        }
        return Promise.resolve(
          Object.fromEntries(
            key.map((k) => [k, global.browser.storage.local.data[k] || []])
          )
        );
      }),

      set: jest.fn((obj) => {
        const key = Object.keys(obj)[0];
        global.browser.storage.local.data[key] = obj[key];
        return Promise.resolve();
      }),

      remove: jest.fn((key) => {
        delete global.browser.storage.local.data[key];
        return Promise.resolve();
      }),

      clear: jest.fn(() => {
        global.browser.storage.local.data = {};
        return Promise.resolve();
      })
    },

    // we must mock onChanged listener too
    onChanged: {
      addListener: jest.fn()
    }
  }
};

// Prevent unexpected errors when scripts call URL(), chrome.*, etc.
global.chrome = global.browser; // alias for compatibility if needed

// jsdom already provides localStorage — no need to override
// DO NOT mock localStorage here or it breaks jsdom
