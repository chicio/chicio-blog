/**
 * https://leetcode.com/problems/binary-tree-paths/
 * 257. Binary Tree Paths
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

function binaryTreePathsRecursive(root: TreeNode | null, rootToLeafs: string[], path: string) {
    if (!root) {
        return
    }

    if (!root.left && !root.right) {
        rootToLeafs.push(`${path}${root.val}`)
        return
    }

    binaryTreePathsRecursive(root.left, rootToLeafs, `${path}${root.val}->`)
    binaryTreePathsRecursive(root.right, rootToLeafs, `${path}${root.val}->`)
}

function binaryTreePaths(root: TreeNode | null): string[] {
    const rootToLeafs: string[] = []
    binaryTreePathsRecursive(root, rootToLeafs, "")
    return rootToLeafs
};
