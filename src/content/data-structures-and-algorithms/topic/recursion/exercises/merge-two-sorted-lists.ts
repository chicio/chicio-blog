/**
 * https://leetcode.com/problems/merge-two-sorted-lists/description/
 * 21. Merge Two Sorted Lists
 */
import {ListNode} from "../list-node";

function mergeTwoListsRecursive(head: ListNode, list1: ListNode | null, list2: ListNode | null) {
    if (list1 === null && list2 === null) {
        return
    }

    if (list1 === null) {
        head.next = list2
        return
    }

    if (list2 === null) {
        head.next = list1
        return
    }

    if (list1.val < list2.val) {
        head.next = list1
        mergeTwoListsRecursive(head.next, list1.next, list2)
    } else {
        head.next = list2
        mergeTwoListsRecursive(head.next, list1, list2.next)
    }
}

function mergeTwoLists(list1: ListNode | null, list2: ListNode | null): ListNode | null {
    let dummy = new ListNode(-1, null)
    let head = dummy

    mergeTwoListsRecursive(head, list1, list2)

    return dummy.next
}
