import { describe, it, expect } from "vitest";
import { readAnalyticsConfig } from "./analytics-config";

describe("readAnalyticsConfig", () => {
    it("returns null when all env vars are missing", () => {
        expect(readAnalyticsConfig({})).toBeNull();
    });

    it("returns null when the property id is missing", () => {
        expect(
            readAnalyticsConfig({
                GA_SA_CLIENT_EMAIL: "sa@example.com",
                GA_SA_PRIVATE_KEY: "key",
            }),
        ).toBeNull();
    });

    it("returns null when the client email is missing", () => {
        expect(
            readAnalyticsConfig({
                GA_PROPERTY_ID: "123456",
                GA_SA_PRIVATE_KEY: "key",
            }),
        ).toBeNull();
    });

    it("returns null when the private key is missing", () => {
        expect(
            readAnalyticsConfig({
                GA_PROPERTY_ID: "123456",
                GA_SA_CLIENT_EMAIL: "sa@example.com",
            }),
        ).toBeNull();
    });

    it("returns a config when all three env vars are present", () => {
        expect(
            readAnalyticsConfig({
                GA_PROPERTY_ID: "123456",
                GA_SA_CLIENT_EMAIL: "sa@example.com",
                GA_SA_PRIVATE_KEY: "-----BEGIN PRIVATE KEY-----\\nabc\\n-----END PRIVATE KEY-----",
            }),
        ).toEqual({
            propertyId: "123456",
            clientEmail: "sa@example.com",
            privateKey: "-----BEGIN PRIVATE KEY-----\nabc\n-----END PRIVATE KEY-----",
        });
    });
});
