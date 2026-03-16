/**
 * https://leetcode.com/problems/koko-eating-bananas/description/
 * 875. Koko Eating Bananas
 */

function hoursFor(piles: number[], k: number) {
    let hoursNeeded = 0;

    for (const pile of piles) {
        hoursNeeded += Math.ceil(pile / k);
    }

    return hoursNeeded
}

function minEatingSpeed(piles: number[], h: number): number {
    let left = 1
    let right = Math.max(...piles)

    while (left < right) {
        const mid = left + Math.floor((right - left) / 2)

        if (hoursFor(piles, mid) > h) {
            left = mid + 1
        } else {
            right = mid
        }
    }

    return left
}

console.log(minEatingSpeed([30,11,23,4,20], 5)); // Output: 30
