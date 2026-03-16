/**
 * https://leetcode.com/problems/find-peak-element/description/
 * 162. Find Peak Element
 */

function findPeakElement(nums: number[]): number {
    let left = 0;
    let right = nums.length - 1;

    while (left < right) {
        let mid = left + Math.floor((right - left) / 2);

        if (nums[mid] > nums[mid + 1]) {
            right = mid;
        } else {
            left = mid + 1;
        }
    }

    return left;
}

console.log(findPeakElement([1,2,1,3,5,6,4]))
