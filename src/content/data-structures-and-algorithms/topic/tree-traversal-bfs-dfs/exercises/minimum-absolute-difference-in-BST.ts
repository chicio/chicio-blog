/**
 * https://leetcode.com/problems/minimum-absolute-difference-in-bst/description/
 * 530. Minimum Absolute Difference in BST
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

function getMinimumDifference(root: TreeNode | null): number {
    let stack: TreeNode[] = []
    let result: number[] = []
    let current = root
    let previous: number | null = null
    let min = Infinity

    while (current || stack.length > 0) {
        while (current) {
            stack.push(current)
            current = current.left
        }

        current = stack.pop()!

        if (previous !== null) {
            min = Math.min(min, Math.abs(current.val - previous))
        }

        previous = current.val
        current = current.right
    }

    return min
}
