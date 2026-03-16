/**
 * https://leetcode.com/problems/invert-binary-tree/description/
 * 226. Invert Binary Tree
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

function invertTree(root: TreeNode | null): TreeNode | null {
    if (root === null) {
        return root
    }

    const leftNode = invertTree(root.left)
    const rightNode = invertTree(root.right)

    root.left = rightNode
    root.right = leftNode

    return root
}
