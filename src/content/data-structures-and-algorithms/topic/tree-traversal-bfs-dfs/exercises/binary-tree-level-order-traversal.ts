/**
 * https://leetcode.com/problems/binary-tree-level-order-traversal/description/
 * 102. Binary Tree Level Order Traversal
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

function levelOrder(root: TreeNode | null): number[][] {
    if (!root) {
        return []
    }

    let queue: TreeNode[] = [root]
    let levels: number[][] = []

    while (queue.length > 0) {
        let levelSize = queue.length
        const level = []

        while (levelSize > 0) {
            let current = queue.shift()!

            if (current.left) {
                queue.push(current.left)
            }

            if (current.right) {
                queue.push(current.right)
            }

            level.push(current.val)
            levelSize--
        }

        levels.push(level)
    }

    return levels
};
