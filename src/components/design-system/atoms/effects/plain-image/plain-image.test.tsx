import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PlainImage } from "./plain-image";

describe("PlainImage", () => {
    describe("src", () => {
        it("renders a string source directly", () => {
            render(<PlainImage src="/logo.png" alt="logo" />);
            expect(screen.getByAltText("logo")).toHaveAttribute("src", "/logo.png");
        });

        it("unwraps a static import source", () => {
            render(<PlainImage src={{ src: "/logo.png", width: 10, height: 10 }} alt="logo" />);
            expect(screen.getByAltText("logo")).toHaveAttribute("src", "/logo.png");
        });
    });

    describe("fill", () => {
        it("absolutely fills its positioned ancestor, as next/image does", () => {
            render(<PlainImage src="/logo.png" alt="logo" fill />);
            expect(screen.getByAltText("logo")).toHaveStyle({ position: "absolute", inset: "0px" });
        });

        it("stays in flow without fill", () => {
            render(<PlainImage src="/logo.png" alt="logo" />);
            expect(screen.getByAltText("logo")).not.toHaveStyle({ position: "absolute" });
        });
    });

    describe("placeholder", () => {
        it("paints a blur placeholder as a background", () => {
            render(<PlainImage src="/logo.png" alt="logo" placeholder="blur" blurDataURL="data:image/png;base64,x" />);
            expect(screen.getByAltText("logo")).toHaveStyle({
                backgroundImage: "url(data:image/png;base64,x)",
            });
        });

        it("paints nothing for an empty placeholder", () => {
            render(<PlainImage src="/logo.png" alt="logo" placeholder="empty" blurDataURL="data:image/png;base64,x" />);
            expect(screen.getByAltText("logo")).not.toHaveStyle({
                backgroundImage: "url(data:image/png;base64,x)",
            });
        });
    });

    describe("optimisation props", () => {
        it("keeps priority and quality off the DOM, which would warn", () => {
            render(<PlainImage src="/logo.png" alt="logo" priority quality={80} />);
            const image = screen.getByAltText("logo");
            expect(image).not.toHaveAttribute("priority");
            expect(image).not.toHaveAttribute("quality");
        });
    });
});
