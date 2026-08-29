import { siteMetadata } from '@/types/configuration/site-metadata'
import { slugs } from '@/types/configuration/slug'

export function GET(): Response {
    const content = [
        'User-agent: *',
        'Allow: /',
        `Disallow: ${slugs.chat}`,
        'Content-Signal: ai-train=no, search=yes, ai-input=yes',
        '',
        `Sitemap: ${siteMetadata.siteUrl}/sitemap.xml`,
    ].join('\n')

    return new Response(content, {
        headers: {
            'Content-Type': 'text/plain; charset=utf-8',
        },
    })
}
