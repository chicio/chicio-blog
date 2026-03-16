/**
 * 209. Minimum Size Subarray Sum
 * 
 * Given an array of positive integers nums and a positive integer target, return the minimal length of a subarray whose sum is greater than or equal to target. If there is no such subarray, return 0 instead.
 * 
 *  
 * 
 * Example 1:
 * 
 * Input: target = 7, nums = [2,3,1,2,4,3]
 * Output: 2
 * Explanation: The subarray [4,3] has the minimal length under the problem constraint.
 * Example 2:
 * 
 * Input: target = 4, nums = [1,4,4]
 * Output: 1
 * Example 3:
 * 
 * Input: target = 11, nums = [1,1,1,1,1,1,1,1]
 * Output: 0
 *  
 * 
 * Constraints:
 * 
 * 1 <= target <= 109
 * 1 <= nums.length <= 105
 * 1 <= nums[i] <= 104
 */

function minSubArrayLen(target: number, nums: number[]): number {
    let prefixSum = 0;
    let startSubarray = 0
    let minSubarraySize = nums.length + 1

    for (let i = 0; i < nums.length; i++) {
        prefixSum = prefixSum + nums[i]

        while (prefixSum >= target) {
            minSubarraySize = Math.min(minSubarraySize, i - startSubarray + 1)
            prefixSum = prefixSum - nums[startSubarray]
            startSubarray++
        }
    }

    if (minSubarraySize === nums.length + 1) {
        return 0
    }

    return minSubarraySize
};

console.log(minSubArrayLen(7, [2,3,1,2,4,3]))