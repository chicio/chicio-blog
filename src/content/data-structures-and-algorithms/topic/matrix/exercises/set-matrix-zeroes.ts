/**
 * https://leetcode.com/problems/set-matrix-zeroes/description/
 * Given an m x n integer matrix matrix, if an element is 0, set its entire row and column to 0's.
 */

 function setZeroes(matrix: number[][]): void {
    const rowsToBeZeroed = new Set<number>()
    const columnsToBeZeroed = new Set<number>()

    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            if (matrix[i][j] === 0) {
                rowsToBeZeroed.add(i)
                columnsToBeZeroed.add(j)
            }
        }
    }

    for(let row of rowsToBeZeroed.values()){
        for (let j = 0; j < matrix[row].length; j++) {
            matrix[row][j] = 0
        }
    }

    for(let column of columnsToBeZeroed.values()){
        for (let i = 0; i < matrix.length; i++) {
            matrix[i][column] = 0
        }
    }
};

console.log(setZeroes([[1,1,1],[1,0,1],[1,1,1]]))
console.log(setZeroes([[0,1,2,0],[3,4,5,2],[1,3,1,5]]))