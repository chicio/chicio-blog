/**
 * https://leetcode.com/problems/subarray-sums-divisible-by-k/description/
 * 974. Subarray Sums Divisible by K
 */

function subarraysDivByK(nums: number[], k: number): number {
    let prefixSum = 0;
    let subarrays = 0
    let previousPrefixSum = new Map<number, number>()

    previousPrefixSum.set(0, 1)

    for (let i = 0; i < nums.length; i++) {
        prefixSum = prefixSum + nums[i] 
        let remainder = prefixSum % k;

        if (remainder < 0) { 
            remainder += k;
        }

        if (previousPrefixSum.has(remainder)) {
            subarrays = subarrays + previousPrefixSum.get(remainder)!
        } 
          
        previousPrefixSum.set(remainder, (previousPrefixSum.get(remainder) || 0) + 1)
    }

    return subarrays    
};

console.log(subarraysDivByK([4,5,0,-2,-3,1], 5))