/**
 * https://leetcode.com/problems/substring-with-concatenation-of-all-words/description/
 * 30. Substring with Concatenation of All Words
 */

function areSubstringMapsEqual(map1: Map<string, number>, map2: Map<string, number>): boolean {
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

function findSubstring(s: string, words: string[]): number[] {
    let wordLength = words[0].length
    let wordsLength = words[0].length * words.length
    let wordsWithFrequency = new Map<string, number>()
    let indexes = []

    for (let i = 0; i < words.length; i++) {
        wordsWithFrequency.set(words[i], (wordsWithFrequency.get(words[i]) || 0) + 1)   
    }

    const currentWordsFrequency = new Map<string, number>()

    for (let i = 0; i < wordLength; i++) {
        currentWordsFrequency.clear()
        let left = i
        let right = i

        while (right <= s.length - wordLength) {
            let word = s.substring(right, right + wordLength)
            right = right + wordLength

            if (wordsWithFrequency.has(word)) { 
                currentWordsFrequency.set(word, (currentWordsFrequency.get(word) || 0) + 1)   

                while (currentWordsFrequency.get(word)! > wordsWithFrequency.get(word)!) {
                    let leftWord = s.substring(left, left + wordLength);
                    left += wordLength;
                    
                    currentWordsFrequency.set(leftWord, currentWordsFrequency.get(leftWord)! - 1);
                }

                /// In the best solution, this maps comparison is substituted by a match count
                if (areSubstringMapsEqual(currentWordsFrequency, wordsWithFrequency)) {
                    indexes.push(left)
                }
            } else {
                currentWordsFrequency.clear();
                left = right
            }
        }
    }

    return indexes
};

console.log(findSubstring("barfoothefoobarman", ["foo","bar"]))
console.log(findSubstring("rfoothefoobarman", ["foo","bar"]))