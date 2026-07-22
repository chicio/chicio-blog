import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { act, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { render, nextImageMock, nextLinkMock, motionDivMock, makeNextNavigationMock } from "@/test-utils";
import { Terminal } from "./terminal";

const { mockRouterPush } = vi.hoisted(() => ({ mockRouterPush: vi.fn() }));

vi.mock("next/navigation", () => makeNextNavigationMock({ push: mockRouterPush })());
vi.mock("next/link", () => nextLinkMock());
vi.mock("next/image", () => nextImageMock());
vi.mock("@/components/design-system/atoms/animation/motion-div", () => motionDivMock());
vi.mock("framer-motion", () => ({
    AnimatePresence: ({ children }: React.PropsWithChildren) => <>{children}</>,
    motion: {
        div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div {...props}>{children}</div>,
        nav: ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => <nav {...props}>{children}</nav>,
    },
}));

const searchResultsMock = vi.fn(() => [{ ref: "post-1" }]);
const searchGetDocMock = vi.fn(() => ({
    slug: "/blog/post/2024/01/01/hello-world",
    title: "Hello World",
    description: "First post about React",
    tags: [],
    authors: [],
}));

vi.mock("elasticlunr", () => ({
    default: {
        Index: {
            load: vi.fn(() => ({
                search: searchResultsMock,
                documentStore: { getDoc: searchGetDocMock },
            })),
        },
    },
}));

const filesystemFixture = {
    root: {
        type: "dir",
        children: {
            blog: {
                type: "dir",
                route: "/blog",
                title: "blog",
                description: "Blog posts",
                children: {
                    "2024": {
                        type: "dir",
                        title: "2024",
                        description: "Posts in 2024",
                        children: {
                            "hello-world": {
                                type: "file",
                                title: "Hello World",
                                description: "First post about React",
                                route: "/blog/post/2024/01/01/hello-world",
                            },
                        },
                    },
                },
            },
            "about-me": { type: "file", title: "About Me", description: "Bio", route: "/about-me" },
        },
    },
};

const flushMicrotasks = () => act(async () => {});

describe("Terminal", () => {
    beforeEach(() => {
        Element.prototype.scrollIntoView = vi.fn();
        mockRouterPush.mockClear();
        searchResultsMock.mockClear();
        searchGetDocMock.mockClear();
        vi.spyOn(globalThis, "fetch").mockImplementation((input: string | URL | Request) => {
            const url = typeof input === "string" ? input : input.toString();

            if (url.includes("filesystem.json")) {
                return Promise.resolve({ json: () => Promise.resolve(filesystemFixture) } as Response);
            }

            return Promise.resolve({ json: () => Promise.resolve({ index: "data" }) } as Response);
        });
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe("boot", () => {
        it("prints the boot banner and the initial hint on mount", async () => {
            render(<Terminal />);

            expect(screen.getByText(/type "help" for a list of commands/i)).toBeInTheDocument();
            await flushMicrotasks();
        });

        it("focuses the command input on mount", async () => {
            render(<Terminal />);
            await flushMicrotasks();

            expect(screen.getByPlaceholderText("type a command_")).toHaveFocus();
        });

        it("shows the terminal header before any command has run", async () => {
            render(<Terminal />);
            await flushMicrotasks();

            expect(screen.getByText("Terminal")).toBeInTheDocument();
        });
    });

    describe("running a command", () => {
        it("echoes the typed command and renders its output", async () => {
            const user = userEvent.setup();
            render(<Terminal />);
            await flushMicrotasks();

            const input = screen.getByPlaceholderText("type a command_");
            await user.type(input, "help{Enter}");

            expect(screen.getByText(/\/ \$ help/)).toBeInTheDocument();
            expect(screen.getByText(/list directory contents/)).toBeInTheDocument();
        });

        it("clears the input after submitting", async () => {
            const user = userEvent.setup();
            render(<Terminal />);
            await flushMicrotasks();

            const input = screen.getByPlaceholderText("type a command_");
            await user.type(input, "pwd{Enter}");

            expect(input).toHaveValue("");
        });

        it("hides the header once a command has run", async () => {
            const user = userEvent.setup();
            render(<Terminal />);
            await flushMicrotasks();

            const input = screen.getByPlaceholderText("type a command_");
            await user.type(input, "pwd{Enter}");

            expect(screen.queryByText("Terminal")).not.toBeInTheDocument();
        });

        it("lists the root of the loaded filesystem for ls", async () => {
            const user = userEvent.setup();
            render(<Terminal />);
            await flushMicrotasks();

            const input = screen.getByPlaceholderText("type a command_");
            await user.type(input, "ls{Enter}");

            expect(screen.getByText("about-me")).toBeInTheDocument();
            expect(screen.getByText("blog/")).toBeInTheDocument();
        });

        it("navigates via router.push when open resolves a route", async () => {
            const user = userEvent.setup();
            render(<Terminal />);
            await flushMicrotasks();

            const input = screen.getByPlaceholderText("type a command_");
            await user.type(input, "open about-me{Enter}");

            expect(mockRouterPush).toHaveBeenCalledWith("/about-me");
        });

        it("shows an error for an unknown command", async () => {
            const user = userEvent.setup();
            render(<Terminal />);
            await flushMicrotasks();

            const input = screen.getByPlaceholderText("type a command_");
            await user.type(input, "sudo{Enter}");

            expect(screen.getAllByText(/command not found: sudo/).length).toBeGreaterThan(0);
        });

        it("renders search results bridged through the shared search hook", async () => {
            const user = userEvent.setup();
            render(<Terminal />);
            await flushMicrotasks();

            const input = screen.getByPlaceholderText("type a command_");
            await user.type(input, "search react{Enter}");

            await waitFor(() => expect(screen.getByText("> Hello World")).toBeInTheDocument());
        });
    });

    describe("command history", () => {
        it("recalls the previous command with ArrowUp and clears it with ArrowDown", async () => {
            const user = userEvent.setup();
            render(<Terminal />);
            await flushMicrotasks();

            const input = screen.getByPlaceholderText("type a command_");
            await user.type(input, "pwd{Enter}");
            await user.type(input, "help{Enter}");

            await user.keyboard("{ArrowUp}");
            expect(input).toHaveValue("help");

            await user.keyboard("{ArrowUp}");
            expect(input).toHaveValue("pwd");

            await user.keyboard("{ArrowDown}");
            expect(input).toHaveValue("help");

            await user.keyboard("{ArrowDown}");
            expect(input).toHaveValue("");
        });
    });

    describe("tab completion chips", () => {
        it("shows completion chips while typing and fills the input when one is clicked", async () => {
            const user = userEvent.setup();
            render(<Terminal />);
            await flushMicrotasks();

            const input = screen.getByPlaceholderText("type a command_");
            await user.type(input, "cd bl");

            const chip = await screen.findByRole("button", { name: "blog/" });
            await user.click(chip);

            expect(input).toHaveValue("cd blog/");
        });
    });

    describe("accessibility", () => {
        it("exposes a polite live region that announces a concise status after a command runs", async () => {
            const user = userEvent.setup();
            render(<Terminal />);
            await flushMicrotasks();

            const input = screen.getByPlaceholderText("type a command_");
            await user.type(input, "ls{Enter}");

            const liveRegion = document.querySelector('[aria-live="polite"]');
            expect(liveRegion).toHaveTextContent("/: 2 items");
        });

        it("wraps the terminal content in a main landmark", async () => {
            render(<Terminal />);
            await flushMicrotasks();

            expect(screen.getByRole("main")).toBeInTheDocument();
        });
    });
});
