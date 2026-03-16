/**
 * https://leetcode.com/problems/decode-string/description/
 * 394. Decode String
 */

function isDigit(char: string): boolean {
    return /^[0-9]$/.test(char);
}

function recursiveDecode(s: string, i: number):  [string, number] {
    let currentChar = s.charAt(i)
    let result = ""

    while (i < s.length && currentChar !== ']') {
        if (isDigit(currentChar)) {
            let times = ""

            while (isDigit(currentChar)) {
                times += currentChar
                currentChar = s.charAt(++i);
            }

            const [decodedSubstring, nextIndex] = recursiveDecode(s, ++i);
            i = nextIndex;

            result += decodedSubstring.repeat(parseInt(times));
            currentChar = s.charAt(i)
        } else {
            result += currentChar
            currentChar = s.charAt(++i)
        }
    }

    return [result, i + 1]
}

function decodeString(s: string): string {
    const [decoded] = recursiveDecode(s, 0)

    return decoded
}

console.log(decodeString("3[a]2[bc]"))


