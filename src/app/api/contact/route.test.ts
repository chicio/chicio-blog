import { describe, it, expect, vi, beforeEach } from "vitest";

const {
    mockCheckRateLimitFor,
    mockIncrementRateLimit,
    mockResendEmailsSend,
} = vi.hoisted(() => ({
    mockCheckRateLimitFor: vi.fn(),
    mockIncrementRateLimit: vi.fn(),
    mockResendEmailsSend: vi.fn(),
}));

vi.mock("@/lib/rate-limit/rate-limit", () => ({
    checkRateLimitFor: mockCheckRateLimitFor,
    incrementRateLimit: mockIncrementRateLimit,
}));

vi.mock("resend", () => {
    class Resend {
        emails: { send: ReturnType<typeof vi.fn> };
        constructor() {
            this.emails = { send: mockResendEmailsSend };
        }
    }
    return { Resend };
});

vi.mock("@/components/content/contact/contact-email-notification", () => ({
    ContactNotificationEmail: vi.fn().mockReturnValue(null),
}));

vi.mock("@/components/content/contact/contact-email-confirmation", () => ({
    ContactConfirmationEmail: vi.fn().mockReturnValue(null),
}));

import { POST } from "./route";
import { NextRequest } from "next/server";

function makeRequest(body: Record<string, unknown>, ip?: string): NextRequest {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (ip) {
        headers["x-forwarded-for"] = ip;
    }
    return new NextRequest("https://www.fabrizioduroni.it/api/contact", {
        method: "POST",
        headers,
        body: JSON.stringify(body),
    });
}

describe("/api/contact POST", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockCheckRateLimitFor.mockResolvedValue({ success: true });
        mockIncrementRateLimit.mockResolvedValue(undefined);
        mockResendEmailsSend.mockResolvedValue({ error: null });
    });

    describe("honeypot protection", () => {
        it("returns 200 silently when honeypot field is filled (bot detection)", async () => {
            const req = makeRequest({
                name: "Bot",
                email: "bot@example.com",
                message: "spam message",
                honeypot: "filled",
            });
            const response = await POST(req);
            expect(response.status).toBe(200);
            const body = await response.json() as { success: boolean };
            expect(body.success).toBe(true);
            expect(mockResendEmailsSend).not.toHaveBeenCalled();
        });
    });

    describe("rate limiting", () => {
        it("returns 429 when rate limit check fails", async () => {
            mockCheckRateLimitFor.mockResolvedValue({
                success: false,
                error: "Please wait 45 seconds before submitting again",
            });
            const req = makeRequest({
                name: "Fabrizio",
                email: "fabrizio@example.com",
                message: "Hello there, this is a test message",
                honeypot: "",
            });
            const response = await POST(req);
            expect(response.status).toBe(429);
            const body = await response.json() as { error: string };
            expect(body.error).toMatch(/wait/i);
        });

        it("passes the client IP to the rate limit check", async () => {
            const req = makeRequest({
                name: "Fabrizio",
                email: "fabrizio@example.com",
                message: "Hello from a specific IP",
                honeypot: "",
            }, "203.0.113.42");
            await POST(req);
            expect(mockCheckRateLimitFor).toHaveBeenCalledWith("203.0.113.42");
        });
    });

    describe("field validation", () => {
        it("returns 400 when name is missing", async () => {
            const req = makeRequest({
                name: "",
                email: "fabrizio@example.com",
                message: "A valid message here",
                honeypot: "",
            });
            const response = await POST(req);
            expect(response.status).toBe(400);
            const body = await response.json() as { error: string };
            expect(body.error).toMatch(/required/i);
        });

        it("returns 400 when email is invalid", async () => {
            const req = makeRequest({
                name: "Fabrizio",
                email: "not-an-email",
                message: "A valid message here",
                honeypot: "",
            });
            const response = await POST(req);
            expect(response.status).toBe(400);
            const body = await response.json() as { error: string };
            expect(body.error).toMatch(/email/i);
        });

        it("returns 400 when message is too short (less than 10 chars)", async () => {
            const req = makeRequest({
                name: "Fabrizio",
                email: "fabrizio@example.com",
                message: "Short",
                honeypot: "",
            });
            const response = await POST(req);
            expect(response.status).toBe(400);
            const body = await response.json() as { error: string };
            expect(body.error).toMatch(/10 characters/i);
        });
    });

    describe("successful submission", () => {
        it("returns 200 with success: true when all checks pass", async () => {
            const req = makeRequest({
                name: "Fabrizio",
                email: "fabrizio@example.com",
                message: "Hello, this is a proper test message",
                honeypot: "",
            });
            const response = await POST(req);
            expect(response.status).toBe(200);
            const body = await response.json() as { success: boolean };
            expect(body.success).toBe(true);
        });

        it("sends both notification and confirmation emails", async () => {
            const req = makeRequest({
                name: "Fabrizio",
                email: "fabrizio@example.com",
                message: "Hello, this is a proper test message",
                honeypot: "",
            });
            await POST(req);
            expect(mockResendEmailsSend).toHaveBeenCalledTimes(2);
        });

        it("increments the rate limit counter after a successful send", async () => {
            const req = makeRequest({
                name: "Fabrizio",
                email: "fabrizio@example.com",
                message: "Hello, this is a proper test message",
                honeypot: "",
            }, "203.0.113.1");
            await POST(req);
            expect(mockIncrementRateLimit).toHaveBeenCalledWith("203.0.113.1");
        });
    });

    describe("email send failure", () => {
        it("returns 500 when the notification email fails to send", async () => {
            mockResendEmailsSend.mockResolvedValueOnce({ error: { message: "Email service unavailable" } });
            const req = makeRequest({
                name: "Fabrizio",
                email: "fabrizio@example.com",
                message: "Hello, this is a proper test message",
                honeypot: "",
            });
            const response = await POST(req);
            expect(response.status).toBe(500);
            const body = await response.json() as { error: string };
            expect(body.error).toMatch(/notification/i);
        });

        it("returns 200 even when confirmation email fails (notification succeeded)", async () => {
            mockResendEmailsSend
                .mockResolvedValueOnce({ error: null })
                .mockResolvedValueOnce({ error: { message: "Confirmation failed" } });
            const req = makeRequest({
                name: "Fabrizio",
                email: "fabrizio@example.com",
                message: "Hello, this is a proper test message",
                honeypot: "",
            });
            const response = await POST(req);
            expect(response.status).toBe(200);
        });
    });

    describe("unexpected errors", () => {
        it("returns 500 when an unhandled exception occurs", async () => {
            mockCheckRateLimitFor.mockRejectedValue(new Error("Unexpected crash"));
            const req = makeRequest({
                name: "Fabrizio",
                email: "fabrizio@example.com",
                message: "Hello, this is a proper test message",
                honeypot: "",
            });
            const response = await POST(req);
            expect(response.status).toBe(500);
            const body = await response.json() as { error: string };
            expect(body.error).toMatch(/internal server error/i);
        });
    });
});
