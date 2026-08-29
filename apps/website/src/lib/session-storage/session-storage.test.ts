import { describe, it, expect, beforeEach } from "vitest";
import { readSessionStorage, writeSessionStorage } from "./session-storage";

const PREFIX = "fabrizioduroni_";

describe("session-storage", () => {
    beforeEach(() => {
        sessionStorage.clear();
    });

    describe("writeSessionStorage", () => {
        it("stores the value under the prefixed key", () => {
            writeSessionStorage("testKey", "testValue");
            expect(sessionStorage.getItem(`${PREFIX}testKey`)).toBe("testValue");
        });

        it("overwrites an existing value", () => {
            writeSessionStorage("testKey", "old");
            writeSessionStorage("testKey", "new");
            expect(sessionStorage.getItem(`${PREFIX}testKey`)).toBe("new");
        });
    });

    describe("readSessionStorage", () => {
        it("returns the value previously written", () => {
            sessionStorage.setItem(`${PREFIX}testKey`, "hello");
            expect(readSessionStorage("testKey")).toBe("hello");
        });

        it("returns null when the key does not exist", () => {
            expect(readSessionStorage("nonExistent")).toBeNull();
        });
    });

    describe("prefix isolation", () => {
        it("does not interfere with unprefixed keys having the same name", () => {
            sessionStorage.setItem("testKey", "unrelated");
            writeSessionStorage("testKey", "namespaced");
            expect(sessionStorage.getItem("testKey")).toBe("unrelated");
        });
    });
});
