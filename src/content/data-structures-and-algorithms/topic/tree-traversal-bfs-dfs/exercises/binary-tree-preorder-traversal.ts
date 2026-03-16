/**
 * https://leetcode.com/problems/binary-tree-preorder-traversal/description/
 * 144. Binary Tree Preorder Traversal
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


// Iterative Preorder Traversal

function preorderTraversalIterative(root: TreeNode | null): number[] {
    if (!root) {
        return []
    }

    let stack = [root]
    let preorder: number[] = []

    while (stack.length > 0) {
        const current = stack.pop()!
        preorder.push(current.val)

        if (current.right) {
            stack.push(current.right)
        }

        if (current.left) {
            stack.push(current.left)
        }
    }

    return preorder
}

// Recursive Preorder Traversal
function traverse(node: TreeNode | null, preorder: number[]) {
    if (!node) {
        return
    }

    preorder.push(node.val)

    traverse(node.left, preorder)
    traverse(node.right, preorder)
}

function preorderTraversalRecursive(root: TreeNode | null): number[] {
    const preorder: number[] = []

    traverse(root, preorder)
    return preorder
}
