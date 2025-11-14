import type { MDXComponents } from 'mdx/types'

const components: MDXComponents = {
    table: (props) => (
        <div className="table-wrapper">
            <table {...props} />
        </div>
    ),
}

export function useMDXComponents(): MDXComponents {
    return components
}