/**
 * 127. Word Ladder
 * 
 * A transformation sequence from word beginWord to word endWord using a dictionary wordList is a sequence of words beginWord -> s1 -> s2 -> ... -> sk such that:
 * 
 * Every adjacent pair of words differs by a single letter.
 * Every si for 1 <= i <= k is in wordList. Note that beginWord does not need to be in wordList.
 * sk == endWord
 * Given two words, beginWord and endWord, and a dictionary wordList, return the number of words in the shortest transformation sequence from beginWord to endWord, or 0 if no such sequence exists.
 * 
 *  
 * 
 * Example 1:
 * 
 * Input: beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log","cog"]
 * Output: 5
 * Explanation: One shortest transformation sequence is "hit" -> "hot" -> "dot" -> "dog" -> cog", which is 5 words long.
 * Example 2:
 * 
 * Input: beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log"]
 * Output: 0
 * Explanation: The endWord "cog" is not in wordList, therefore there is no valid transformation sequence.
 *  
 * 
 * Constraints:
 * 
 * 1 <= beginWord.length <= 10
 * endWord.length == beginWord.length
 * 1 <= wordList.length <= 5000
 * wordList[i].length == beginWord.length
 * beginWord, endWord, and wordList[i] consist of lowercase English letters.
 * beginWord != endWord
 * All the words in wordList are unique.
 */

function getPattern(word: string, starPosition: number) {
    return word.slice(0, starPosition) + '*' + word.slice(starPosition + 1)
}

function ladderLength(beginWord: string, endWord: string, wordList: string[]): number {
    const patterns = new Map<string, string[]>()

    for (let wordPosition = 0; wordPosition < wordList.length; wordPosition++) {
        const word = wordList[wordPosition]

        for (let charPosition = 0; charPosition < word.length; charPosition++) {
            const pattern = getPattern(word, charPosition)

            if (patterns.has(pattern)) {
                patterns.set(pattern, [...patterns.get(pattern)!, word])
            } else {
                patterns.set(pattern, [word])                
            }
        }
    }

    let numberOfTransformations = 1
    let queue = [beginWord]
    const visitedPatterns = new Set<string>()
    const visitedWords = new Set<string>()

    while (queue && queue.length > 0) {
        let currentLevelLenght = queue.length

        while (currentLevelLenght > 0) {
            const word = queue.shift()!

            if (word === endWord) {
                return numberOfTransformations
            }

            for (let charPosition = 0; charPosition < word.length; charPosition++) {
                const newPattern = getPattern(word, charPosition)

                if (!visitedPatterns.has(newPattern)) {
                    const words = patterns.get(newPattern)
                    
                    if (words) {
                        for (const newWord of words) {
                            if (!visitedWords.has(newWord)) {
                                queue.push(newWord)
                                visitedWords.add(newWord)
                            }
                        }
                    }

                    visitedPatterns.add(newPattern)
                }
            }

            currentLevelLenght--
        }

        numberOfTransformations++
    }

    return 0
};


console.log(ladderLength("hit", "cog", ["hot","dot","dog","lot","log","cog"])) // 5
console.log(ladderLength("hit", "cog", ["hot","dot","dog","lot","log"])) // 0