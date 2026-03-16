/**
 * https://leetcode.com/problems/binary-tree-right-side-view/description/
 * 199. Binary Tree Right Side View
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

function rightSideView(root: TreeNode | null): number[] {
    if (!root) {
        return []
    }

    let queue: TreeNode[] = [root]
    let results: number[] = []

    while (queue.length > 0) {
        let levelSize = queue.length

        while (levelSize > 0) {
            const currentNode = queue.shift()!

            if (levelSize === 1) {
                results.push(currentNode.val)
            }

            if (currentNode.left) {
                queue.push(currentNode.left)
            }

            if (currentNode.right) {
                queue.push(currentNode.right)
            }

            levelSize--
        }
    }

    return results
}
