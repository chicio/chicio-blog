/**
 * https://leetcode.com/problems/powx-n/description/
 * 50. Pow(x, n)
 */


function myPow(x: number, n: number): number {
    if (n === 0) return 1;

    if (n < 0) {
        return 1 / myPow(x, -n);
    }

    const half = myPow(x, Math.floor(n / 2));

    if (n % 2 === 0) {
        return half * half;
    } else {
        return half * half * x;
    }
}

console.log(myPow(2, 10));
console.log(myPow(2, -2));
console.log(myPow(2.1, 3));
