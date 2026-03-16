/**
 * https://leetcode.com/problems/flatten-a-multilevel-doubly-linked-list/description/
 * 430. Flatten a Multilevel Doubly Linked List
 */

class _NodeDouble {
    val: number
    prev: _NodeDouble | null
    next: _NodeDouble | null
    child: _NodeDouble | null
    
    constructor(val?: number, prev? : _NodeDouble, next? : _NodeDouble, child? : _NodeDouble) {
        this.val = (val===undefined ? 0 : val);
        this.prev = (prev===undefined ? null : prev);
        this.next = (next===undefined ? null : next);
        this.child = (child===undefined ? null : child);
    }
}

function flatten(head: _NodeDouble | null): _NodeDouble | null {
    let current: _NodeDouble | null = head

    while (current) {
        if (current.child) {
            let currentChild =  current.child
            
            while (currentChild.next) {
                currentChild = currentChild.next
            }

            let currentNext = current.next
            
            if (currentNext) {
                currentChild.next = currentNext
                currentNext.prev = currentChild
            }

            current.next = current.child
            current.child.prev = current

            current.child = null
        } 
          
        current = current.next
    }

    return head
};