import { ErrorText } from "@/components/design-system/atoms/typography/terminal-blocks";
import { Markdown } from "@/components/design-system/atoms/typography/markdown";
import { MotionDiv } from "@/components/design-system/atoms/animation/motion-div";
import { FC } from "react";
import type { TerminalContentBlockData } from "@/types/terminal/terminal";

export type TerminalContentBlockProps = TerminalContentBlockData;

const SEPARATOR_BOTTOM = "─── EOF ─ close for full page ───";

export const TerminalContentBlock: FC<TerminalContentBlockProps> = ({ route, title, status, markdown }) => (
    <MotionDiv
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="border-accent/20 my-3 border-y py-3"
    >
        <div className="text-accent/50 mb-2 font-mono text-xs">{`─── ${route} ───`}</div>

        {status === "loading" && (
            <p className="text-primary-text/60 font-mono text-xs">{`loading ${title}...`}</p>
        )}

        {status === "unavailable" && (
            <ErrorText>
                {`${title}: no terminal view available — run \`close\` to open it in the browser`}
            </ErrorText>
        )}

        {status === "error" && (
            <ErrorText>{`${title}: failed to load content — run \`close\` to view it in the browser`}</ErrorText>
        )}

        {status === "success" && markdown && (
            <div className="text-primary-text/90 [&_h1]:text-lg [&_h2]:text-base [&_h3]:text-sm [&_p]:my-2 [&_p]:text-xs [&_p]:sm:text-sm [&_ul]:my-2 [&_img]:border-accent/40 [&_img]:grayscale [&_img]:sepia [&_img]:hue-rotate-90 [&_img]:saturate-[4] [&_img]:brightness-90 [&_img]:rounded [&_img]:border [&_img]:shadow-[0_0_8px_var(--color-accent-alpha-25)] text-xs leading-relaxed sm:text-sm">
                <Markdown content={markdown} id={`terminal-content-${route}`} />
            </div>
        )}

        <div className="text-accent/50 mt-2 font-mono text-xs">{SEPARATOR_BOTTOM}</div>
    </MotionDiv>
);
