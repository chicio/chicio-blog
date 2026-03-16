/**
 * 1189. Maximum Number of Balloons
 *
 * Given a string text, you want to use the characters of text to form as many instances of the word "balloon" as possible.
 * 
 * You can use each character in text at most once. Return the maximum number of instances that can be formed.
 * 
 *  
 * 
 * Example 1:
 * 
 * 
 * 
 * Input: text = "nlaebolko"
 * Output: 1
 * Example 2:
 * 
 * 
 * 
 * Input: text = "loonbalxballpoon"
 * Output: 2
 * Example 3:
 * 
 * Input: text = "leetcode"
 * Output: 0
 *  
 * 
 * Constraints:
 * 
 * 1 <= text.length <= 104
 * text consists of lower case English letters only.
 */

function maxNumberOfBalloons(text: string): number {
    const balloonLetterCount: Record<string, number> = {
        b: 0,
        a: 0,
        l: 0,
        o: 0,
        n: 0
    }

    for (let i = 0; i < text.length; i++) {
        if (balloonLetterCount[text.charAt(i)] !== undefined) {
            balloonLetterCount[text.charAt(i)]++
        }
    }

    balloonLetterCount['l'] = Math.floor(balloonLetterCount['l'] / 2)
    balloonLetterCount['o'] = Math.floor(balloonLetterCount['o'] / 2)

    return Math.min(
        balloonLetterCount['b'], 
        balloonLetterCount['a'],
        balloonLetterCount['l'],
        balloonLetterCount['o'],
        balloonLetterCount['n']
    )
}

console.log(maxNumberOfBalloons("loonbalxballpoon"))