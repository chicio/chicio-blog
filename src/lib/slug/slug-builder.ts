export const buildSlug = (slug: string, params: Record<string, string | number>): string => {
    let result = slug;
    
    for (const [key, value] of Object.entries(params)) {
        result = result.replace(`[${key}]`, String(value));
    }
    
    return result;
};
