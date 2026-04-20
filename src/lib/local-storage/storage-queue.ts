import { readLocalStorage, writeLocalStorage, removeLocalStorage } from "@/lib/local-storage/local-storage";

export interface StorageQueue<T> {
    enqueue(item: T): void;
    dequeue(): T | undefined;
    peek(): T | undefined;
    isEmpty(): boolean;
    size(): number;
    clear(): void;
}

export const createStorageQueue = <T>(key: string): StorageQueue<T> => {
    const readAll = (): T[] => {
        try {
            const raw = readLocalStorage(key);
            return raw ? (JSON.parse(raw) as T[]) : [];
        } catch {
            return [];
        }
    };

    const writeAll = (items: T[]) => {
        if (items.length === 0) {
            removeLocalStorage(key);
        } else {
            writeLocalStorage(key, JSON.stringify(items));
        }
    };

    return {
        enqueue(item: T): void {
            const items = readAll();
            items.push(item);
            writeAll(items);
        },

        dequeue(): T | undefined {
            const items = readAll();
            if (items.length === 0) {
                return undefined;
            }
            const [first, ...rest] = items;
            writeAll(rest);
            return first;
        },

        peek(): T | undefined {
            const items = readAll();
            return items[0];
        },

        isEmpty(): boolean {
            return readAll().length === 0;
        },

        size(): number {
            return readAll().length;
        },

        clear(): void {
            removeLocalStorage(key);
        },
    };
};
