/**
 * https://leetcode.com/problems/populating-next-right-pointers-in-each-node-ii/description/
 * 117. Populating Next Right Pointers in Each Node II
 */

class _Node1 {
         val: number
         left: _Node1 | null
         right: _Node1 | null
         next: _Node1 | null

         constructor(val?: number, left?: _Node1, right?: _Node1, next?: _Node1) {
             this.val = (val===undefined ? 0 : val)
                 this.left = (left===undefined ? null : left)
                 this.right = (right===undefined ? null : right)
                 this.next = (next===undefined ? null : next)
         }
}

function connect(root: _Node1 | null): _Node1 | null {
    if (!root) {
        return null
    }

    let queue: _Node1[] = [root]

    while (queue.length > 0) {
        let levelSize = queue.length
        let previousNode = null

        while (levelSize > 0) {
            const currentNode = queue.shift()!

            if (previousNode) {
                previousNode.next = currentNode
            }

            if (currentNode.left) {
                queue.push(currentNode.left)
            }

            if (currentNode.right) {
                queue.push(currentNode.right)
            }

            previousNode = currentNode
            levelSize--
        }
    }

    return root
}
