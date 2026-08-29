import { describe, it, expect, beforeEach } from "vitest";
import { contactQueue } from "./contact-queue";
import type { QueuedContactSubmission } from "./contact-queue";

const SAMPLE: QueuedContactSubmission = {
    name: "Fabrizio",
    email: "fabrizio@example.com",
    message: "Hello world",
    honeypot: "",
};

describe("contactQueue", () => {
    beforeEach(() => {
        localStorage.clear();
    });

    describe("initial state", () => {
        it("starts empty", () => {
            expect(contactQueue.isEmpty()).toBe(true);
            expect(contactQueue.size()).toBe(0);
        });
    });

    describe("enqueue / dequeue round-trip", () => {
        it("stores and retrieves a submission with all fields intact", () => {
            contactQueue.enqueue(SAMPLE);
            const retrieved = contactQueue.dequeue();
            expect(retrieved).toEqual(SAMPLE);
        });

        it("maintains FIFO ordering for multiple submissions", () => {
            const second: QueuedContactSubmission = { ...SAMPLE, name: "Second" };
            contactQueue.enqueue(SAMPLE);
            contactQueue.enqueue(second);
            expect(contactQueue.dequeue()?.name).toBe("Fabrizio");
            expect(contactQueue.dequeue()?.name).toBe("Second");
        });
    });

    describe("peek", () => {
        it("returns the first item without removing it", () => {
            contactQueue.enqueue(SAMPLE);
            expect(contactQueue.peek()).toEqual(SAMPLE);
            expect(contactQueue.size()).toBe(1);
        });
    });

    describe("clear", () => {
        it("empties the queue", () => {
            contactQueue.enqueue(SAMPLE);
            contactQueue.clear();
            expect(contactQueue.isEmpty()).toBe(true);
        });
    });
});
