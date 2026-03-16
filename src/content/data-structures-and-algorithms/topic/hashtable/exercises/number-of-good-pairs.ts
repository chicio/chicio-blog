/**
 * https://leetcode.com/problems/number-of-good-pairs
 * 1512. Number of Good Pairs
 */

function numIdenticalPairs(nums: number[]): number {
    const numbersCount = new Map<number, number>()
    let countGoodPairs = 0

    for (let i = 0; i < nums.length; i++) {
        if (numbersCount.has(nums[i])) {
            countGoodPairs = countGoodPairs + numbersCount.get(nums[i])!
        }

        numbersCount.set(nums[i], (numbersCount.get(nums[i]) || 0) + 1);
    }

    return countGoodPairs
};

console.log(numIdenticalPairs([1,2,3,1,1,3]))