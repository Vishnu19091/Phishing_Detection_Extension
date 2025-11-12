import { getIPAddresses } from "./utils/utils";

describe("Extract IP Addresses", () => {
    test("returns correct results for URLs", () => {
        expect(getIPAddresses("https://example.com"))
            .toEqual({ ip: null, ipState: false, length: 0 });

        expect(getIPAddresses("http://192.168.1.1/pages/index.html&156.143.222.42"))
            .toEqual({ ip: ["192.168.1.1", "156.143.222.42"], ipState: true, length: 2 });
    });
});
