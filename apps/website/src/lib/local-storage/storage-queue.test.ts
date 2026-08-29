import { describe, it, expect, beforeEach } from "vitest";
import { createStorageQueue } from "./storage-queue";

describe("createStorageQueue", () => {
    beforeEach(() => {
        localStorage.clear();
    });

    describe("isEmpty / size on a fresh queue", () => {
        it("is empty when no items have been added", () => {
            const q = createStorageQueue<string>("test_queue");
            expect(q.isEmpty()).toBe(true);
            expect(q.size()).toBe(0);
        });
    });

    describe("enqueue", () => {
        it("adds an item so isEmpty returns false", () => {
            const q = createStorageQueue<string>("test_queue");
            q.enqueue("a");
            expect(q.isEmpty()).toBe(false);
            expect(q.size()).toBe(1);
        });

        it("preserves FIFO order for multiple enqueues", () => {
            const q = createStorageQueue<string>("test_queue");
            q.enqueue("first");
            q.enqueue("second");
            q.enqueue("third");
            expect(q.size()).toBe(3);
            expect(q.peek()).toBe("first");
        });
    });

    describe("dequeue", () => {
        it("returns and removes the first item (FIFO)", () => {
            const q = createStorageQueue<string>("test_queue");
            q.enqueue("first");
            q.enqueue("second");

            expect(q.dequeue()).toBe("first");
            expect(q.size()).toBe(1);
            expect(q.peek()).toBe("second");
        });

        it("returns undefined when queue is empty", () => {
            const q = createStorageQueue<string>("test_queue");
            expect(q.dequeue()).toBeUndefined();
        });

        it("removes the localStorage entry when the last item is dequeued", () => {
            const q = createStorageQueue<string>("test_queue");
            q.enqueue("only");
            q.dequeue();
            expect(q.isEmpty()).toBe(true);
        });
    });

    describe("peek", () => {
        it("returns the first item without removing it", () => {
            const q = createStorageQueue<string>("test_queue");
            q.enqueue("first");
            q.enqueue("second");
            expect(q.peek()).toBe("first");
            expect(q.size()).toBe(2);
        });

        it("returns undefined when queue is empty", () => {
            const q = createStorageQueue<string>("test_queue");
            expect(q.peek()).toBeUndefined();
        });
    });

    describe("clear", () => {
        it("removes all items and makes queue empty", () => {
            const q = createStorageQueue<string>("test_queue");
            q.enqueue("a");
            q.enqueue("b");
            q.clear();
            expect(q.isEmpty()).toBe(true);
            expect(q.size()).toBe(0);
        });
    });

    describe("object items", () => {
        it("serialises and deserialises complex objects correctly", () => {
            const q = createStorageQueue<{ name: string; value: number }>("test_queue");
            q.enqueue({ name: "alice", value: 42 });
            expect(q.dequeue()).toEqual({ name: "alice", value: 42 });
        });
    });

    describe("key isolation", () => {
        it("two queues with different keys do not share data", () => {
            const q1 = createStorageQueue<string>("queue_a");
            const q2 = createStorageQueue<string>("queue_b");
            q1.enqueue("item-in-a");
            expect(q2.isEmpty()).toBe(true);
        });
    });
});
