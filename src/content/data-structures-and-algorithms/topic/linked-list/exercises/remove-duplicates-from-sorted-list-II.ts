/**
 * https://leetcode.com/problems/remove-duplicates-from-sorted-list-ii/description/
 * 82. Remove Duplicates from Sorted List II
 */

import { ListNode } from "../list-node"

function deleteDuplicates(head: ListNode | null): ListNode | null {
    if (!head) {
        return null
    }

    let current: ListNode | null = new ListNode(-1, head)

    while (current) {
        if (current.next && current.next?.val === current.next?.next?.val) {
            let value = current.next.val
            let toBeRemoved: ListNode | null = current.next

            while (toBeRemoved?.val === value) {
                if (toBeRemoved === head) {
                    head = head.next
                }
                toBeRemoved = toBeRemoved.next
            }

            current.next = toBeRemoved
        } else {
            current = current.next
        }
    }

    return head
}
