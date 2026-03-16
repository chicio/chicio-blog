/**
 * https://leetcode.com/problems/valid-sudoku/description/
 * 36. Valid Sudoku
 */

function isValidSudoku(board: string[][]): boolean {
    let previous = new Set<string>()

    // Each row must contain the digits 1-9
    for (let i = 0; i < 9; i++) {
        previous.clear()
        for (let j = 0; j < 9; j++) {
            let element = board[i][j];
            if (element !== ".") {
                if (previous.has(element)) {
                    return false;
                }
                previous.add(element);
            }
        }
    }

    // Each column must contain the digits 1-9
    for (let i = 0; i < 9; i++) {
        previous.clear()
        for (let j = 0; j < 9; j++) {
            let element = board[j][i];
            if (element !== ".") {
                if (previous.has(element)) {
                    return false;
                }
                previous.add(element);
            }
        }
    }

    // Each 3x3 submatrix of the grid must contain the digits 1-9
    for (let gridRow = 0; gridRow < 3; gridRow++) {
        for (let gridCol = 0; gridCol < 3; gridCol++) {
            previous.clear()
            for (let i = gridRow * 3; i < gridRow * 3 + 3; i++) {
                for (let j = gridCol * 3; j < gridCol * 3 + 3; j++) {
                    let element = board[i][j];
                    if (element !== ".") {
                        if (previous.has(element)) {
                            return false;
                        }
                        previous.add(element);
                    }
                }
            }
        }
    }

    return true;
}

console.log(isValidSudoku([["5","3",".",".","7",".",".",".","."],["6",".",".","1","9","5",".",".","."],[".","9","8",".",".",".",".","6","."],["8",".",".",".","6",".",".",".","3"],["4",".",".","8",".","3",".",".","1"],["7",".",".",".","2",".",".",".","6"],[".","6",".",".",".",".","2","8","."],[".",".",".","4","1","9",".",".","5"],[".",".",".",".","8",".",".","7","9"]]))