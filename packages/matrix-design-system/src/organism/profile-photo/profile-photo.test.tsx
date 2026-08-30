import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProfilePhoto } from "./profile-photo";


describe("ProfilePhoto", () => {
    describe("render", () => {
        it("renders an image with the author as alt text", () => {
            render(<ProfilePhoto author="Fabrizio Duroni" />);
            const img = screen.getByAltText("Fabrizio Duroni");
            expect(img).toBeInTheDocument();
        });

        it("renders the author photo path", () => {
            render(<ProfilePhoto author="Fabrizio" />);
            const img = screen.getByAltText("Fabrizio");
            expect(img).toHaveAttribute("src", expect.stringContaining("fabrizio-duroni"));
        });

        it("renders a provided src", () => {
            render(
                <ProfilePhoto
                    author="Alessandro Romano"
                    src="/media/authors/alessandro-romano-large.jpg"
                />,
            );
            expect(screen.getByAltText("Alessandro Romano")).toHaveAttribute(
                "src",
                "/media/authors/alessandro-romano-large.jpg",
            );
        });
    });
});
