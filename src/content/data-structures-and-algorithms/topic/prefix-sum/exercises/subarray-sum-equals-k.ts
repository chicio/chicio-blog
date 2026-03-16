/**
 * https://leetcode.com/problems/subarray-sum-equals-k/description/
 * 560. Subarray Sum Equals K
 */

function subarraySum(nums: number[], k: number): number {
    let prefixSum = 0;
    let subarrays = 0
    let previousPrefixSum = new Map<number, number>()

    previousPrefixSum.set(0, 1)

    for (let i = 0; i < nums.length; i++) {
        prefixSum = prefixSum + nums[i] 

        if (previousPrefixSum.has(prefixSum - k)) {
            subarrays = subarrays + previousPrefixSum.get(prefixSum - k)!
        } 
          
        previousPrefixSum.set(prefixSum,  (previousPrefixSum.get(prefixSum) || 0) + 1)
    }

    return subarrays
};

console.log(subarraySum([1,2,3,1,1,1,2,3], 3))

