---
paths:
  - "src/content/**/*.mdx"
  - "src/mdx-components.tsx"
---

# MDX Content Conventions

## File Structure
All content is MDX (`.mdx`). Each content piece is a `content.mdx` file inside a directory whose path encodes the route parameters.

- Blog posts: `src/content/blog/post/[year]/[month]/[day]/[slug]/content.mdx`
- DSA topics: `src/content/data-structures-and-algorithms/topic/[topic]/content.mdx`
- DSA exercises: `src/content/data-structures-and-algorithms/topic/[topic]/exercise/[exercise]/content.mdx`
- Videogame consoles: `src/content/videogames/console/[console]/content.mdx`
- Videogame games: `src/content/videogames/console/[console]/game/[game]/content.mdx`
- About me: `src/content/about-me/content.mdx`

## Frontmatter (required)
```yaml
---
title: "Title"
description: "Description"
date: YYYY-MM-DD
image: /images/content/blog/post/YYYY/MM/DD/slug/image.jpg
tags: [tag1, tag2]
authors: [fabrizio_duroni]
---
```

Additional metadata fields per content type:
- DSA exercises: `metadata: { technique: "...", leetcodeUrl: "..." }`
- Videogame consoles: `metadata: { logo, releaseYear, acquiredYear, bits, generation, manufacturer, ... }`
- Videogame games: `metadata: { releaseYear, console, developer, publisher, genre, pegiRating, region, formats, ... }`

## Blog Post Writing Style
- Start with an italic abstract repeating/expanding the description
- Follow with `---` horizontal rule separator
- Use conversational but technical tone
- Reference other blog posts with relative links: `[text](/blog/post/YYYY/MM/DD/slug)`
- Emoji shortcodes are supported (e.g., `:laughing:`, `:sweat_smile:`)
- Images are co-located in the post directory: place image files in `<post-dir>/images/` and reference them as `![alt](/images/content/blog/post/YYYY/MM/DD/slug/filename.png)`

## Component Imports
- Import components at the top of the MDX file, right after frontmatter
- Use `@/` import alias: `import { Youtube } from "@/components/design-system/molecules/video/youtube"`
- DSA topics import from `@/components/content/data-structures-and-algorithms/components/`
- Only `<table>` is globally mapped in `src/mdx-components.tsx` — all other custom components must be explicitly imported

## DSA Content Style
- Start with an `# H1` heading matching the topic name
- Bold key terms on first mention
- Use code blocks with `typescript` language tag for all code examples
- Include practical tips and edge cases in prose
- End topics with `<TopicExercises topic="slug" />` to render the exercise table
