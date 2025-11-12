/**
 * Determines whether IPv4/IPv6

 * is present inside a URL of current user tab

 * @param {*} url

 * @returns ip, ipState, length
 */
export function getIPAddresses(url) {
    let ipState = false;
    const combinedIpRegex =
        /(\b25[0-5]|\b2[0-4][0-9]|\b1[0-9]{2}|\b[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])\b|(([0-9a-fA-F]{1,4}:){7}([0-9a-fA-F]{1,4})|([0-9a-fA-F]{1,4}:){1,7}:([0-9a-fA-F]{1,4}:){0,6}([0-9a-fA-F]{1,4})|([0-9a-fA-F]{1,4}:){1,6}(:[0-9a-fA-F]{1,4}){1,7})/g;

    const ip = url.match(combinedIpRegex);

    const length = ip ? ip.length : 0;

    ipState = length ? true : false;

    return { ip, ipState, length };
}