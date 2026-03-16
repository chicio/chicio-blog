/**
 * https://leetcode.com/problems/game-of-life/description/
 * 289. Game of Life
 */


/**
 Do not return anything, modify board in-place instead.
 */

 enum CellStatus {
    dead = 0,
    alive = 1,
    aliveToDead = 2,
    deadToAlive = 3
}

function gameOfLife(board: number[][]): void {
    for (let i = 0; i < board.length; i++) {
        for (let h = 0; h < board[i].length; h++) {
            
            let aliveCells = 0

            for (let k = i - 1; k <= i + 1; k++) {
                for (let j = h - 1; j <= h + 1; j++) {
                    if (k < 0 || j < 0 || k >= board.length || j >= board[i].length || (i == k && j === h)) {
                        continue
                    }

                    if (board[k][j] === CellStatus.aliveToDead || board[k][j] === CellStatus.alive) {
                        aliveCells++
                    }
                }
            }

            if ((aliveCells < 2 || aliveCells > 3) && (board[i][h] === CellStatus.alive || board[i][h] === CellStatus.aliveToDead)) {
                board[i][h] = CellStatus.aliveToDead
            } else if (aliveCells === 3 && (board[i][h] === 0 || board[i][h] === 3)) {
                board[i][h] = CellStatus.deadToAlive
            }
        }
    }

    for (let i = 0; i < board.length; i++) {
        for (let h = 0; h < board[i].length; h++) {
            board[i][h] = board[i][h] % 2
        }
    }
};


console.log(gameOfLife([[0,1,0],[0,0,1],[1,1,1],[0,0,0]]))
console.log(gameOfLife([[1,1],[1,0]]))
