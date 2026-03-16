/**
 * https://leetcode.com/problems/container-with-most-water/description/
 * 11. Container With Most Water
 */

function maxArea(height: number[]): number {
    let first = 0
    let last = height.length - 1
    let maxArea = 0

    while (first < last) {
        let smallerSide = height[first] > height[last] ? height[last] : height[first]
        maxArea = Math.max(maxArea, smallerSide * Math.abs(last - first))

        if (height[first] > height[last]) {
            last--
        } else {
            first++
        }
    }

    return maxArea
};

console.log(maxArea([1,8,6,2,5,4,8,3,7]))