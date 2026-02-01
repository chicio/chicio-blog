export function getClientIp(headers: Headers): string {
    // See https://vercel.com/docs/headers/request-headers#x-forwarded-for
    const forwarded = headers.get("x-forwarded-for");

    if (forwarded) {
        return forwarded.split(",")[0].trim();
    }

    return "unknown";
}