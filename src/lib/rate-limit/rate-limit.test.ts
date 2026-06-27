import { describe, it, expect, vi, beforeEach } from "vitest";

const { mockGetValueFor, mockIncrementValueByOneFor, mockSetExpirationFor, mockSetValueFor } = vi.hoisted(() => ({
    mockGetValueFor: vi.fn(),
    mockIncrementValueByOneFor: vi.fn(),
    mockSetExpirationFor: vi.fn(),
    mockSetValueFor: vi.fn(),
}));

vi.mock("../upstash/upstash-redis", () => ({
    getValueFor: mockGetValueFor,
    incrementValueByOneFor: mockIncrementValueByOneFor,
    setExpirationFor: mockSetExpirationFor,
    setValueFor: mockSetValueFor,
}));

import { checkRateLimitFor, incrementRateLimit } from "./rate-limit";

describe("rate-limit", () => {
    describe("checkRateLimitFor", () => {
        beforeEach(() => {
            vi.clearAllMocks();
        });

        it("allows request when no prior submissions exist", async () => {
            mockGetValueFor.mockResolvedValue(null);
            const result = await checkRateLimitFor("127.0.0.1");
            expect(result.success).toBe(true);
        });

        it("blocks request when throttle window has not expired (10s ago)", async () => {
            const recentTimestamp = Date.now() - 10_000;
            mockGetValueFor.mockResolvedValue(recentTimestamp);

            const result = await checkRateLimitFor("127.0.0.1");
            expect(result.success).toBe(false);
            expect(result.error).toMatch(/wait \d+ seconds/i);
        });

        it("allows request when throttle window has fully expired (2 min ago)", async () => {
            const oldTimestamp = Date.now() - 120_000;
            // First call: throttle key → old timestamp (expired throttle)
            // Second call: rate limit key → count 1 (below limit)
            mockGetValueFor
                .mockResolvedValueOnce(oldTimestamp)
                .mockResolvedValueOnce(1);

            const result = await checkRateLimitFor("127.0.0.1");
            expect(result.success).toBe(true);
        });

        it("blocks request when daily limit of 5 is reached", async () => {
            // First call: throttle key → null (no throttle)
            // Second call: rate limit key → 5 (at limit)
            mockGetValueFor
                .mockResolvedValueOnce(null)
                .mockResolvedValueOnce(5);

            const result = await checkRateLimitFor("127.0.0.1");
            expect(result.success).toBe(false);
            expect(result.error).toMatch(/daily/i);
        });

        it("fails open when redis throws", async () => {
            mockGetValueFor.mockRejectedValue(new Error("Redis unavailable"));
            const result = await checkRateLimitFor("127.0.0.1");
            expect(result.success).toBe(true);
        });
    });

    describe("incrementRateLimit", () => {
        beforeEach(() => {
            vi.clearAllMocks();
            mockIncrementValueByOneFor.mockResolvedValue(1);
            mockSetExpirationFor.mockResolvedValue(undefined);
            mockSetValueFor.mockResolvedValue(undefined);
        });

        it("increments the rate limit counter for the identifier", async () => {
            await incrementRateLimit("127.0.0.1");
            await new Promise((r) => setTimeout(r, 0));
            expect(mockIncrementValueByOneFor).toHaveBeenCalledWith("rate_limit:127.0.0.1");
        });

        it("sets expiration on the first increment (count === 1)", async () => {
            mockIncrementValueByOneFor.mockResolvedValue(1);
            await incrementRateLimit("127.0.0.1");
            await new Promise((r) => setTimeout(r, 0));
            expect(mockSetExpirationFor).toHaveBeenCalledWith("rate_limit:127.0.0.1", 86400);
        });

        it("records the throttle timestamp", async () => {
            await incrementRateLimit("127.0.0.1");
            await new Promise((r) => setTimeout(r, 0));
            expect(mockSetValueFor).toHaveBeenCalledWith(
                "throttle:127.0.0.1",
                expect.any(Number),
                60,
            );
        });
    });
});
