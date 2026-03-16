/**
 * https://leetcode.com/problems/single-number-iii/
 * 260. Single Number III
 */

// I was going to loop to get the first bit difference but then I found this beautiful solution that leverages 
// the xor property and the two complements representation.
function singleNumber3(nums: number[]): number[] {
    let singleXorOtherSingle = nums.reduce((result, current) => result ^ current, 0)
    let bitDifference = singleXorOtherSingle & -singleXorOtherSingle
    let singleGroup = nums.filter(it => it & bitDifference)
    let otherSingleGroup = nums.filter(it => !(it & bitDifference))

    return [
        singleGroup.reduce((result, current) => result ^ current, 0),
        otherSingleGroup.reduce((result, current) => result ^ current, 0)
    ]
}

console.log(singleNumber3([1, 2, 1, 3, 2, 5]))