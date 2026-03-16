/**
 * https://leetcode.com/problems/bus-routes/description/
 * 815. Bus Routes
 */

function numBusesToDestination(routes: number[][], source: number, target: number): number {
    if (source === target) {
        return 0
    }

    let busesForEachStop = new Map<number, number[]>()

    for (let bus = 0; bus < routes.length; bus++) {
        let busRoute = routes[bus]

        for (let k = 0; k < busRoute.length; k++) {
            let stop = busRoute[k]

            if (busesForEachStop.has(stop)) {
               busesForEachStop.set(stop, [...busesForEachStop.get(stop)!, bus])     
            } else {
                busesForEachStop.set(stop, [bus])
            }
        }
    }

    let queue = busesForEachStop.get(source)
    let visitedStops = new Set<number>()
    let visitedBuses = new Set<number>(queue)
    let numberOfBusesNeeded = 1

    while (queue && queue.length > 0) {
        let currentNumberOfBuses = queue.length

        while (currentNumberOfBuses > 0) {
            let bus = queue.shift()!
            let busRoute = routes[bus]

            for (let stopPosition = 0; stopPosition < busRoute.length; stopPosition++) {
                let stop = busRoute[stopPosition]

                if (visitedStops.has(stop)) {
                    continue;
                }

                visitedStops.add(stop)

                if (stop === target) {
                    return numberOfBusesNeeded
                }

                const busesForStop = busesForEachStop.get(stop)!

                for (let busForStopPosition = 0; busForStopPosition < busesForStop.length; busForStopPosition++) {
                    let bus = busesForStop[busForStopPosition]
                    if (!visitedBuses.has(bus)) {
                        visitedBuses.add(bus)
                        queue.push(bus)
                    }
                }
            }

            currentNumberOfBuses--
        }

        numberOfBusesNeeded++
    }

    return -1
};

console.log(numBusesToDestination([[1,2,7],[3,6,7]], 1, 6)) // 2
console.log(numBusesToDestination([[7,12],[4,5,15],[6],[15,19],[9,12,13]], 15, 12)) // -1