/**
 * https://leetcode.com/problems/random-pick-with-weight/description/
 * 528. Random Pick with Weight
 */

class Solution {
    private prefix: number[] = []
    private total: number = 0;

    constructor(w: number[]) {
        let sum = 0;

        for (const weight of w) {
            this.total += weight;
            this.prefix.push(this.total);
        }
    }

    pickIndex(): number {
        let left = 0
        let right = this.prefix.length - 1
        const r = Math.floor(Math.random() * this.total) + 1;

        while (left < right) {
            const mid = left + Math.floor((right - left) / 2);

            if (this.prefix[mid] < r) {
                left = mid + 1;
            } else {
                right = mid;
            }
        }

        return left
    }
}
