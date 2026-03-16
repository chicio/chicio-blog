/**
 * https://leetcode.com/problems/group-anagrams/description/
 * 49. Group Anagrams
 */

function groupAnagrams(strs: string[]): string[][] {
    let anagramGroups = new Map<string, string[]>()

    for (let i = 0; i < strs.length; i++) {
        let sorted = strs[i].split('').sort().join('')

        if (anagramGroups.has(sorted)) {
            anagramGroups.set(sorted, [...anagramGroups.get(sorted)!, strs[i]])
        } else {
            anagramGroups.set(sorted, [strs[i]])
        }
    }

    return Array.from(anagramGroups.values())
};

console.log(groupAnagrams(["eat","tea","tan","ate","nat","bat"]))