/**
 * https://leetcode.com/problems/maximum-sum-circular-subarray/description/
 * 918. Maximum Sum Circular Subarray
 */

function maxSubarraySumCircular(nums: number[]): number {
    let sum = nums[0]
    let globalMax = sum
    let total = nums[0]

    //Kadane - max contiguos sum + total sum
    for (let i = 1; i < nums.length; i++) { 
        total = total + nums[i]
        sum = Math.max(nums[i], sum + nums[i])
        globalMax = Math.max(globalMax, sum)
    }

    //Kadane - min contiguos sum
    sum = nums[0];
    let globalMin = sum;
   
    for (let i = 1; i < nums.length; i++) {
        sum = Math.min(nums[i], sum + nums[i])
        globalMin = Math.min(globalMin, sum);
    }

    if (globalMax < 0) {
        return globalMax
    }

    return Math.max(
        globalMax, 
        total - globalMin
    )
};

console.log(maxSubarraySumCircular([5,-3,5]))
console.log(maxSubarraySumCircular([1,-2,3,-2]))