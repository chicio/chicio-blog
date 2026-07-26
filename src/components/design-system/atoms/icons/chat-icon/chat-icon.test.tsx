import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { ChatIcon } from "./chat-icon";

describe("ChatIcon", () => {
    describe("render", () => {
        it("renders the chat icon hidden from the accessibility tree", () => {
            const { container } = render(<ChatIcon />);
            const icon = container.querySelector("svg");
            expect(icon).toBeInTheDocument();
            expect(icon).toHaveAttribute("aria-hidden", "true");
        });
    });
});
