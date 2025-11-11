"use strict";

export function countSpecialCharacters(str) {
  // Regex to match any character that is not alphanumeric or whitespace
  const specialCharRegex = /[^a-zA-Z0-9\s]/g;

  // Use match() to find all special characters
  const matches = str.match(specialCharRegex);

  return matches ? matches.length : 0;
}
