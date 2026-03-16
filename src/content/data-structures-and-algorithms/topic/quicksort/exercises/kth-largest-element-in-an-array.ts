/**
 * https://leetcode.com/problems/kth-largest-element-in-an-array/description/
 * 215. Kth Largest Element in an Array
 */
import {Heap} from "../heap";

/// Solution with min heap

function findKthLargest(nums: number[], k: number): number {
    let heap = new Heap<number>((a, b) => a - b)

    for (const num of nums) {
        heap.insert(num)

        if(heap.size() > k) {
            heap.extract()
        }
    }

    return heap.peek()!
}

console.log(findKthLargest([3,2,3,1,2,4,5,5,6], 4))

/// Solution using Quick Select algorithm
function partition(nums: number[], left: number, right: number, pivotIndex: number) {
    const pivot = nums[pivotIndex];
    [nums[pivotIndex], nums[right]] = [nums[right], nums[pivotIndex]];

    let partitionIndex = left

    for (let i = left; i < right; i++) {
        if (nums[i] < pivot) {
            [nums[partitionIndex], nums[i]] = [nums[i], nums[partitionIndex]]
            partitionIndex++
        }
    }

    [nums[partitionIndex], nums[right]] = [nums[right], nums[partitionIndex]]

    return partitionIndex
}

function quickSelect(nums: number[], left: number, right: number, k: number): number {
    if (left === right) {
        return nums[left];
    }

    const pivotIndex = Math.floor(Math.random() * (right - left + 1)) + left
    const pivot = nums[pivotIndex];
    const partitionIndex = partition(nums, left, right, pivotIndex)

    if (partitionIndex > k) {
        return quickSelect(nums, left, partitionIndex - 1, k)
    } else if (partitionIndex < k) {
        return quickSelect(nums, partitionIndex + 1, right, k)
    } else {
        return nums[partitionIndex]
    }
}

function findKthLargestQS(nums: number[], k: number): number {
    let realK = nums.length - k

    return quickSelect(nums, 0, nums.length - 1, realK)
};
