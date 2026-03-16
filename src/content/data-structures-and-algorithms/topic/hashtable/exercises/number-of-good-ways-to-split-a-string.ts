/**
 * https://leetcode.com/problems/number-of-good-ways-to-split-a-string/description/
 * 1525. Number of Good Ways to Split a String
 */

function numSplits(s: string): number {
    let leftChars = new Map<string, number>()
    let rightChars = new Map<string, number>()
    let goodSplits = 0

    for (const char of s) {
        rightChars.set(char, (rightChars.get(char) || 0) + 1)
    }

    for (const char of s) {
        if (leftChars.size === rightChars.size) {
            goodSplits++
        }
        
        let countRight = rightChars.get(char) || 0

        if (countRight === 1) {
            rightChars.delete(char)
        } else {
            rightChars.set(char, --countRight)
        }

        leftChars.set(char, (leftChars.get(char) || 0) + 1)
    }

    return goodSplits
};

console.log(numSplits("aacaba"))