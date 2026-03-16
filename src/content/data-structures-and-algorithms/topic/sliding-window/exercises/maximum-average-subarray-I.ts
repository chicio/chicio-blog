/**
 * https://leetcode.com/problems/maximum-average-subarray-i/description/
 * 643. Maximum Average Subarray I
 */

function findMaxAverage(nums: number[], k: number): number {
    let sum = 0

    for (let i = 0; i < k; i++) {
        sum = sum + nums[i]
    }

    let maxSum = sum

    for (let i = k; i < nums.length; i++) {
        sum = sum - nums[i - k] + nums[i]
        maxSum = Math.max(sum, maxSum)
    }

    return maxSum / k
};

console.log(findMaxAverage([1,12,-5,-6,50,3], 4))
