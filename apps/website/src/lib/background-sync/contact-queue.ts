import { createStorageQueue } from "@/lib/local-storage/storage-queue";

export interface QueuedContactSubmission {
    name: string;
    email: string;
    message: string;
    honeypot: string;
}

export const contactQueue = createStorageQueue<QueuedContactSubmission>("contact_queue");
