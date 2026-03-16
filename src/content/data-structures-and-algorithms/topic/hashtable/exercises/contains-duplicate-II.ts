/**
 * https://leetcode.com/problems/contains-duplicate-ii/description/
 * 219. Contains Duplicate II
 */

function containsNearbyDuplicate(nums: number[], k: number): boolean {
    let previousNumbersWithIndex = new Map<number, number>()

    for (let i = 0; i < nums.length; i++) { 
        if (previousNumbersWithIndex.has(nums[i]) && Math.abs(i - previousNumbersWithIndex.get(nums[i])!) <= k) {
            return true
        }

        previousNumbersWithIndex.set(nums[i], i)
    }

    return false
};

console.log(containsNearbyDuplicate([1,2,3,1], 3))