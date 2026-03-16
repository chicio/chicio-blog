/**
 * https://leetcode.com/problems/find-all-anagrams-in-a-string/description/
 * Find All Anagrams in a String
 */

function areAnagramMapsEqual(map1: Map<string, number>, map2: Map<string, number>): boolean {
    if (map1.size !== map2.size) { 
        return false
    }

    for (const [key, value] of map1) {
        if (map2.get(key) !== value) { 
            return false
        }
    }

    return true;
}

function findAnagrams(s: string, p: string): number[] {
    let pLetters = new Map<string, number>()
    let sSubstringLetters = new Map<string, number>()

    for (const char of p) {
        pLetters.set(char, (pLetters.get(char) || 0) + 1)
    }

    for (let i = 0; i < p.length; i++) {
        sSubstringLetters.set(s.charAt(i), (sSubstringLetters.get(s.charAt(i)) || 0) + 1);
    }

    let arrayOfIndexes = []

    for (let i = p.length; i < s.length; i++) {
        if (areAnagramMapsEqual(pLetters, sSubstringLetters)) {
            arrayOfIndexes.push(i - p.length)
        }

        let charToBeRemoved = s.charAt(i - p.length)
        let charToBeAdded = s.charAt(i)
        let currentCount = sSubstringLetters.get(charToBeRemoved)!

        if (currentCount > 1)  {
            sSubstringLetters.set(charToBeRemoved, sSubstringLetters.get(charToBeRemoved)! - 1)
        } else {
            sSubstringLetters.delete(charToBeRemoved)
        }

        sSubstringLetters.set(charToBeAdded, (sSubstringLetters.get(charToBeAdded) || 0) + 1)
    }

    if (areAnagramMapsEqual(pLetters, sSubstringLetters)) {
        arrayOfIndexes.push(s.length - p.length)
    }

    return arrayOfIndexes
};

console.log(findAnagrams("cbeababacd", "abc"))