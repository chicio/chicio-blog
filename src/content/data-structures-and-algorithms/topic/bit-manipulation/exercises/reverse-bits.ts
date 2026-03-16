/**
 * https://leetcode.com/problems/reverse-bits/description/
 * 190. Reverse Bits
 */

function reverseBits(n: number): number {
    let reversedN = 0

	for (let i = 0; i < 32; i++) {
        let currentBit = n & 1
        reversedN = (reversedN << 1) | currentBit;
        n = n >>> 1 
    }

    return reversedN >>> 0
};

console.log(reverseBits(43261596))