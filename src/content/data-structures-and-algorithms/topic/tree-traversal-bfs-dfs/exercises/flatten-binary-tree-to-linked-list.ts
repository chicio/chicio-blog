/**
 * https://leetcode.com/problems/flatten-binary-tree-to-linked-list/description/
 * 114. Flatten Binary Tree to Linked List
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

function flatten(root: TreeNode | null): void {
    if (!root) {
        return
    }

    let stack = [root]
    let previous: TreeNode | null = null

    while (stack.length > 0) {
        const current = stack.pop()!

        if (previous) {
            previous.right = current
            previous.left = null
        }

        if (current.right) {
            stack.push(current.right)
        }

        if (current.left) {
            stack.push(current.left)
        }

        previous = current
    }
}

/// Recursive approach


function flattenList(root: TreeNode | null): TreeNode | null {
    if (root === null) {
        return null
    }

    if (root.left === null && root.right === null) {
        return root
    }

    let leftNode = flattenList(root.left)
    let rightNode = flattenList(root.right)

    if (leftNode) {
        leftNode.right = root.right
        root.right = root.left
        root.left = null
    }

    return rightNode || leftNode
}


function flatten2(root: TreeNode | null): void {
    if (root === null) {
        return
    }

    flattenList(root)
};
