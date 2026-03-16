/**
 * https://leetcode.com/problems/sort-list/description/
 * 148. Sort List
 */

import {ListNode} from "../list-node";

function findMedianOf(head: ListNode | null) {
    let dummy = new ListNode(-Infinity, head)
    let slow = dummy
    let fast = dummy.next

    while (fast?.next) {
        slow = slow.next!
        fast = fast.next?.next
    }

    return slow
}

function merge(firstHalf: ListNode | null, secondHalf: ListNode | null): ListNode | null {
    let dummy = new ListNode(-1)
    let current = dummy

    while (firstHalf && secondHalf) {
        if (firstHalf.val < secondHalf.val) {
            current.next = firstHalf
            firstHalf = firstHalf.next
        } else {
            current.next = secondHalf
            secondHalf = secondHalf.next
        }

        current = current.next
    }

    current.next = firstHalf ?? secondHalf

    return dummy.next
}

function sortList(head: ListNode | null): ListNode | null {
    if (!head || !head.next) {
        return head
    }

    let median = findMedianOf(head)
    let secondHalf = median.next
    median.next = null

    return merge(
        sortList(head),
        sortList(secondHalf)
    )
}
