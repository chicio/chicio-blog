/**
 * https://leetcode.com/problems/shortest-path-in-a-grid-with-obstacles-elimination/description/
 * 1293. Shortest Path in a Grid with Obstacles Elimination
 */

function shortestPath(grid: number[][], k: number): number {
    const rows = grid.length;
    const cols = grid[0].length;
    const visited = Array.from(
        { length: rows },
        () => Array(cols).fill(-1)
    );

    const queue: [number, number, number][] = [[0, 0, k]];
    visited[0][0] = k;

    let steps = 0;

    const dirs = [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1]
    ];

    while (queue.length > 0) {
        let levelSize = queue.length;

        while (levelSize-- > 0) {
            const [row, col, kLeft] = queue.shift()!;

            if (row === rows - 1 && col === cols - 1) {
                return steps;
            }

            for (const [dr, dc] of dirs) {
                const newRow = row + dr;
                const newColumn = col + dc;

                if (newRow < 0 || newColumn < 0 || newRow >= rows || newColumn >= cols) { 
                    continue;
                }

                const newK = kLeft - grid[newRow][newColumn];

                if (newK >= 0 && newK > visited[newRow][newColumn]) {
                    visited[newRow][newColumn] = newK;
                    queue.push([newRow, newColumn, newK]);
                }
            }
        }

        steps++;
    }

    return -1;
}

console.log(shortestPath([[0,0,0],[1,1,0],[0,0,0],[0,1,1],[0,0,0]], 1)); // Output: 6