/**
 * https://leetcode.com/problems/count-complete-tree-nodes/description/
 * 222. Count Complete Tree Nodes
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

function countNodes(root: TreeNode | null): number {
    if (!root) {
        return 0
    }

    let countLeft = countNodes(root.left)
    let countRight = countNodes(root.right)

    return 1 + countLeft + countRight
};
