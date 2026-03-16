/**
 * https://leetcode.com/problems/find-duplicate-subtrees/description/
 * 652. Find Duplicate Subtrees
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

function findDuplicateSubtrees(root: TreeNode | null): Array<TreeNode | null> {
    let paths = new Map<string, number>()
    let results: TreeNode[] = []

    function pathSerialization(root: TreeNode | null): string {
        if (!root) {
            return `#`
        }

        let left = pathSerialization(root.left)
        let right = pathSerialization(root.right)
        let serializedPath = `${left},${right},${root.val}`

        if (paths.has(serializedPath) && paths.get(serializedPath)! === 1) {
            results.push(root)
            paths.set(serializedPath, paths.get(serializedPath)! + 1)
        } else {
            paths.set(serializedPath, (paths.get(serializedPath) || 0) + 1)
        }

        return serializedPath
    }

    pathSerialization(root)

    return results
}
