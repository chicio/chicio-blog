import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ChatIcon } from "./chat-icon";

describe("ChatIcon", () => {
    describe("render", () => {
        it("renders the chat icon with its accessible title", () => {
            render(<ChatIcon />);
            expect(screen.getByTitle("chat with fabrizio")).toBeInTheDocument();
        });
    });
});
