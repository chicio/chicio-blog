/**
 * https://leetcode.com/problems/encode-and-decode-tinyurl/description/
 * 535. Encode and Decode TinyURL
 */


/**
 * We should check also collisions... (eg. base 64/62 encoding)
 */

let tinyUrls = new Map<string, string>()

function hashTo4Char(str: string): string {
  const chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let hash = 0;

  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) % 1000000007;
  }

  let shortHash = "";
  for (let i = 0; i < 4; i++) {
    shortHash = chars[hash % 62] + shortHash;
    hash = Math.floor(hash / 62);
  }

  return shortHash;
}

const baseUrl = 'https://short.url'

/**
 * Encodes a URL to a shortened URL.
 */
function encode(longUrl: string): string {
    const shortUrl = `${baseUrl}/${hashTo4Char(longUrl)}`
    tinyUrls.set(shortUrl, longUrl)
	return shortUrl
};

/**
 * Decodes a shortened URL to its original URL.
 */
function decode(shortUrl: string): string {
	return tinyUrls.get(shortUrl)!
};

let encoded = encode("https://leetcode.com/problems/design-tinyurl")
console.log(encoded)
console.log(decode(encoded))