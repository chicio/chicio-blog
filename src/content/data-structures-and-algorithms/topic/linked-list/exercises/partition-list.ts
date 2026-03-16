/**
 * https://leetcode.com/problems/partition-list/description/
 * Partition List
 */

import { ListNode } from "../list-node"

function partition(head: ListNode | null, x: number): ListNode | null {
    let minor = new ListNode(-1, undefined)
    let major = new ListNode(-1, undefined)
    let currentMinor = minor
    let currentMajor = major
    let current = head

    while(current) {
        if (current.val < x) {
            currentMinor.next = current
            currentMinor = currentMinor.next
        } else {
            currentMajor.next = current
            currentMajor = currentMajor.next
        }

        current = current.next
    }

    head = minor.next ? minor.next : head
    currentMinor.next = major.next
    currentMajor.next = null

    return head
};
