import { type HTMLAttributes } from "react";

/**
 * Mock factory for the design system's MotionDiv atom. Renders a plain <div> so framer-motion's
 * animation runtime is not needed in jsdom.
 *
 * IMPORTANT — vitest hoisting: vi.mock() is hoisted above imports. Call this inside the factory
 * lambda, do not pass it as the second argument directly:
 *
 *   vi.mock("matrix-design-system", async (original) => ({ ...(await original()), ...motionDivMock() }));
 */
export function motionDivMock() {
    return {
        MotionDiv: ({ children, ...props }: HTMLAttributes<HTMLDivElement>) => <div {...props}>{children}</div>,
    };
}
