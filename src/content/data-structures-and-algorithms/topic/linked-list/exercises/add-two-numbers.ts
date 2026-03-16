/**
 * https://leetcode.com/problems/add-two-numbers/description/
 * 2. Add Two Numbers
 */

import { ListNode } from "../list-node"

function addTwoNumbers(l1: ListNode | null, l2: ListNode | null): ListNode | null {
    let currentOne: ListNode | null = l1
    let currentTwo: ListNode | null = l2
    let carry = 0
    let sumList: ListNode | null = new ListNode(-1)
    let currentSumList = sumList

    while (currentOne || currentTwo) {
        let numberOne = currentOne?.val ?? 0
        let numberTwo = currentTwo?.val ?? 0
        let sum = numberOne + numberTwo + carry
        carry = Math.floor(sum / 10)
        currentSumList.next = new ListNode(sum % 10)

        currentSumList = currentSumList .next
        currentOne = currentOne?.next ?? null
        currentTwo = currentTwo?.next ?? null
    }

    if (carry !== 0) {
        currentSumList.next = new ListNode(carry)
    }

    return sumList.next
};
