/**
 * https://leetcode.com/problems/reorganize-string/description/
 * 767. Reorganize String
 */


function reorganizeString(s: string): string {
    let charsCount = new Map<string, number>()
    let maxCount = -Infinity

    for (let i = 0; i < s.length; i++) { 
        let currentCount = (charsCount.get(s.charAt(i)) || 0) + 1
        charsCount.set(s.charAt(i), currentCount)
        maxCount = Math.max(currentCount, maxCount)
    }

    if (maxCount > (s.length + 1) / 2) {
        return ""
    }

    const sortedCharsCount = Array.from(charsCount.entries())
        .map(([key, value]) => ({ key, value }))
        .sort((a, b) => b.value - a.value); 

    let result = new Array(s.length);
    let index = 0;

    for (let i = 0; i < sortedCharsCount.length; i++) {
        let { key, value } = sortedCharsCount[i];

        for (let j = 0; j < value; j++) {
            result[index] = key;
            index += 2;  
            if (index >= s.length) {
                index = 1; 
            }
        }
    }

    return result.join("");
}

console.log(reorganizeString("vvvlo"))
console.log(reorganizeString("aabbc"))
console.log(reorganizeString("aaab"))