/**
 * 32. Longest Valid Parentheses
 * 
 * Given a string containing just the characters '(' and ')', return the length of the longest valid (well-formed) parentheses substring.
 * 
 *  
 * 
 * Example 1:
 * 
 * Input: s = "(()"
 * Output: 2
 * Explanation: The longest valid parentheses substring is "()".
 * Example 2:
 * 
 * Input: s = ")()())"
 * Output: 4
 * Explanation: The longest valid parentheses substring is "()()".
 * Example 3:
 * 
 * Input: s = ""
 * Output: 0
 *  
 * 
 * Constraints:
 * 
 * 0 <= s.length <= 3 * 104
 * s[i] is '(', or ')'.
 */

function longestValidParentheses(s: string): number {
    let maxLen = 0
    let stack: number[] = [-1]

    for (let i = 0; i < s.length; i++) {
        let parenthesis = s.charAt(i)

        if (parenthesis === '(') { 
            stack.push(i)
        } else {
            stack.pop()

            if (stack.length === 0) {
                stack.push(i)
            } else {
                maxLen = Math.max(i - stack[stack.length - 1], maxLen)
            }
        }
    }

    return maxLen
};

console.log(longestValidParentheses(")()())"))
console.log(longestValidParentheses("(()"))