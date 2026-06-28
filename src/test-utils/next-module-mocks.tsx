import { type AnchorHTMLAttributes, type ImgHTMLAttributes } from "react";

/**
 * Mock factory for next/link. Renders a plain <a> tag so that
 * href, aria-label, and click handlers are testable without
 * the Next.js router runtime.
 *
 * IMPORTANT — vitest hoisting: vi.mock() calls are hoisted before imports.
 * Do NOT pass this function as the second argument to vi.mock() directly.
 * Instead, call it inside a factory lambda:
 *
 *   vi.mock("next/link", () => nextLinkMock());
 *
 * Or inline the mock object for the simplest case (see seed tests).
 */
export function nextLinkMock() {
    return {
        default: ({
            href,
            children,
            ...rest
        }: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
            <a href={href} {...rest}>
                {children}
            </a>
        ),
    };
}

/**
 * Mock factory for next/image. Renders a plain <img> tag so that
 * alt text and src are testable without the Next.js image optimisation
 * pipeline.
 *
 * IMPORTANT — vitest hoisting: vi.mock() calls are hoisted before imports.
 * Do NOT pass this function as the second argument to vi.mock() directly.
 * Instead, call it inside a factory lambda:
 *
 *   vi.mock("next/image", () => nextImageMock());
 *
 * Or inline the mock object for the simplest case (see seed tests).
 */
export function nextImageMock() {
    return {
        default: ({
            alt,
            src,
            ...rest
        }: ImgHTMLAttributes<HTMLImageElement> & { src: string; alt: string }) => (
            <img alt={alt} src={src} {...rest} />
        ),
    };
}
