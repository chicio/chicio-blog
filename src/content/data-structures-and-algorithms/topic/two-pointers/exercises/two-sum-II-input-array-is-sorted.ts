/**
 * https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/description/
 * 167. Two Sum II - Input Array Is Sorted
 */

function twoSum(numbers: number[], target: number): number[] {
    let first = 0
    let last = numbers.length - 1

    while (first < last) {
        let sum = numbers[first] + numbers[last]
        
        if (sum === target) {
            return [++first, ++last]
        }

        if (sum < target) {
            first++
        } else {
            last--
        }
    }

    return [-1, -1]
};

console.log(twoSum([2,7,11,15], 9))