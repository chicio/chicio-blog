import { type HTMLAttributes } from "react";

/**
 * Mock factory for the design-system MotionDiv atom. Renders a plain <div> so
 * framer-motion's animation runtime is not needed in jsdom.
 *
 * IMPORTANT — vitest hoisting: vi.mock() is hoisted above imports. Call this
 * inside the factory lambda, do not pass it as the second argument directly:
 *
 *   vi.mock("@/components/design-system/atoms/animation/motion-div", () => motionDivMock());
 */
export function motionDivMock() {
    return {
        MotionDiv: ({ children, ...props }: HTMLAttributes<HTMLDivElement>) => <div {...props}>{children}</div>,
    };
}
