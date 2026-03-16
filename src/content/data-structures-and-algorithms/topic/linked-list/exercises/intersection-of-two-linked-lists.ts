/**
 * https://leetcode.com/problems/intersection-of-two-linked-lists/description/
 * 160. Intersection of Two Linked Lists
 */

import { ListNode } from "../list-node"

function getIntersectionNode(headA: ListNode | null, headB: ListNode | null): ListNode | null {
    if (!headA || !headB) {
        return null
    }

    let currentA: ListNode | null = headA
    let currentB: ListNode | null = headB

    while (currentA !== currentB) {
        currentA = currentA === null ? headA : currentA.next
        currentB = currentB === null ? headB : currentB.next
    }

    return currentA
};
