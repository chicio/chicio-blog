/**
 * https://leetcode.com/problems/sum-of-two-integers/description/
 * 371. Sum of Two Integers
 */

// Well, this is quite a bit of a challenge. 
// After getting the general approach, i was getting lost in the loop with temp variables....
function getSum(a: number, b: number): number {
    let carry = a & b
    let sum = a ^ b

    while (carry) {
        let carryShift = carry << 1
        carry = sum & carryShift
        sum = sum ^ carryShift
    }

    return sum
};

console.log(getSum(3, 2))