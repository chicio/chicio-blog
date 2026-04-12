import type { MDXComponents } from 'mdx/types'
import { CopyCodeBlock } from "@/components/design-system/molecules/code/copy-code-block";

const components: MDXComponents = {
    table: (props) => (
        <div className="table-wrapper">
            <table {...props} />
        </div>
    ),
    pre: (props) => <CopyCodeBlock {...props} />,
}

export function useMDXComponents(): MDXComponents {
    return components
}