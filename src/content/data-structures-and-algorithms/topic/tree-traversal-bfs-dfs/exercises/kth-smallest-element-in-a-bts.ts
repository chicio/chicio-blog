/**
 * https://leetcode.com/problems/kth-smallest-element-in-a-bst/description/
 * 230. Kth Smallest Element in a BST
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

function kthSmallest(root: TreeNode | null, k: number): number {
    let stack: TreeNode[] = []
    let current = root
    let currentIndex = 1

    while (current || stack.length > 0) {
        while (current) {
            stack.push(current)
            current = current.left
        }

        current = stack.pop()!

        if (currentIndex++ === k) {
            return current.val
        }

        current = current.right
    }

    return -1
}
