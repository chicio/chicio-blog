import { describe, it, expect, beforeEach } from "vitest";
import { readLocalStorage, writeLocalStorage, removeLocalStorage } from "./local-storage";

const PREFIX = "fabrizioduroni_";

describe("local-storage", () => {
    beforeEach(() => {
        localStorage.clear();
    });

    describe("writeLocalStorage", () => {
        it("stores the value under the prefixed key", () => {
            writeLocalStorage("myKey", "myValue");
            expect(localStorage.getItem(`${PREFIX}myKey`)).toBe("myValue");
        });

        it("overwrites an existing value", () => {
            writeLocalStorage("myKey", "first");
            writeLocalStorage("myKey", "second");
            expect(localStorage.getItem(`${PREFIX}myKey`)).toBe("second");
        });
    });

    describe("readLocalStorage", () => {
        it("returns the value previously written", () => {
            localStorage.setItem(`${PREFIX}myKey`, "hello");
            expect(readLocalStorage("myKey")).toBe("hello");
        });

        it("returns null when the key does not exist", () => {
            expect(readLocalStorage("nonExistent")).toBeNull();
        });
    });

    describe("removeLocalStorage", () => {
        it("removes an existing prefixed key", () => {
            localStorage.setItem(`${PREFIX}myKey`, "value");
            removeLocalStorage("myKey");
            expect(localStorage.getItem(`${PREFIX}myKey`)).toBeNull();
        });

        it("does not throw when key does not exist", () => {
            expect(() => removeLocalStorage("ghost")).not.toThrow();
        });
    });

    describe("prefix isolation", () => {
        it("does not affect unprefixed keys with the same name", () => {
            localStorage.setItem("myKey", "unrelated");
            writeLocalStorage("myKey", "namespaced");
            expect(localStorage.getItem("myKey")).toBe("unrelated");
        });
    });
});
