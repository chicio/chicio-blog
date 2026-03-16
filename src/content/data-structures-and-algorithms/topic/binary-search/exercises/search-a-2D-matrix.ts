/**
 * https://leetcode.com/problems/search-a-2d-matrix/description/
 * 74. Search a 2D Matrix
 */

function searchMatrix(matrix: number[][], target: number): boolean {
    let m = matrix.length
    let n = matrix[0].length
    let cells = m * n
    let left = 0
    let right = cells - 1

    while (left <= right) {
        let mid = left + Math.floor((right - left) / 2)
        let currentM = Math.floor(mid / n)
        let currentN = mid % n

        if (matrix[currentM][currentN] === target) {
            return true
        }

        if (matrix[currentM][currentN] > target) {
            right = mid - 1
        } else {
            left = mid + 1
        }
    }

    return false
}

console.log(searchMatrix([[1,3,5,7],[10,11,16,20],[23,30,34,60]], 3)) // true
console.log(searchMatrix([[1,3,5,7],[10,11,16,20],[23,30,34,60]], 13)) // true
