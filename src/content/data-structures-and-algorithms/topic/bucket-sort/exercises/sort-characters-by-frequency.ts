/**
 * https://leetcode.com/problems/sort-characters-by-frequency/description/
 * 451. Sort Characters By Frequency
 */


function frequencySort(s: string): string {
    let frequencies = new Map<string, number>()

    for (let i = 0; i < s.length; i++) {
        let currentChar = s.charAt(i)
        frequencies.set(currentChar, (frequencies.get(currentChar) || 0) + 1)
    }

    let bucketsOfFrequencies = new Map<number, string[]>()

    for (const [char, frequency] of frequencies) {
        let bucket = bucketsOfFrequencies.get(frequency) || []
        bucket.push(char)
        bucketsOfFrequencies.set(frequency, bucket)
    }

    let result = ""

    let sortedFrequencies = Array.from(bucketsOfFrequencies.keys()).sort((a, b) => b - a);

    for (const frequency of sortedFrequencies) {
        const chars = bucketsOfFrequencies.get(frequency)!;
        for (const currentChar of chars) {
            result += currentChar.repeat(frequency);
        }
    }

    return result
};


console.log(frequencySort("Aabb"))
