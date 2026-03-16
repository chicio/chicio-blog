/**
 * https://leetcode.com/problems/time-needed-to-buy-tickets/description/
 * Time Needed to Buy Tickets
 */

function timeRequiredToBuy(tickets: number[], k: number): number {
    let numberOfTicketsNeeded = tickets[k]
    let time = 0

    while (tickets[k] > 0) {
        tickets[0]--
        let outOfQueue = tickets.shift()!

        if (outOfQueue > 0) {
            tickets.push(outOfQueue)
        }

        time++

        if (k === 0 && outOfQueue === 0) {
            return time
        }

        k = k > 0 ? --k % tickets.length : tickets.length - 1
    }

    return time
};
