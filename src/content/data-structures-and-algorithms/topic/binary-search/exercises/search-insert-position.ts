/**
 * https://leetcode.com/problems/search-insert-position/description/
 * 35. Search Insert Position
 */

function searchInsert(nums: number[], target: number, left: number = 0, right: number = nums.length): number {
    if (left >= right) {
        return left
    }

    const mid = left + Math.floor((right - left) / 2)
    
    if (nums[mid] === target) {
        return mid
    }

    if (target < nums[mid]) {
        return searchInsert(nums, target, left, mid)
    } else {
        return searchInsert(nums, target, mid + 1, right)
    }
};

console.log(searchInsert([1, 3, 5, 6], 5)) // Output: 2