/**
 * https://leetcode.com/problems/valid-parentheses/description/
 * Valid Parentheses
 */

const parenthesisCombinations: Record<string, string> = {
    '}' : '{',
    ']' : '[',
    ')' : '(',
}

function isValid(s: string): boolean {
    let stack: string[] = []

    for (let i = 0; i < s.length; i++) {
        const parenthesis = s.charAt(i);

        if (parenthesis === '(' || parenthesis === '{' || parenthesis === '[') {
            stack.push(parenthesis)
        } else {
            let lastParenthesis = stack.pop()
            if (lastParenthesis !== parenthesisCombinations[parenthesis]) {
                return false
            }
        }
    }

    return stack.length === 0
};