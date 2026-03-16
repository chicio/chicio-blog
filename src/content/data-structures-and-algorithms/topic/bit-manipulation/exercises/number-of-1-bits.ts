/**
 * https://leetcode.com/problems/number-of-1-bits/
 * 191. Number of 1 Bits
 */

function hammingWeight(n: number): number {
    let number = 0

    for (let i = 0; i < 32; i++) {
        number = number + (n & 1)
        n = n >>> 1
    }

    return number
}

console.log(hammingWeight(2147483645))
