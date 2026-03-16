/**
 * https://leetcode.com/problems/search-in-rotated-sorted-array/description/
 * 33. Search in Rotated Sorted Array
 */
import * as sea from "node:sea";

function search(nums: number[], target: number): number {
    let left = 0
    let right = nums.length - 1

    while (left <= right) {
        let mid = left + Math.floor((right - left) / 2)

        if (nums[mid] === target) {
            return mid
        }

        if (nums[left] <= nums[mid]) {
            if (nums[left] <= target && target < nums[mid]) {
                right = mid - 1
            } else {
                left = mid + 1
            }
        } else {
            if (nums[mid] < target && target <= nums[right]) {
                left  = mid + 1
            } else {
                right = mid - 1
            }
        }
    }

    return -1
}

console.log(search([4,5,6,7,0,1,2], 0)) // Output: 4
