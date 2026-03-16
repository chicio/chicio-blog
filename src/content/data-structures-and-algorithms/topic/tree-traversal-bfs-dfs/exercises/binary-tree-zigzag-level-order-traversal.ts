/**
 * https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal/description/
 * 103. Binary Tree Zigzag Level Order Traversal
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

function zigzagLevelOrder(root: TreeNode | null): number[][] {
    if (!root) {
        return []
    }

    let queue = [root]
    let levels: number[][] = []
    let levelIndex = 0

    while (queue.length > 0) {
        let levelSize = queue.length
        let level = []

        while (levelSize > 0) {
            let currentNode: TreeNode = queue.shift()!

            if (levelIndex % 2 === 0) {
                level.push(currentNode.val)
            } else {
                level.unshift(currentNode.val)
            }

            if (currentNode.left) {
                queue.push(currentNode.left)
            }

            if (currentNode.right) {
                queue.push(currentNode.right)
            }

            levelSize--
        }

        levelIndex++
        levels.push(level)
    }

    return levels
}
