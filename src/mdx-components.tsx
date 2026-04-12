import type { MDXComponents } from 'mdx/types'
import { CodeBlock } from "@/components/design-system/molecules/code/code-block";

const components: MDXComponents = {
    table: (props) => (
        <div className="table-wrapper">
            <table {...props} />
        </div>
    ),
    pre: (props) => <CodeBlock {...props} />,
}

export function useMDXComponents(): MDXComponents {
    return components
}