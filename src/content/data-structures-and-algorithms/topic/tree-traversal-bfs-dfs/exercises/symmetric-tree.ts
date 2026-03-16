/**
 * https://leetcode.com/problems/symmetric-tree/description/
 * 101. Symmetric Tree
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

function isSymmetricRecursive(p: TreeNode | null, q: TreeNode | null): boolean {
    if (!p && !q) {
        return true
    }

    if (!p || !q) {
        return false
    }

    return p.val === q.val && isSymmetricRecursive(p.left, q.right) && isSymmetricRecursive(p.right, q.left)
}


function isSymmetric(root: TreeNode | null): boolean {
    if (!root) {
        return true
    }

    return isSymmetricRecursive(root.left, root.right)
}
