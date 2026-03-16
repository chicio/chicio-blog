/**
 * https://leetcode.com/problems/bitwise-and-of-numbers-range/description/
 * 201. Bitwise AND of Numbers Range
 */

function rangeBitwiseAnd(left: number, right: number): number {
    let shift = 0

    while (left !== right) {
        left = left >> 1
        right = right >> 1
        shift++
    }

    return left << shift
};

// Beautiful solution from ChatGPT notes => use xor to find the different bits and then use the mask to get the result (common bits between left and right)
function rangeBitwiseAnd2(left: number, right: number): number {
    let diff = left ^ right;  
    let mask = ~diff + 1;     
    return left & mask;
};

console.log(rangeBitwiseAnd(5, 7))