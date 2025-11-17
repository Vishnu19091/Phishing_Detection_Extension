import { getIPAddresses, ExtractDomainName } from "./utils/utils";

describe("Extract IP Addresses && Domain Name from URL", () => {
  test("This getIPAddresses() is used to fetch IP Addresses from current Tab URL", () => {
    expect(getIPAddresses("https://example.com")).toEqual({
      ip: null,
      ipState: false,
      length: 0,
    });

    expect(
      getIPAddresses("http://192.168.1.1/pages/index.html&156.143.222.42")
    ).toEqual({
      ip: ["192.168.1.1", "156.143.222.42"],
      ipState: true,
      length: 2,
    });

    expect(getIPAddresses("http://192.189.112.241:8000")).toEqual({
      ip: ["192.189.112.241"],
      ipState: true,
      length: 1,
    });
  });
});

describe("Extract Domain name from a URL", () => {
  test("This ExtractDomainName() is used to fetch Domain name from current Tab URL", () => {
    expect(ExtractDomainName("https://www.google.com/")).toBe("www.google.com");

    expect(
      ExtractDomainName(
        "https://www.tutorialspoint.com/jest/jest-advanced-testing.html"
      )
    ).toBe("www.tutorialspoint.com");

    expect(
      ExtractDomainName(
        "https://github.com/Vishnu19091/Phishing_Detection_Extension/"
      )
    ).toBe("github.com");

    expect(ExtractDomainName("http://localhost:3000/")).toBe("localhost");

    expect(ExtractDomainName("about:blank")).toBe("");

    expect(ExtractDomainName("about:preferences")).toBe("");

    expect(
      ExtractDomainName(
        "data:image/jpeg;base64,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"
      )
    ).toBe("");

    expect(
      ExtractDomainName(
        "https://www.linkedin.com/posts/rajat-juneja_javascript-frontendinterview-promises-activity-7339932190148874240-GXy6"
      )
    ).toBe("www.linkedin.com");
  });
});
