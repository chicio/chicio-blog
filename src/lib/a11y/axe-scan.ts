import { writeFileSync } from "fs";
import { chromium } from "@playwright/test";
import type { Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import type { ImpactValue, Result } from "axe-core";

const ROUTES = [
    "/",
    "/blog",
    "/blog/authors",
    "/blog/tags",
    "/blog/archive",
    "/about-me",
    "/chat",
    "/contact",
    "/blog/post/2026/06/01/app-js-conf-2026",
    "/blog/author/antonino-gitto",
];

const IMPACT_ORDER: Record<string, number> = {
    critical: 0,
    serious: 1,
    moderate: 2,
    minor: 3,
};

export interface AxeScanNode {
    target: string[];
    failureSummary?: string;
}

export interface AxeScanViolation {
    id: string;
    impact: ImpactValue;
    help: string;
    helpUrl: string;
    route: string;
    nodes: AxeScanNode[];
}

export interface AxeScanRouteResult {
    route: string;
    violations: AxeScanViolation[];
}

function toScanViolation(route: string, violation: Result): AxeScanViolation {
    return {
        id: violation.id,
        impact: violation.impact ?? null,
        help: violation.help,
        helpUrl: violation.helpUrl,
        route,
        nodes: violation.nodes.map((node) => ({
            target: node.target as string[],
            failureSummary: node.failureSummary,
        })),
    };
}

export async function scanRoute(baseUrl: string, route: string, page: Page): Promise<AxeScanRouteResult> {
    await page.goto(`${baseUrl}${route}`);
    const results = await new AxeBuilder({ page }).analyze();

    return {
        route,
        violations: results.violations.map((violation) => toScanViolation(route, violation)),
    };
}

function impactRank(impact: ImpactValue): number {
    return impact !== null && impact in IMPACT_ORDER ? IMPACT_ORDER[impact] : IMPACT_ORDER.minor + 1;
}

interface RuleRouteCount {
    rule: string;
    route: string;
    impact: ImpactValue;
    count: number;
}

function countViolationsByRuleAndRoute(violations: AxeScanViolation[]): RuleRouteCount[] {
    const countsByRuleAndRoute = new Map<string, RuleRouteCount>();

    for (const violation of violations) {
        const key = `${violation.id}::${violation.route}`;
        const existing = countsByRuleAndRoute.get(key);
        if (existing) {
            existing.count += violation.nodes.length;
        } else {
            countsByRuleAndRoute.set(key, {
                rule: violation.id,
                route: violation.route,
                impact: violation.impact,
                count: violation.nodes.length,
            });
        }
    }

    return [...countsByRuleAndRoute.values()].sort((a, b) => impactRank(a.impact) - impactRank(b.impact));
}

export function printSummary(results: AxeScanRouteResult[]): void {
    const allViolations = results.flatMap((result) => result.violations);
    const sortedEntries = countViolationsByRuleAndRoute(allViolations);

    console.log(`\nAccessibility scan summary: ${allViolations.length} violation(s) across ${results.length} route(s)`);

    if (sortedEntries.length === 0) {
        console.log("No violations found.");
        return;
    }

    for (const entry of sortedEntries) {
        console.log(`  [${entry.impact ?? "unknown"}] ${entry.rule} on ${entry.route} — ${entry.count} node(s)`);
    }
}

export async function runScan(): Promise<AxeScanRouteResult[]> {
    const baseUrl = process.env.A11Y_BASE_URL ?? "http://localhost:3000";
    const browser = await chromium.launch({ headless: true });

    try {
        const page = await browser.newPage();
        const results: AxeScanRouteResult[] = [];

        for (const route of ROUTES) {
            results.push(await scanRoute(baseUrl, route, page));
        }

        return results;
    } finally {
        await browser.close();
    }
}

runScan()
    .then((results) => {
        writeFileSync("a11y-report.json", JSON.stringify(results, null, 2));
        printSummary(results);
    })
    .catch((error) => {
        console.error("Accessibility scan failed to run:", error);
        process.exitCode = 1;
    });
