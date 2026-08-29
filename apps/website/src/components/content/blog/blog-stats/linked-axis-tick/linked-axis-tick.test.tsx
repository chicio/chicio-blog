import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { LinkedAxisTick } from "./index";

const renderInSvg = (ui: React.ReactNode) => render(<svg>{ui}</svg>);

describe("LinkedAxisTick", () => {
    describe("render", () => {
        it("wraps the label in a link when the value has an href", () => {
            const { container } = renderInSvg(
                <LinkedAxisTick
                    x={10}
                    y={20}
                    payload={{ value: "swift" }}
                    hrefByValue={new Map([["swift", "/blog/tag/swift"]])}
                />,
            );

            const link = container.querySelector("a");
            expect(link).toHaveAttribute("href", "/blog/tag/swift");
            expect(link).toHaveTextContent("swift");
        });

        it("renders a plain label when the value has no href", () => {
            const { container } = renderInSvg(
                <LinkedAxisTick
                    x={10}
                    y={20}
                    payload={{ value: "unknown" }}
                    hrefByValue={new Map()}
                />,
            );

            expect(container.querySelector("a")).toBeNull();
            expect(container.querySelector("text")).toHaveTextContent("unknown");
        });
    });
});
