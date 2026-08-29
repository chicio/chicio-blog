import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@/test-utils";
import { CodeBlock } from "./index";

vi.mock("./copy-code-button", () => ({
    CopyCodeButton: () => null,
}));

describe("CodeBlock", () => {
    describe("render", () => {
        it("renders a pre element wrapping the supplied children", () => {
            render(
                <CodeBlock>
                    <code>const x = 1;</code>
                </CodeBlock>,
            );
            const pre = document.querySelector("pre");
            expect(pre).toBeInTheDocument();
            expect(pre).toHaveTextContent("const x = 1;");
        });

        it("forwards className to the pre element", () => {
            render(
                <CodeBlock className="language-ts">
                    <code>let y = 2;</code>
                </CodeBlock>,
            );
            const pre = document.querySelector("pre");
            expect(pre).toHaveClass("language-ts");
        });

        it("renders the code-block container element", () => {
            render(<CodeBlock>hello</CodeBlock>);
            expect(document.getElementById("code-block")).toBeInTheDocument();
        });
    });

    describe("clipboard unavailable", () => {
        it("does not render any copy button when clipboard is absent", () => {
            render(<CodeBlock>no copy</CodeBlock>);
            expect(screen.queryByRole("button")).toBeNull();
        });
    });
});
