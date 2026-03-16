/**
 * https://leetcode.com/problems/binary-tree-maximum-path-sum/description/
 * 124. Binary Tree Maximum Path Sum
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

function maxPathSum(root: TreeNode | null): number {
    let maxSum = -Infinity

    function sumPath(root: TreeNode | null) {
        if (!root) {
            return 0
        }

        const leftSum = Math.max(0, sumPath(root.left))
        const rightSum = Math.max(0, sumPath(root.right))
        const sum = root.val + leftSum + rightSum

        maxSum = Math.max(sum, maxSum)

        return root.val + Math.max(leftSum, rightSum)
    }

    sumPath(root)

    return maxSum
};