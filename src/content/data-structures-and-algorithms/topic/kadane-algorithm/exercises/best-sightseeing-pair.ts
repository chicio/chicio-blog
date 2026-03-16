/**
 * https://leetcode.com/problems/best-sightseeing-pair/
 * 1014. Best Sightseeing Pair
 */

function maxScoreSightseeingPair(values: number[]): number {
    let maxElementIPlusIndexI = 0
    let bestSightseeingPair = 0

    for (let j = 1, i = 0; j < values.length; j++, i++) {
        maxElementIPlusIndexI = Math.max(maxElementIPlusIndexI, values[i] + i)
        bestSightseeingPair = Math.max(bestSightseeingPair, maxElementIPlusIndexI + values[j] - j)
    }

    return bestSightseeingPair
};

console.log(maxScoreSightseeingPair([5,1,8,2,6]))