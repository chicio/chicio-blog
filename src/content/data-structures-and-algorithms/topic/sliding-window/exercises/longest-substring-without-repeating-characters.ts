/**
 * https://leetcode.com/problems/longest-substring-without-repeating-characters/description/
 * Longest Substring Without Repeating Characters
 */

function lengthOfLongestSubstring(s: string): number {
    let currentCharsInSubstring = new Map<string, number>()
    let maxLength = 0
    let startSubString = -1

    for (let i = 0; i < s.length; i++) {
        let currentChar = s.charAt(i)

        if (currentCharsInSubstring.has(currentChar) && currentCharsInSubstring.get(currentChar)! >= startSubString) {
            startSubString = currentCharsInSubstring.get(currentChar)!
        }

        currentCharsInSubstring.set(s.charAt(i), i)
        maxLength = Math.max(maxLength, i - startSubString)
    }

    return maxLength
};

