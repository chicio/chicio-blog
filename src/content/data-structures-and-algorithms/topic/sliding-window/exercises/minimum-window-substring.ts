
/**
 * https://leetcode.com/problems/minimum-window-substring/description/
 * Minimum Window Substring
 * 
 * Given two strings s and t of lengths m and n respectively, return the minimum window substring of s such that every character in t (including duplicates) is included in the window. If there is no such substring, return the empty string "".
 * 
 * The testcases will be generated such that the answer is unique.
 * 
 *  
 * 
 * Example 1:
 * 
 * Input: s = "ADOBECODEBANC", t = "ABC"
 * Output: "BANC"
 * Explanation: The minimum window substring "BANC" includes 'A', 'B', and 'C' from string t.
 * Example 2:
 * 
 * Input: s = "a", t = "a"
 * Output: "a"
 * Explanation: The entire string s is the minimum window.
 * Example 3:
 * 
 * Input: s = "a", t = "aa"
 * Output: ""
 * Explanation: Both 'a's from t must be included in the window.
 * Since the largest window of s only has one 'a', return empty string.
 *  
 * 
 * Constraints:
 * 
 * m == s.length
 * n == t.length
 * 1 <= m, n <= 105
 * s and t consist of uppercase and lowercase English letters.
 *  
 * 
 * Follow up: Could you find an algorithm that runs in O(m + n) time?
 */

function minWindow(s: string, t: string): string {
    let countOfMatches = 0;
    let charsOfT = new Map<string, number>();
    let charsOfTInSubstring = new Map<string, number>();
    let minSubstring = "";
    let minLength = Infinity;
    let startSubstring = 0;

    for (let i = 0; i < t.length; i++) {
        charsOfT.set(t.charAt(i), (charsOfT.get(t.charAt(i)) || 0) + 1);
    }

    for (let i = 0; i < s.length; i++) {
        let currentChar = s.charAt(i);

        if (charsOfT.has(currentChar)) {
            charsOfTInSubstring.set(currentChar, (charsOfTInSubstring.get(currentChar) || 0) + 1);

            if (charsOfTInSubstring.get(currentChar)! <= charsOfT.get(currentChar)!) {
                countOfMatches++;
            }
        }

        while (countOfMatches === t.length) {
            let windowLength = i - startSubstring + 1;
            
            if (windowLength < minLength) {
                minLength = windowLength;
                minSubstring = s.substring(startSubstring, i + 1);
            }

            let startingChar = s.charAt(startSubstring);

            if (charsOfT.has(startingChar)) {
                charsOfTInSubstring.set(startingChar, charsOfTInSubstring.get(startingChar)! - 1);
                
                if (charsOfTInSubstring.get(startingChar)! < charsOfT.get(startingChar)!) {
                    countOfMatches--;
                }
            }

            startSubstring++;
        }
    }

    return minSubstring;
}

console.log(minWindow("ADOBECODEBANC", "ABC"))
