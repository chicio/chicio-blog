/**
 * https://leetcode.com/problems/rotate-image/description/
 * 48. Rotate Image
 */

/**
 Do not return anything, modify matrix in-place instead.
 */

 function transposeMatrix(matrix: number[][]): void {
    const n = matrix.length;
    
    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
            [matrix[i][j], matrix[j][i]] = [matrix[j][i], matrix[i][j]];
        }
    }
}

function mirrorMatrix(matrix: number[][]): void {
    const n = matrix.length

    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n / 2; j++) {
            [matrix[i][j], matrix[i][n - j - 1]] = [matrix[i][n - j - 1], matrix[i][j]];
        }
    }
}

function rotate(matrix: number[][]): void {
    transposeMatrix(matrix)
    mirrorMatrix(matrix)
};

console.log(rotate([[1,2,3],[4,5,6],[7,8,9]]))
console.log(rotate([[5,1,9,11],[2,4,8,10],[13,3,6,7],[15,14,12,16]]))