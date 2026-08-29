import { describe, it, expect } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
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

        it("sets no object-fit, so a caller's class is not overridden", () => {
            render(<PlainImage src="/logo.png" alt="logo" fill className="object-contain" />);
            expect(screen.getByAltText("logo").getAttribute("style")).not.toContain("object-fit");
        });

        it("stays in flow without fill", () => {
            render(<PlainImage src="/logo.png" alt="logo" />);
            expect(screen.getByAltText("logo").getAttribute("style") ?? "").not.toContain("position: absolute");
        });
    });

    describe("placeholder", () => {
        it("paints a blur placeholder from blurDataURL", () => {
            render(<PlainImage src="/logo.png" alt="logo" placeholder="blur" blurDataURL="data:image/png;base64,x" />);
            expect(screen.getByAltText("logo")).toHaveStyle({
                backgroundImage: "url(data:image/png;base64,x)",
            });
        });

        it("paints a data-uri placeholder directly, which is what ImageGlow passes", () => {
            render(<PlainImage src="/logo.png" alt="logo" placeholder="data:image/svg+xml;base64,shimmer" />);
            expect(screen.getByAltText("logo")).toHaveStyle({
                backgroundImage: "url(data:image/svg+xml;base64,shimmer)",
            });
        });

        it("drops the placeholder once the image has loaded", async () => {
            render(<PlainImage src="/logo.png" alt="logo" placeholder="data:image/svg+xml;base64,shimmer" />);
            const image = screen.getByAltText("logo");
            fireEvent.load(image);
            await waitFor(() => expect(image.getAttribute("style") ?? "").not.toContain("background-image"));
        });

        it("paints nothing for an empty placeholder", () => {
            render(<PlainImage src="/logo.png" alt="logo" placeholder="empty" blurDataURL="data:image/png;base64,x" />);
            expect(screen.getByAltText("logo")).not.toHaveStyle({
                backgroundImage: "url(data:image/png;base64,x)",
            });
        });
    });

    describe("loading", () => {
        it("keeps priority and quality off the DOM, which would warn", () => {
            render(<PlainImage src="/logo.png" alt="logo" priority quality={80} />);
            const image = screen.getByAltText("logo");
            expect(image).not.toHaveAttribute("priority");
            expect(image).not.toHaveAttribute("quality");
        });

        it("lazy loads by default, as next/image does", () => {
            render(<PlainImage src="/logo.png" alt="logo" />);
            expect(screen.getByAltText("logo")).toHaveAttribute("loading", "lazy");
        });

        it("loads a priority image eagerly and at high fetch priority", () => {
            render(<PlainImage src="/logo.png" alt="logo" priority />);
            const image = screen.getByAltText("logo");
            expect(image).toHaveAttribute("loading", "eager");
            expect(image).toHaveAttribute("fetchpriority", "high");
        });

        it("honours an explicit loading value", () => {
            render(<PlainImage src="/logo.png" alt="logo" loading="eager" />);
            expect(screen.getByAltText("logo")).toHaveAttribute("loading", "eager");
        });
    });
});
