/**
 * https://leetcode.com/problems/spiral-matrix/description/
 * 54. Spiral Matrix
 */

// My implementation, very bad one...
function spiralOrder(matrix: number[][]): number[] {
    let spirals = []
    let startingK = 0
    let endingK = matrix[0].length 
    let startingJ = 0
    let endingJ = matrix.length

    while (startingK < endingK && startingJ < endingJ) {
        let k = startingK
        let j = startingJ

        spirals.push(matrix[j][k++])

        while (k < endingK) {
            spirals.push(matrix[j][k++])
        }

        j++
        k--

        while (j < endingJ) {
            spirals.push(matrix[j++][k])
        }

        j--
        k--

        if (j > startingJ) {
            while (k > startingJ) {
                spirals.push(matrix[j][k--])
            }
        }

        if (k >= startingK) {
            while (j > startingJ) {
                spirals.push(matrix[j--][k])
            }
        }

        startingK++
        endingK--
        startingJ++
        endingJ--
    }

    return spirals   
};

/// Ashish implementation, better...
function spiralOrderBetter(matrix: number[][]): number[] {
    const result: number[] = [];
    if (matrix.length === 0) return result;
    
    let top = 0, bottom = matrix.length - 1;
    let left = 0, right = matrix[0].length - 1;
    
    while (top <= bottom && left <= right) {
        // Traverse from left to right along the top row
        for (let i = left; i <= right; i++) {
            result.push(matrix[top][i]);
        }
        top++;
        
        // Traverse from top to bottom along the right column
        for (let i = top; i <= bottom; i++) {
            result.push(matrix[i][right]);
        }
        right--;
        
        if (top <= bottom) {
            // Traverse from right to left along the bottom row
            for (let i = right; i >= left; i--) {
                result.push(matrix[bottom][i]);
            }
            bottom--;
        }
        
        if (left <= right) {
            // Traverse from bottom to top along the left column
            for (let i = bottom; i >= top; i--) {
                result.push(matrix[i][left]);
            }
            left++;
        }
    }
    
    return result;
}