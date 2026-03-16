/**
 * https://leetcode.com/problems/reverse-pairs/description/
 * 493. Reverse Pairs
 */

function mergeSortAndCount(nums: number[]): { sorted: number[], count: number } {
    if (nums.length <= 1) {
        return { sorted: nums, count: 0 };
    }

    const mid = Math.floor(nums.length / 2);
    const left = mergeSortAndCount(nums.slice(0, mid));
    const right = mergeSortAndCount(nums.slice(mid));

    let count = left.count + right.count;
    let j = 0;

    for (let i = 0; i < left.sorted.length; i++) {
        while (j < right.sorted.length && left.sorted[i] > 2 * right.sorted[j]) {
            j++;
        }
        count += j;
    }

    let merged: number[] = [];
    let i = 0;
    j = 0;

    while (i < left.sorted.length && j < right.sorted.length) {
        if (left.sorted[i] < right.sorted[j]) {
            merged.push(left.sorted[i++]);
        } else {
            merged.push(right.sorted[j++]);
        }
    }

    while (i < left.sorted.length) {
        merged.push(left.sorted[i++]);
    }

    while (j < right.sorted.length) {
        merged.push(right.sorted[j++]);
    }

    return { sorted: merged, count };
}

function reversePairs(nums: number[]): number {
    return mergeSortAndCount(nums).count;
}

console.log(reversePairs([1,3,2,3,1]));
