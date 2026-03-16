/**
 * https://leetcode.com/problems/same-tree/description/
 * 100. Same Tree
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

function isSameTree(p: TreeNode | null, q: TreeNode | null): boolean {
    if (!p && !q) {
        return true
    }

    if (!p || !q) {
        return false
    }

    return p.val === q.val && isSameTree(p.left, q.left) && isSameTree(p.right, q.right)
}
