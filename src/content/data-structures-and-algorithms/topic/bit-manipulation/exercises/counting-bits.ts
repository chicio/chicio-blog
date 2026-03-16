/**
 * https://leetcode.com/problems/counting-bits/description/
 * 338. Counting Bits
 */

function countBits(n: number): number[] {
    let numberOfOneBitsForEachNumber = Array(n + 1).fill(0)

    for (let i = 1; i <= n; i++) {
        //dp[n] = dp[n - 2^k] + 1, where 2^k is the largest power of 2 ≤ n.
        let biggestPowerOfTwoMinorOfI = Math.pow(2, Math.floor(Math.log2(i)))
        let startingSequence = numberOfOneBitsForEachNumber[i - biggestPowerOfTwoMinorOfI]
        numberOfOneBitsForEachNumber[i] = startingSequence + 1
    }

    return numberOfOneBitsForEachNumber
};

console.log(countBits(8))