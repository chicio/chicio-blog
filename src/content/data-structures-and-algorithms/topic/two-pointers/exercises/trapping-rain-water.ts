/**
 * https://leetcode.com/problems/trapping-rain-water/description/
 * 42. Trapping Rain Water
 */


function trap(height: number[]): number {
    let left = 0
    let right = height.length - 1
    let maxLeft = 0
    let maxRight = 0
    let units = 0

    while (left < right) {
        maxLeft = Math.max(height[left], maxLeft)
        maxRight = Math.max(height[right], maxRight)

        if (maxLeft <= maxRight) {
            units = units + (maxLeft - height[left])
            left++
        } else {
            units = units + (maxRight - height[right])
            right--
        }
    }

    return units
};

console.log(trap([0,1,0,2,1,0,1,3,2,1,2,1]))