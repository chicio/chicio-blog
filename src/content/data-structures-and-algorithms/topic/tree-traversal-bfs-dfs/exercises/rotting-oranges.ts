/**
 * https://leetcode.com/problems/rotting-oranges/description/
 * 994. Rotting Oranges
 */

function orangesRotting(grid: number[][]): number {
    const rows = grid.length
    const columns = grid[0].length
    const queue: [number, number][] = []
    let fresh = 0

    for (let row = 0; row < rows; row++) {
        for (let column = 0; column < columns; column++) {
            if (grid[row][column] === 2) {
                queue.push([row, column])
            }

            if (grid[row][column] === 1) {
                fresh++
            }
        }
    }

    let time = 0

    while (queue.length > 0) {
        let currentLevelCount = queue.length

        for (let i = 0; i < currentLevelCount; i++) {
            const [row, column] = queue.shift()!

            if (row - 1 >= 0 && grid[row - 1][column] === 1) {
                grid[row - 1][column] = 2
                queue.push([row - 1, column])
                fresh--
            }

            if (column + 1 < columns && grid[row][column + 1] === 1) {
                grid[row][column + 1] = 2
                queue.push([row, column + 1])
                fresh--
            }

            if (row + 1 < rows && grid[row + 1][column] === 1) {
                grid[row + 1][column] = 2
                queue.push([row + 1, column])
                fresh--
            }

            if (column - 1 >= 0 && grid[row][column - 1] === 1) {
                grid[row][column - 1] = 2
                queue.push([row, column - 1]) 
                fresh--
            }
        }

        if (queue.length > 0) {
            time++
        }
    }

    return fresh === 0 ? time : -1
};

console.log(orangesRotting([[2,1,1],[1,1,0],[0,1,1]])) // 4
console.log(orangesRotting([[2,1,1],[0,1,1],[1,0,1]])) // -1
console.log(orangesRotting([[0,2]])) // 0