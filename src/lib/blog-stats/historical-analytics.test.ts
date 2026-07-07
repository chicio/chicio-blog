import { describe, it, expect } from "vitest";
import { HISTORICAL_ANALYTICS } from "./historical-analytics";

describe("HISTORICAL_ANALYTICS", () => {
    it("carries the archived Universal Analytics totals (2017-05 to 2021-05)", () => {
        expect(HISTORICAL_ANALYTICS.totals).toEqual({ pageViews: 148579, users: 77736, sessions: 97173 });
        expect(HISTORICAL_ANALYTICS.window).toEqual({ start: "May 2017", end: "May 2021" });
    });

    it("carries the continent breakdown in users", () => {
        expect(HISTORICAL_ANALYTICS.byContinent).toEqual([
            { label: "Europe", users: 27036 },
            { label: "Americas", users: 25970 },
            { label: "Asia", users: 21208 },
            { label: "Oceania", users: 1628 },
            { label: "Africa", users: 1337 },
            { label: "Unknown", users: 446 },
        ]);
    });

    it("carries the device breakdown in users", () => {
        expect(HISTORICAL_ANALYTICS.byDevice).toEqual([
            { label: "Desktop", users: 65270 },
            { label: "Mobile", users: 15169 },
            { label: "Tablet", users: 764 },
        ]);
    });
});
