/**
 * https://leetcode.com/problems/single-number/description/
 * 136. Single Number
 */

const singleNumber = (nums: number[]) => nums.reduce((accumulator, current) => accumulator ^ current)