/**
 * https://leetcode.com/problems/copy-list-with-random-pointer/description/
 * Copy List with Random Pointer
 */

class _Node {
    val: number
    next: _Node | null
    random: _Node | null

    constructor(val?: number, next?: _Node, random?: _Node) {
        this.val = (val===undefined ? 0 : val)
        this.next = (next===undefined ? null : next)
        this.random = (random===undefined ? null : random)
    }
}

function copyRandomList(head: _Node | null): _Node | null {
    let nodes = new Map<_Node, _Node>() 
    let currentOld: _Node | null = head

    while (currentOld) {
        nodes.set(currentOld, new _Node(currentOld.val))
        currentOld = currentOld.next
    }
    
    currentOld = head

    while (currentOld) {
        let newNode: _Node = nodes.get(currentOld)!

        if(currentOld.random) {
            newNode.random = nodes.get(currentOld.random)!
        }

        if (currentOld.next) {
            newNode.next = nodes.get(currentOld.next)!
        }

        currentOld = currentOld.next
    }

    return nodes.get(head!)!
};