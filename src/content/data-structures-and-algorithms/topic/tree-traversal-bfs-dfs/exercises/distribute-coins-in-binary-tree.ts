/**
 * https://leetcode.com/problems/distribute-coins-in-binary-tree/description/
 * 979. Distribute Coins in Binary Tree
 */

export class TreeNode {
    val: number
    left: TreeNode | null
    right: TreeNode | null

    constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null) {
        this.val = (val === undefined ? 0 : val)
        this.left = (left === undefined ? null : left)
        this.right = (right === undefined ? null : right)
    }
}

function distributeCoins(root: TreeNode | null): number {
    let moves = 0

    function distribute(root: TreeNode | null): number {
        if (!root) {
            return 0
        }

        const leftExcess = distribute(root.left)
        const rightExcess = distribute(root.right)
        const excess = root.val + leftExcess + rightExcess - 1

        moves += Math.abs(leftExcess) + Math.abs(rightExcess)

        return excess
    }

    distribute(root)

    return moves
}
