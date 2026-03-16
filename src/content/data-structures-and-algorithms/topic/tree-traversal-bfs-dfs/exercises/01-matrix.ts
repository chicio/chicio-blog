/**
 * https://leetcode.com/problems/01-matrix/
 * 542. 01 Matrix
 */

function updateMatrix(mat: number[][]): number[][] {
    const rows = mat.length
    const columns = mat[0].length
    const queue: [number, number][] = []
    const distances: number[][] = Array.from({ length: rows }, () =>
        Array(columns).fill(0)
    )

    for (let row = 0; row < rows; row++) {
        for (let column = 0; column < columns; column++) {
            if (mat[row][column] === 0) {
                queue.push([row, column])
            }
        }
    }

    while (queue.length > 0) {
        const [row, column] = queue.shift()!
        const currentDistance = distances[row][column] + 1

        if (
            row - 1 >= 0 && 
            mat[row - 1][column] === 1 && 
            distances[row - 1][column] === 0
        ) {
            distances[row - 1][column] = currentDistance
            queue.push([row - 1, column])
        }

        if (
            column + 1 < columns && 
            mat[row][column + 1] === 1 && 
            distances[row][column + 1] === 0
        ) {
            distances[row][column + 1] = currentDistance
            queue.push([row, column + 1])
        }

        if (
            row + 1 < rows && 
            mat[row + 1][column] === 1 && 
            distances[row + 1][column] === 0            
        ) {
            distances[row + 1][column] = currentDistance
            queue.push([row + 1, column])
        }

        if (
            column - 1 >= 0 && 
            mat[row][column - 1] === 1 &&
            distances[row][column - 1] === 0
        ) {
            distances[row][column - 1] = currentDistance
            queue.push([row, column - 1])
        }
    }

    return distances
};

console.log(updateMatrix([[0,0,0],[0,1,0],[0,0,0]])) // [[0,0,0],[0,1,0],[0,0,0]]
console.log(updateMatrix([[0,0,0],[0,1,0],[1,1,1]])) // [[0,0,0],[0,1,0],[1,2,1]]