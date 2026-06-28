import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CopyIcon, CopiedIcon, CopyErrorIcon } from "./copy-icon";

describe("CopyIcon", () => {
    describe("render", () => {
        it("renders the copy icon with its accessible title", () => {
            render(<CopyIcon />);
            expect(screen.getByTitle("Copy code")).toBeInTheDocument();
        });
    });
});

describe("CopiedIcon", () => {
    describe("render", () => {
        it("renders the copied icon with its accessible title", () => {
            render(<CopiedIcon />);
            expect(screen.getByTitle("Copied!")).toBeInTheDocument();
        });
    });
});

describe("CopyErrorIcon", () => {
    describe("render", () => {
        it("renders the error icon with its accessible title", () => {
            render(<CopyErrorIcon />);
            expect(screen.getByTitle("Copy failed")).toBeInTheDocument();
        });
    });
});
