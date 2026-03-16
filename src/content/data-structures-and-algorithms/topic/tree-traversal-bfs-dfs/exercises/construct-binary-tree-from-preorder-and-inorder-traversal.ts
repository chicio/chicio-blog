/**
 * https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/description/
 * 105. Construct Binary Tree from Preorder and Inorder Traversal
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

function buildTreeWith(
    preorder: number[],
    inorder: number[],
    inorderRootIndexes: Map<number, number>
) {
    if (preorder.length === 0 || inorder.length === 0) {
        return null
    }

    const root = preorder[0]
    const rootIndex = inorderRootIndexes.get(root)!

    return new TreeNode(
        root,
        buildTree(preorder.slice(1, rootIndex + 1), inorder.slice(0, rootIndex)),
        buildTree(preorder.slice(rootIndex + 1, preorder.length), inorder.slice(rootIndex + 1, inorder.length))
    )
}

function buildTree(preorder: number[], inorder: number[]): TreeNode | null {
    const inorderIndexes = new Map<number, number>()

    for (let i = 0; i < inorder.length; i++) {
        inorderIndexes.set(inorder[i], i)
    }

    return buildTreeWith(preorder, inorder, inorderIndexes)
}
