import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "./button";

describe("Button", () => {
    it("renders children inside the button", () => {
        render(<Button>Click me</Button>);
        expect(screen.getByRole("button", { name: "Click me" })).toBeInTheDocument();
    });

    it("applies the glow-container class by default", () => {
        render(<Button>Test</Button>);
        const btn = screen.getByRole("button");
        expect(btn.className).toContain("glow-container");
    });

    it("appends additional className when provided", () => {
        render(<Button className="extra-class">Test</Button>);
        const btn = screen.getByRole("button");
        expect(btn.className).toContain("extra-class");
        expect(btn.className).toContain("glow-container");
    });

    it("fires onClick when clicked", async () => {
        const onClick = vi.fn();
        render(<Button onClick={onClick}>Click</Button>);
        await userEvent.click(screen.getByRole("button"));
        expect(onClick).toHaveBeenCalledOnce();
    });

    it("passes arbitrary HTML button attributes through", () => {
        render(<Button type="submit" disabled>Submit</Button>);
        const btn = screen.getByRole("button");
        expect(btn).toHaveAttribute("type", "submit");
        expect(btn).toBeDisabled();
    });
});
