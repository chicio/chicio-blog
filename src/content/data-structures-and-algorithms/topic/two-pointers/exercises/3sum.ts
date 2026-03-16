/**
 * https://leetcode.com/problems/3sum/description/
 * 15. 3Sum
 */

function threeSum(nums: number[]): number[][] {
    nums.sort((a, b) => a - b)
    let tuples: number[][] = [];

    for (let i = 0; i < nums.length; i++) {
        let current = nums[i]

        if (i > 0 && current === nums[i - 1]) {
            continue; 
        }

        let first = i + 1
        let last = nums.length - 1

        while (first < last) {
            let sum = nums[first] + nums[last] + current 

            if (sum > 0) {
                last--
            } else if (sum < 0) {
                first++
            } else {
                tuples.push([current, nums[first], nums[last]])
                first++
                last--

                while (first < last && nums[first] === nums[first - 1]) { 
                    first++; 
                }
                while (first < last && nums[last] === nums[last + 1]) {
                    last--;
                } 
            }
        }
    }

    return tuples
};

console.log(threeSum([-1,0,1,2,-1,-4]))