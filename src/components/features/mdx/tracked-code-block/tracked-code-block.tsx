"use client";

import { ComponentProps } from "react";
import { CodeBlock } from "@/components/design-system/molecules/code/code-block";
import { trackWith } from "@/lib/tracking/tracking";
import { tracking } from "@/types/configuration/tracking";

const trackCopyCodeBlock = () => {
    trackWith({
        action: tracking.action.copy_code_block,
        category: tracking.category.blog_post,
        label: tracking.label.body,
    });
};

export const TrackedCodeBlock = (props: ComponentProps<"pre">) => (
    <CodeBlock {...props} onCopy={trackCopyCodeBlock} />
);
