"use client";

import { useMemo } from "react";
import { StateStore } from "@/types/component-store";

interface AmortizedDataPoint {
    operation: number;
    cost: number;
    amortized: number;
}

interface AmortizedAnalysisState {
    data: AmortizedDataPoint[];
}

export const useAmortizedAnalysisStore = (): StateStore<AmortizedAnalysisState> => {
    const data = useMemo(() => {
        const points: AmortizedDataPoint[] = [];
        let capacity = 1;
        let totalCost = 0;

        for (let i = 1; i <= 50; i++) {
            let cost = 1;
            if (i > capacity) {
                capacity *= 2;
                cost = i;
            }
            totalCost += cost;
            const amortized = totalCost / i;
            points.push({ operation: i, cost, amortized });
        }

        return points;
    }, []);

    return {
        state: { data },
    };
};
