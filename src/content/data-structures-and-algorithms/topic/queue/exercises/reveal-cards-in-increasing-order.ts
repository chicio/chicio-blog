/**
 * https://leetcode.com/problems/reveal-cards-in-increasing-order/description/
 * 950. Reveal Cards In Increasing Order
 */

function deckRevealedIncreasing(deck: number[]): number[] {
    const deckSorted = deck.sort((a, b) => a - b)
    const neededPositions: number[] = []

    while (deckSorted.length > 0) {
        const nextElement = deckSorted.pop()!

        if (neededPositions.length > 0) {
            neededPositions.unshift(neededPositions.pop()!)
        }

        neededPositions.unshift(nextElement)
    }

    return neededPositions
}

console.log(deckRevealedIncreasing([17,13,11,2,3,5,7]))
console.log(deckRevealedIncreasing([1,1000]))

