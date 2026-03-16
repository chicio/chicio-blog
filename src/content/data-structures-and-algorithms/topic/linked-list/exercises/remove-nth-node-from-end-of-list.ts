/**
 * https://leetcode.com/problems/remove-nth-node-from-end-of-list/description/
 * 19. Remove Nth Node From End of List
 */

import { ListNode } from "../list-node";

function removeNthFromEnd(head: ListNode | null, n: number): ListNode | null {
    let dummy = new ListNode(0, head);
    let slow: ListNode | null = dummy;
    let fast: ListNode | null = dummy;

    for (let i = 0; i <= n; i++) {
        fast = fast?.next ?? null;
    }

    while (fast !== null) {
        slow = slow!.next;
        fast = fast.next;
    }

    if (slow!.next !== null) {
        slow!.next = slow!.next.next;
    }

    return dummy.next;
}


