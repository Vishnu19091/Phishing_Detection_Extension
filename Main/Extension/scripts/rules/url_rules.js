"use strict";

export function countSpecialCharacters(str) {
  // Regex to match any character that is not alphanumeric or whitespace
  const specialCharRegex = /[^a-zA-Z0-9\s]/g;

  // Use match() to find all special characters
  const matches = str.match(specialCharRegex);

  return matches ? matches.length : 0;
}

// Determines whether IPv4/IPv6
// const text =
//   "Server IP is 192.168.1.10 and another one is 2001:0db8::1. The IPv6 address is 2001:0db8:85a3:0000:0000:8a2e:0370:7334 or even fe80::1.";

export function getIPAddresses(url) {
  let containsIP = false;
  const combinedIpRegex =
    /(\b25[0-5]|\b2[0-4][0-9]|\b1[0-9]{2}|\b[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])\b|(([0-9a-fA-F]{1,4}:){7}([0-9a-fA-F]{1,4})|([0-9a-fA-F]{1,4}:){1,7}:([0-9a-fA-F]{1,4}:){0,6}([0-9a-fA-F]{1,4})|([0-9a-fA-F]{1,4}:){1,6}(:[0-9a-fA-F]{1,4}){1,7})/g;

  const res = url.match(combinedIpRegex);

  containsIP = res.length ? true : false;
  // console.log(`IP address present in this url [${res}]`);
  if (res.length) return { res, containsIP };
}

// getIPAddresses(text);
