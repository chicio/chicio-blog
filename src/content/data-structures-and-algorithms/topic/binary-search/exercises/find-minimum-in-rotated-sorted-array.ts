/**
 * https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/description/
 * 153. Find Minimum in Rotated Sorted Array
 */

function findMin(nums: number[]): number {
    let left = 0
    let right = nums.length - 1

    while (left < right) {
        const mid = left + Math.floor((right - left) / 2)

        if (nums[mid] > nums[right]) {
            left = mid + 1
        } else {
            right = mid
        }
    }

    return nums[left]
}

console.log(findMin([4,5,6,7,0,1,2]))
