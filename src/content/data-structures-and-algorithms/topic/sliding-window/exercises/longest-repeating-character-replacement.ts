/**
 * https://leetcode.com/problems/longest-repeating-character-replacement/description/
 * 424. Longest Repeating Character Replacement
 */
function characterReplacement(s: string, k: number): number {
    const charsFrequencies = new Map<string, number>();
    let maxLength = 0
    let maxFrequency = 0
    let startSubstring = 0

    for (let i = 0; i < s.length; i++) {
        let char = s.charAt(i)
        charsFrequencies.set(char, (charsFrequencies.get(char) || 0) + 1)
        maxFrequency = Math.max(maxFrequency, charsFrequencies.get(char)!)

        while (i - startSubstring + 1 - maxFrequency > k) {
            let startingChar = s.charAt(startSubstring)
            charsFrequencies.set(startingChar, charsFrequencies.get(startingChar)! - 1)
            startSubstring++
        }
        
        maxLength = Math.max(maxLength, i - startSubstring + 1)
    }

    return maxLength
};

console.log(characterReplacement("KRSCDCSONAJNHLBMDQGIFCPEKPOHQIHLTDIQGEKLRLCQNBOHNDQGHJPNDQPERNFSSSRDEQLFPCCCARFMDLHADJADAGNNSBNCJQOF", 4))