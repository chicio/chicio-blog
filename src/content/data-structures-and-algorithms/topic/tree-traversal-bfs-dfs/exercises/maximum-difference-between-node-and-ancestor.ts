/**
 * https://leetcode.com/problems/maximum-difference-between-node-and-ancestor/
 * 1026. Maximum Difference Between Node and Ancestor
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

interface SubTreeMaxMin {
    max: number
    min: number
}

function findDiff(root: TreeNode | null, currentMaxMin: SubTreeMaxMin): number {
    if (!root) {
        return currentMaxMin.max - currentMaxMin.min
    }

    const newMaxMin = {
        min: Math.min(currentMaxMin.min, root.val),
        max: Math.max(currentMaxMin.max, root.val)
    }
    const leftDiff = findDiff(root.left, newMaxMin)
    const rightDiff = findDiff(root.right, newMaxMin)

    return Math.max(rightDiff, leftDiff)
}

function maxAncestorDiff(root: TreeNode | null): number {
    const defaultMinMax = { max: -Infinity, min: Infinity }
    return findDiff(root, defaultMinMax)
}
