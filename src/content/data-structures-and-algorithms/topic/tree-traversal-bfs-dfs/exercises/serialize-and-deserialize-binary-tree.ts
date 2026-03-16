/**
 * https://leetcode.com/problems/serialize-and-deserialize-binary-tree/description/
 * 297. Serialize and Deserialize Binary Tree
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

function levelOrderSerialize(root: TreeNode | null): string {
    if (!root) {
        return ''
    }

    let queue: (TreeNode | null)[] = [root]
    let levels: (number | null)[] = []

    while (queue.length > 0) {
        let current = queue.shift()

        if (current) {
            levels.push(current.val)
            queue.push(current.left)
            queue.push(current.right)
        } else {
            levels.push(null)
        }
    }

    while (levels[levels.length - 1] === null) {
        levels.pop();
    }

    return levels.map(v => v === null ? "null" : v.toString()).join(",");
};

/*
 * Encodes a tree to a single string.
 */
function serialize(root: TreeNode | null): string {
    return levelOrderSerialize(root)
};

function levelOrderDeserialize(data: string): TreeNode | null {
    if (data === '') {
        return null;
    }

    const values = data.split(',').map(v => v === "null" ? null : Number(v));
    const root = new TreeNode(values[0]!);
    const queue: TreeNode[] = [root];
    let i = 1;

    while (queue.length > 0 && i < values.length) {
        const node = queue.shift()!;

        const left = values[i++];

        if (left !== null) {
            node.left = new TreeNode(left);
            queue.push(node.left);
        }

        if (i < values.length) {
            const right = values[i++];

            if (right !== null) {
                node.right = new TreeNode(right);
                queue.push(node.right);
            }
        }
    }

    return root;
}

/*
 * Decodes your encoded data to tree.
 */
function deserialize(data: string): TreeNode | null {
    return levelOrderDeserialize(data)
};


/**
 * Your functions will be called as such:
 * deserialize(serialize(root));
 */
