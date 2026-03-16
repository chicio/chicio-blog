/**
 * https://leetcode.com/problems/contiguous-array/description/
 * 525. Contiguous Array
 */

function findMaxLength(nums: number[]): number {
    let prefixSum = 0;
    let maxSubarray = 0
    let previousPrefixSum = new Map<number, number>()

    previousPrefixSum.set(0, -1)

    for (let i = 0; i < nums.length; i++) {
        prefixSum = prefixSum + (nums[i] === 0 ? -1 : 1)

        if (previousPrefixSum.has(prefixSum)) {
            maxSubarray = Math.max(maxSubarray, i - previousPrefixSum.get(prefixSum)!)
        } 
          
        if (!previousPrefixSum.has(prefixSum)) {
            previousPrefixSum.set(prefixSum, i)
        } 
    }

    return maxSubarray    
};

console.log(findMaxLength([0, 0, 1, 0, 1, 0, 0, 0]))