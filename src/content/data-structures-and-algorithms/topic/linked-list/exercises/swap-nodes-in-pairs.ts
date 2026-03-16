/**
 * https://leetcode.com/problems/swap-nodes-in-pairs/description/
 * 24. Swap Nodes in Pairs
 */

import { ListNode } from "../list-node"

function swapPairs(head: ListNode | null): ListNode | null {
    let dummy = new ListNode(-1, head)
    let current: ListNode | null = dummy

    while (current) {
        let first: ListNode | null = current.next ?? null
        let second: ListNode | null = first?.next ?? null
        let next: ListNode | null = second?.next ?? null

        if (first && second) {
            current.next = second
            second.next = first
            first.next = next
        }

        current = first
    }

    return dummy.next
}
