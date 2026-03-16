/**
 * https://leetcode.com/problems/maximum-width-of-binary-tree/description/
 * 662. Maximum Width of Binary Tree
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

interface TreeNodeWithPosition {
    node: TreeNode
    position: number
}

function widthOfBinaryTree(root: TreeNode | null): number {
    if (!root) {
        return 0
    }

    let queue: TreeNodeWithPosition[] = [{ node: root, position: 0 }]
    let maxWidth = 0

    while (queue.length > 0) {
        let levelSize = queue.length
        let start = queue[0].position
        let end = queue[queue.length - 1].position - start

        while (levelSize > 0) {
            const currentNode = queue.shift()!
            const normalizedPos = currentNode.position - start

            if (currentNode.node.left) {
                queue.push({
                    node: currentNode.node.left,
                    position: 2 * normalizedPos
                })
            }

            if (currentNode.node.right) {
                queue.push({
                    node: currentNode.node.right,
                    position: 2 * normalizedPos + 1
                })
            }

            levelSize--
        }

        maxWidth = Math.max(maxWidth, end + 1)
    }

    return maxWidth
}
