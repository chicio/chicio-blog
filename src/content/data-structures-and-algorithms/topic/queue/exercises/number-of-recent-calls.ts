/**
 * https://leetcode.com/problems/number-of-recent-calls/
 * 933. Number of Recent Calls
 */

class RecentCounter {
    constructor(
        private requests: number[] = []
    ) { }

    ping(t: number): number {
        let lowerBoundRequests = t - 3000
        this.requests.push(t)

        while (this.requests[0] < lowerBoundRequests) {
            this.requests.shift()
        }

        return this.requests.length
    }
}
