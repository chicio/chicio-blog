/**
 * https://leetcode.com/problems/continuous-subarray-sum/
 * 523. Continuous Subarray Sum
 */

function checkSubarraySum(nums: number[], k: number): boolean {
    let prefixSum = 0;
    let subarrays = 0
    let previousPrefixSumPositions = new Map<number, number>()

    previousPrefixSumPositions.set(0, -1)

    for (let i = 0; i < nums.length; i++) {
        prefixSum = prefixSum + nums[i] 
        let remainder = prefixSum % k;

        if (remainder < 0) { 
            remainder += k;
        }

        const firstPositionOfRemainder = previousPrefixSumPositions.get(remainder)
        
        if (firstPositionOfRemainder !== undefined && (i - firstPositionOfRemainder) >= 2) {
            return true
        } 
        
        if(firstPositionOfRemainder === undefined) {
            previousPrefixSumPositions.set(remainder, i)
        }          
    }

    return false
};


console.log(checkSubarraySum([23,2,4,6,7], 6))
console.log(checkSubarraySum([23,2,6,4,7], 6))