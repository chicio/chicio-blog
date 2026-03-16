/**
 * https://leetcode.com/problems/longest-consecutive-sequence/description/
 * 128. Longest Consecutive Sequence
 */

function longestConsecutive(nums: number[]): number {
    let numbers = new Set<number>(nums)
    let count = 0
    let maxCount = 0

    for(let num of numbers.values()) {
        if (!numbers.has(num - 1)) {
            let current = num
            count = 1
            
            while (numbers.has(current + 1)) {
                current++
                count++
            }

            maxCount = Math.max(maxCount, count)
        }
    }

    return maxCount
};

console.log(longestConsecutive([100,4,200,1,3,2]))