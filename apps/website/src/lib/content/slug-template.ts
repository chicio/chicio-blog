/**
 * A slug template is a route shape with its dynamic segments in brackets, e.g.
 * `/videogames/console/[console]/game/[game]`. It is the single description of a content section's
 * route: the filesystem reader walks it to find content, the `/markdown` route matches incoming paths
 * against it and builds its static params from it. Everything about a section's URL shape is derived
 * from here rather than restated as prefixes and segment counts.
 */

export const segmentsOfSlugTemplate = (template: string): string[] =>
    template.split("/").filter((segment) => segment.length > 0);

export const paramNameOfSegment = (segment: string): string | undefined => segment.match(/^\[([^\]]+)\]$/)?.[1];

/**
 * Matches concrete path segments against a template, returning the captured params, or undefined when
 * the path does not have this shape. Literal segments must match exactly, which is what distinguishes
 * `console/[console]` from `console/[console]/game/[game]` without counting segments by hand.
 */
export const matchSlugTemplate = (template: string, pathSegments: string[]): Record<string, string> | undefined => {
    const templateSegments = segmentsOfSlugTemplate(template);

    if (templateSegments.length !== pathSegments.length) {
        return undefined;
    }

    const params: Record<string, string> = {};

    for (const [index, templateSegment] of templateSegments.entries()) {
        const paramName = paramNameOfSegment(templateSegment);

        if (paramName) {
            params[paramName] = pathSegments[index];
        } else if (templateSegment !== pathSegments[index]) {
            return undefined;
        }
    }

    return params;
};

/** The inverse of `matchSlugTemplate`: fills a template's dynamic segments in from params. */
export const pathSegmentsFor = (template: string, params: Record<string, string>): string[] =>
    segmentsOfSlugTemplate(template).map((segment) => {
        const paramName = paramNameOfSegment(segment);

        return paramName ? params[paramName] : segment;
    });

export const slugFor = (template: string, params: Record<string, string>): string =>
    `/${pathSegmentsFor(template, params).join("/")}`;
