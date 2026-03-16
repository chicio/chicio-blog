/**
 * https://leetcode.com/problems/sort-colors/description/
 * 75. Sort Colors
 */

 function sortColors(nums: number[]): void {
    let colorsCount: Record<number, number> = {
        0: 0,
        1: 0,
        2: 0
    }

    for (let i = 0; i < nums.length; i++) {
        colorsCount[nums[i]] = colorsCount[nums[i]] + 1
    }

    for (let i = 0; i < colorsCount[0]; i++) {
        nums[i] = 0
    }

    for (let i = colorsCount[0]; i < colorsCount[0] + colorsCount[1]; i++) {
        nums[i] = 1
    }

    for (let i = colorsCount[0] + colorsCount[1]; i < nums.length; i++) {
        nums[i] = 2
    }
};

console.log(sortColors([2,0,2,1,1,0]))