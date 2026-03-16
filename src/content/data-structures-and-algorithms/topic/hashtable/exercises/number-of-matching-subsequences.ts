/**
 * https://leetcode.com/problems/number-of-matching-subsequences/description/
 * 792. Number of Matching Subsequences
 */

function numMatchingSubseq(s: string, words: string[]): number {
    let dictionaryOfWords = new Map<string, string[]>()

    for (let i = 0; i < words.length; i++) {
        let currentWord = words[i]
        let initialChar = currentWord.charAt(0)
        let currentListOfWords = dictionaryOfWords.get(initialChar)

        if (currentListOfWords)  {
            currentListOfWords.push(currentWord)
        } else {
            currentListOfWords = [currentWord]
        }

        dictionaryOfWords.set(initialChar, currentListOfWords)
    }

    let numberOfMatchingSubsequences = 0

    for (let i = 0; i < s.length; i++) {
        let currentChar = s.charAt(i)
        let currentListOfWords = dictionaryOfWords.get(currentChar)

        if (currentListOfWords) {
            let wordsToReAdd = []

            while(currentListOfWords.length > 0) {
                let currentWord = currentListOfWords.shift() ?? ""

                if (currentWord.length === 1) {
                    numberOfMatchingSubsequences++
                } else {
                    let newCurrentWord = currentWord.substring(1)
                    wordsToReAdd.push(newCurrentWord)
                }
            }

            dictionaryOfWords.set(currentChar, [])

            for (let j = 0; j < wordsToReAdd.length; j++) {
                let currentWordToReAdd = wordsToReAdd[j]
                let wordToReadInitialChar = currentWordToReAdd.charAt(0)
                let listForChar = dictionaryOfWords.get(wordToReadInitialChar)

                if (listForChar)  {
                    listForChar.push(currentWordToReAdd)
                } else {
                    listForChar = [currentWordToReAdd]
                }

                dictionaryOfWords.set(wordToReadInitialChar, listForChar)                
            }
        }
    }

    return numberOfMatchingSubsequences
};

console.log(numMatchingSubseq("abcdea", ["a","bb","acd","ace", "aa"]))