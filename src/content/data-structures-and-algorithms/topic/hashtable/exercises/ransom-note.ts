/**
 * https://leetcode.com/problems/ransom-note/description/
 * 383. Ransom Note
 */

function canConstruct(ransomNote: string, magazine: string): boolean {
    const magazineLetterCount = new Map<string, number>()

    for(let i = 0; i < magazine.length; i++) {
        magazineLetterCount.set(magazine.charAt(i), (magazineLetterCount.get(magazine.charAt(i)) || 0) + 1)
    }

    for (let i = 0; i < ransomNote.length; i++) {
        if (!magazineLetterCount.has(ransomNote.charAt(i)) || magazineLetterCount.get(ransomNote.charAt(i)) === 0) {
            return false
        } else {
            magazineLetterCount.set(ransomNote.charAt(i), magazineLetterCount.get(ransomNote.charAt(i))! - 1)
        }
    }

    return true
};

console.log("aa", "aab")