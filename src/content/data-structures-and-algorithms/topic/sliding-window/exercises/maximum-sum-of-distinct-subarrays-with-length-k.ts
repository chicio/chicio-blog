/**
 * https://leetcode.com/problems/maximum-sum-of-distinct-subarrays-with-length-k/description/
 * 2461. Maximum Sum of Distinct Subarrays With Length K
 */
function maximumSubarraySum(nums: number[], k: number): number {
    let maxSum = 0
    let numbersInSlidingWindow = new Map<number, number>()
    let currentSum = 0

    for (let i = 0; i < k; i++) {
        numbersInSlidingWindow.set(nums[i], (numbersInSlidingWindow.get(nums[i]) || 0) + 1)
        currentSum = currentSum + nums[i]
    }

    for (let i = k; i < nums.length; i++) {
        if (numbersInSlidingWindow.size === k) {
            maxSum = Math.max(maxSum, currentSum)
        }

        let countForElementToBeRemoved = numbersInSlidingWindow.get(nums[i - k])! 

        if (countForElementToBeRemoved > 1) {
            numbersInSlidingWindow.set(nums[i - k], countForElementToBeRemoved - 1)
        } else {
            numbersInSlidingWindow.delete(nums[i - k])
        }
    
        numbersInSlidingWindow.set(nums[i], (numbersInSlidingWindow.get(nums[i]) || 0) + 1)
        currentSum = currentSum + nums[i] - nums[i - k]
    }

    if (numbersInSlidingWindow.size === k) {
        maxSum = Math.max(maxSum, currentSum)
    }

    return maxSum
};