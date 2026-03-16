/**
 * https://leetcode.com/problems/top-k-frequent-words/description/
 * 692. Top K Frequent Words
 */

function topKFrequent(words: string[], k: number): string[] {
    let wordsFrequencies = new Map<string, number>()

    for (let i = 0; i < words.length; i++) {
        let currentWord = words[i]
        wordsFrequencies.set(currentWord, (wordsFrequencies.get(currentWord) || 0) + 1)
    }

    let bucketsOfFrequencies = new Map<number, string[]>()

    for (const [word, frequency] of wordsFrequencies) {
        let bucket = bucketsOfFrequencies.get(frequency) || []
        bucket.push(word)
        bucketsOfFrequencies.set(frequency, bucket)
    }

    let result = []

    let sortedFrequencies = Array
        .from(bucketsOfFrequencies.keys())
        .sort((a, b) => b - a)

    for (const frequency of sortedFrequencies) {
        let bucket = bucketsOfFrequencies.get(frequency)!
        result.push(...bucket.sort())
    }

    return result.slice(0, k);
}

console.log(topKFrequent(["i","love","leetcode","i","love","coding"], 2))
