/**
 * 61. Rotate List
 *
 * Given the head of a linked list, rotate the list to the right by k places.
 *
 *
 *
 * Example 1:
 *
 *
 * Input: head = [1,2,3,4,5], k = 2
 * Output: [4,5,1,2,3]
 * Example 2:
 *
 *
 * Input: head = [0,1,2], k = 4
 * Output: [2,0,1]
 *
 *
 * Constraints:
 *
 * The number of nodes in the list is in the range [0, 500].
 * -100 <= Node.val <= 100
 * 0 <= k <= 2 * 109
 */

import { ListNode } from "../list-node"

function rotateRight(head: ListNode | null, k: number): ListNode | null {
    if (!head || k === 0) {
        return head
    }

    let dummy = new ListNode(-1, head)
    let slow: ListNode | null = dummy
    let fast: ListNode | null = dummy
    let current: ListNode | null = head
    let total = 0

    while (current) {
        current = current.next
        total++
    }

    let rotation = Math.floor(k % total)

    if (rotation === 0) {
        return head
    }

    for (let i = 0; i < rotation; i++) {
        fast = fast!.next
    }

    while (fast?.next) {
        slow = slow!.next
        fast = fast.next
    }

    let newHead = slow!.next
    slow!.next = null
    fast!.next = head
    head = newHead

    return head
};
