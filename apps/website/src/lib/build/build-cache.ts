const enabled = process.env.NODE_ENV === "production";
const store = new Map<string, unknown>();

export const cached = <T>(key: string, factory: () => T): T => {
    if (!enabled) {
        return factory();
    }
    if (store.has(key)) {
        return store.get(key) as T;
    }
    const value = factory();
    if (value != null) {
        store.set(key, value);
    }
    return value;
};
