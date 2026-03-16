/**
 * https://leetcode.com/problems/path-sum-iii/description/
 * 437. Path Sum III
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

function checkPathSum(root: TreeNode | null, targetSum: number): number {
    if (!root) {
        return 0
    }

    const validPath = root.val === targetSum ? 1 : 0

    return validPath + checkPathSum(root.left, targetSum - root.val) + checkPathSum(root.right, targetSum - root.val);
}

function pathSum(root: TreeNode | null, targetSum: number): number {
    if (!root) {
        return 0
    }

    let rootCount = checkPathSum(root, targetSum)
    let countLeft = pathSum(root.left, targetSum)
    let countRight = pathSum(root.right, targetSum)

    return rootCount + countLeft + countRight
}
