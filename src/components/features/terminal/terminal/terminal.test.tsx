import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { act, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { render, nextImageMock, nextLinkMock, motionDivMock, makeNextNavigationMock } from "@/test-utils";
import { terminalOverlayOpenEvent } from "@/components/design-system/state/terminal/terminal-events";
import { registerAppRootElement } from "@/lib/terminal/terminal-overlay-dom";
import { Terminal } from "./terminal";

const { mockRouterPush, mockRouterReplace } = vi.hoisted(() => ({
    mockRouterPush: vi.fn(),
    mockRouterReplace: vi.fn(),
}));

vi.mock("next/navigation", () => makeNextNavigationMock({ push: mockRouterPush, replace: mockRouterReplace })());
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
            chat: { type: "file", title: "Chat", description: "Talk to the AI", route: "/chat" },
        },
    },
};

const flushMicrotasks = () => act(async () => {});

const openOverlay = async () => {
    await act(async () => {
        window.dispatchEvent(new Event(terminalOverlayOpenEvent));
    });
};

describe("Terminal", () => {
    beforeEach(() => {
        Element.prototype.scrollIntoView = vi.fn();
        mockRouterPush.mockClear();
        mockRouterReplace.mockClear();
        searchResultsMock.mockClear();
        searchGetDocMock.mockClear();
        registerAppRootElement(null);
        window.history.pushState(null, "", "/");
        vi.spyOn(globalThis, "fetch").mockImplementation((input: string | URL | Request) => {
            const url = typeof input === "string" ? input : input.toString();

            if (url.includes("filesystem.json")) {
                return Promise.resolve({ json: () => Promise.resolve(filesystemFixture) } as Response);
            }

            if (url.includes("search-index.json")) {
                return Promise.resolve({ json: () => Promise.resolve({ index: "data" }) } as Response);
            }

            if (url === "/markdown/about-me") {
                return Promise.resolve({
                    ok: true,
                    status: 200,
                    text: () => Promise.resolve("# About Me\n\nHello there."),
                } as Response);
            }

            return Promise.resolve({ ok: false, status: 404, text: () => Promise.resolve("") } as Response);
        });
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe("closed by default", () => {
        it("renders nothing until the overlay is opened", () => {
            const { container } = render(<Terminal />);
            expect(container.firstChild).toBeNull();
        });
    });

    describe("opening the overlay", () => {
        it("prints the boot banner and focuses the command input", async () => {
            render(<Terminal />);
            await openOverlay();

            expect(screen.getByText(/type "help" for a list of commands/i)).toBeInTheDocument();
            expect(screen.getByPlaceholderText("type a command_")).toHaveFocus();
        });

        it("exposes dialog semantics", async () => {
            render(<Terminal />);
            await openOverlay();

            const dialog = screen.getByRole("dialog", { name: "Terminal" });
            expect(dialog).toHaveAttribute("aria-modal", "true");
        });

        it("mounts the green phosphor duotone SVG filter used by in-shell images", async () => {
            const { container } = render(<Terminal />);
            await openOverlay();

            expect(container.querySelector("filter#terminal-phosphor")).toBeInTheDocument();
        });

        it("restores focus to the element that triggered the open event on close", async () => {
            render(
                <>
                    <button type="button">trigger</button>
                    <Terminal />
                </>,
            );
            const trigger = screen.getByRole("button", { name: "trigger" });
            trigger.focus();
            expect(trigger).toHaveFocus();

            await openOverlay();
            expect(screen.getByPlaceholderText("type a command_")).toHaveFocus();

            const user = userEvent.setup();
            await user.type(screen.getByPlaceholderText("type a command_"), "close{Enter}");

            expect(trigger).toHaveFocus();
        });

        it("closes on Escape and reveals the page underneath", async () => {
            render(<Terminal />);
            await openOverlay();
            expect(screen.getByPlaceholderText("type a command_")).toBeInTheDocument();

            const user = userEvent.setup();
            await user.keyboard("{Escape}");

            expect(screen.queryByPlaceholderText("type a command_")).not.toBeInTheDocument();
        });

        it("closes when the backdrop is clicked", async () => {
            const { container } = render(<Terminal />);
            await openOverlay();

            const user = userEvent.setup();
            await user.click(container.firstChild as Element);

            expect(screen.queryByPlaceholderText("type a command_")).not.toBeInTheDocument();
        });

        it("does not close when clicking inside the dialog panel", async () => {
            render(<Terminal />);
            await openOverlay();

            const user = userEvent.setup();
            await user.click(screen.getByRole("dialog"));

            expect(screen.getByPlaceholderText("type a command_")).toBeInTheDocument();
        });

        it("marks the registered app-root element inert while open and clears it on close", async () => {
            const appRoot = document.createElement("div");
            registerAppRootElement(appRoot);

            render(<Terminal />);
            await openOverlay();
            expect(appRoot).toHaveAttribute("inert");
            expect(appRoot).toHaveAttribute("aria-hidden", "true");

            const user = userEvent.setup();
            await user.keyboard("{Escape}");

            expect(appRoot).not.toHaveAttribute("inert");
            expect(appRoot).not.toHaveAttribute("aria-hidden");
        });
    });

    describe("the boot link (fresh load of /terminal)", () => {
        it("replaces the route with / (via router.replace, so the homepage actually mounts) and opens itself", async () => {
            window.history.pushState(null, "", "/terminal");

            render(<Terminal />);
            await flushMicrotasks();

            expect(mockRouterReplace).toHaveBeenCalledWith("/");
            expect(screen.getByPlaceholderText("type a command_")).toBeInTheDocument();
        });
    });

    describe("open vs cat", () => {
        it("open pushes the real URL, renders the page in-shell between separators", async () => {
            const user = userEvent.setup();
            render(<Terminal />);
            await openOverlay();
            await flushMicrotasks();

            await user.type(screen.getByPlaceholderText("type a command_"), "open about-me{Enter}");

            expect(mockRouterPush).toHaveBeenCalledWith("/about-me");
            expect(screen.getByText("─── /about-me ───")).toBeInTheDocument();
            await waitFor(() => expect(screen.getByRole("heading", { name: "About Me" })).toBeInTheDocument());
            expect(screen.getByText(/EOF ─ close for full page/)).toBeInTheDocument();
        });

        it("cat renders the page in-shell without touching the URL", async () => {
            const user = userEvent.setup();
            render(<Terminal />);
            await openOverlay();
            await flushMicrotasks();

            await user.type(screen.getByPlaceholderText("type a command_"), "cat about-me{Enter}");

            expect(mockRouterPush).not.toHaveBeenCalled();
            await waitFor(() => expect(screen.getByRole("heading", { name: "About Me" })).toBeInTheDocument());
        });

        it("shows a stub for a page with no terminal (markdown) view", async () => {
            const user = userEvent.setup();
            render(<Terminal />);
            await openOverlay();
            await flushMicrotasks();

            await user.type(screen.getByPlaceholderText("type a command_"), "open chat{Enter}");

            expect(mockRouterPush).toHaveBeenCalledWith("/chat");
            await waitFor(() =>
                expect(screen.getByText(/no terminal view available/)).toBeInTheDocument(),
            );
        });
    });

    describe("popstate mirroring", () => {
        it("re-renders the landed page and updates cwd when the browser navigates back/forward", async () => {
            render(<Terminal />);
            await openOverlay();
            await flushMicrotasks();

            await act(async () => {
                window.history.pushState(null, "", "/about-me");
                window.dispatchEvent(new PopStateEvent("popstate"));
            });

            await waitFor(() => expect(screen.getByRole("heading", { name: "About Me" })).toBeInTheDocument());

            const user = userEvent.setup();
            await user.type(screen.getByPlaceholderText("type a command_"), "pwd{Enter}");
            expect(screen.getByText(/\/about-me \$ pwd/)).toBeInTheDocument();
        });
    });

    describe("running an ordinary command", () => {
        it("echoes the typed command and renders its output", async () => {
            const user = userEvent.setup();
            render(<Terminal />);
            await openOverlay();
            await flushMicrotasks();

            await user.type(screen.getByPlaceholderText("type a command_"), "help{Enter}");

            expect(screen.getByText(/\/ \$ help/)).toBeInTheDocument();
            expect(screen.getByText(/list directory contents/)).toBeInTheDocument();
        });

        it("renders search results bridged through the shared search hook", async () => {
            const user = userEvent.setup();
            render(<Terminal />);
            await openOverlay();
            await flushMicrotasks();

            await user.type(screen.getByPlaceholderText("type a command_"), "search react{Enter}");

            await waitFor(() => expect(screen.getByText("> Hello World")).toBeInTheDocument());
        });
    });

    describe("accessibility", () => {
        it("exposes a polite live region that announces a concise status after a command runs", async () => {
            const user = userEvent.setup();
            render(<Terminal />);
            await openOverlay();
            await flushMicrotasks();

            await user.type(screen.getByPlaceholderText("type a command_"), "ls{Enter}");

            const liveRegion = document.querySelector('[aria-live="polite"]');
            expect(liveRegion).toHaveTextContent(/items/);
        });
    });
});
