/**
 * https://leetcode.com/problems/binary-tree-postorder-traversal/description/
 * 145. Binary Tree Postorder Traversal
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

function postorderTraversal(root: TreeNode | null): number[] {
    let result: number[] = []

    if (root == null) {
        return result;
    }

    let stackVisit: TreeNode[] = [root]
    let stackVisited: number[] = []

    while (stackVisit.length > 0) {
        let current = stackVisit.pop()!
        stackVisited.push(current.val)

        if (current.left) {
            stackVisit.push(current.left)
        }

        if (current.right) {
            stackVisit.push(current.right)
        }
    }

    while (stackVisited.length > 0) {
        result.push(stackVisited.pop()!)
    }

    return result
}
