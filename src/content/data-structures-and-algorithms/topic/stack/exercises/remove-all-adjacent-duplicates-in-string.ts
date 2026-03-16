/**
 * https://leetcode.com/problems/remove-all-adjacent-duplicates-in-string/description/
 * 1047. Remove All Adjacent Duplicates In String
 */

function removeDuplicates(s: string): string {
    let stack: string[] = []

    for(let i = 0; i < s.length; i++) {
        let currentChar = s.charAt(i)

        if (stack[stack.length - 1] !== currentChar) {
            stack.push(currentChar)
        } else {
            stack.pop()
        }
    }

    return stack.join("")
};