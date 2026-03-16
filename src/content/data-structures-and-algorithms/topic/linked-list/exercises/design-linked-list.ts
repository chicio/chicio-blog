/**
 * https://leetcode.com/problems/design-linked-list/description/
 * 707. Design Linked List
 */

import { ListNode } from "../list-node";

class MyLinkedList {
    private head: ListNode | null = null;

    get(index: number): number {
        let current = this.head;

        for (let i = 0; i < index; i++) {
            if (!current) {
                return -1;
            }

            current = current.next;
        }

        return current ? current.val : -1;
    }

    addAtHead(val: number): void {
        this.head = new ListNode(val, this.head);
    }

    addAtTail(val: number): void {
        if (!this.head) {
            this.head = new ListNode(val);
            return;
        }

        let current = this.head;

        while (current.next !== null) {
            current = current.next;
        }

        current.next = new ListNode(val);
    }

    addAtIndex(index: number, val: number): void {
        if (index === 0) {
            this.addAtHead(val);
            return;
        }

        let current = this.head;

        for (let i = 0; i < index - 1; i++) {
            if (!current) return;
            current = current.next;
        }

        if (!current) return;

        let newNode = new ListNode(val, current.next);
        current.next = newNode;
    }

    deleteAtIndex(index: number): void {
        if (!this.head) {
            return;
        }

        if (index === 0) {
            this.head = this.head.next;
            return;
        }

        let current = this.head;

        for (let i = 0; i < index - 1; i++) {
            if (!current || !current.next) return;
            current = current.next;
        }

        if (current && current.next) {
            current.next = current.next.next;
        }
    }
}
