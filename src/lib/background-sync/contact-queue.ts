const STORAGE_KEY = "fabrizioduroni_contact_queue";

export interface QueuedContactSubmission {
    id: string;
    name: string;
    email: string;
    message: string;
    honeypot: string;
    queuedAt: number;
}

export const contactQueue = {
    enqueue(data: Omit<QueuedContactSubmission, "id" | "queuedAt">): QueuedContactSubmission {
        const entry: QueuedContactSubmission = {
            ...data,
            id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
            queuedAt: Date.now(),
        };

        const existing = contactQueue.getAll();
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...existing, entry]));

        return entry;
    },

    getAll(): QueuedContactSubmission[] {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            return raw ? (JSON.parse(raw) as QueuedContactSubmission[]) : [];
        } catch {
            return [];
        }
    },

    remove(id: string): void {
        const updated = contactQueue.getAll().filter((entry) => entry.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    },

    clear(): void {
        localStorage.removeItem(STORAGE_KEY);
    },

    isEmpty(): boolean {
        return contactQueue.getAll().length === 0;
    },
};
