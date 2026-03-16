/**
 * https://leetcode.com/problems/median-of-two-sorted-arrays/description/
 * 4. Median of Two Sorted Arrays
 */

function findMedianSortedArrays(nums1: number[], nums2: number[]): number {
    if (nums1.length > nums2.length) {
        return findMedianSortedArrays(nums2, nums1); // binary search sul più corto
    }

    const n = nums1.length;
    const m = nums2.length;
    const total = Math.floor((n + m + 1) / 2);

    let left = 0;
    let right = n;

    while (left <= right) {
        const i = left + Math.floor((right - left) / 2);
        const j = total - i;

        const Aleft = i > 0 ? nums1[i - 1] : -Infinity;
        const Aright = i < n ? nums1[i] : Infinity;
        const Bleft = j > 0 ? nums2[j - 1] : -Infinity;
        const Bright = j < m ? nums2[j] : Infinity;

        if (Aleft <= Bright && Bleft <= Aright) {
            if ((n + m) % 2 === 1) {
                return Math.max(Aleft, Bleft);
            } else {
                return (Math.max(Aleft, Bleft) + Math.min(Aright, Bright)) / 2;
            }
        } else if (Aleft > Bright) {
            right = i - 1;
        } else {
            left = i + 1;
        }
    }

    return -1
}

console.log(findMedianSortedArrays([1, 3], [2])); // Output: 2.00000
