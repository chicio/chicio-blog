/**
 * https://leetcode.com/problems/diameter-of-binary-tree/description/
 * 543. Diameter of Binary Tree
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

function diameterOfBinaryTree(root: TreeNode | null): number {
    let maxDiameter = 0

    function height(root: TreeNode | null): number {
        if (!root) {
            return 0
        }

        const leftHeight = height(root.left)
        const rightHeight = height(root.right)

        maxDiameter = Math.max(maxDiameter, leftHeight + rightHeight)

        return 1 + Math.max(leftHeight, rightHeight)
    }

    height(root)

    return maxDiameter
}
