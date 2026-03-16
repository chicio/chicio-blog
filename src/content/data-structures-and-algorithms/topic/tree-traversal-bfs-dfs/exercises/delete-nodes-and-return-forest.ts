/**
 * https://leetcode.com/problems/delete-nodes-and-return-forest/description/
 * 1110. Delete Nodes And Return Forest
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

function delNodes(root: TreeNode | null, to_delete: number[]): Array<TreeNode | null> {
    let result: (TreeNode | null)[] = []

    if (root == null) {
        return result;
    }

    let stackVisit: TreeNode[] = [root]
    let stackVisited: TreeNode[] = []
    let parents = new Map<TreeNode, TreeNode>()

    while (stackVisit.length > 0) {
        let current = stackVisit.pop()!
        stackVisited.push(current)

        if (current.left) {
            stackVisit.push(current.left)
            parents.set(current.left, current)
        }

        if (current.right) {
            stackVisit.push(current.right)
            parents.set(current.right, current)
        }
    }

    const toDelete = new Set(to_delete)

    while (stackVisited.length > 0) {
        const current = stackVisited.pop()!

        if (toDelete.has(current.val)) {
            if (current.left && !toDelete.has(current.left.val)) {
                result.push(current.left)
            }

            if (current.right && !toDelete.has(current.right.val)) {
                result.push(current.right)
            }

            const parent = parents.get(current)

            if (parent) {
                if (parent.left === current) {
                    parent.left = null
                } else {
                    parent.right = null
                }
            }
        }
    }

    if (!toDelete.has(root.val)) {
        result.push(root)
    }

    return result
}
