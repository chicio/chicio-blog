# Author pages redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give the author cards a catchier glass treatment, give the author detail page an organized profile-hero box, and share one hero shell between the author page and About Me.

**Architecture:** Extract the tag pill into a reusable `Chip` atom; generalize `ProfilePhoto` to take an image `src`; add a presentational `ProfileHero` shell organism (glass card + photo + name + role + children slot) used by both the About Me box and the author detail page. Author socials become a small presentational sub-component that renders only the fields present on the author.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript (strict), TailwindCSS v4, Framer Motion, Vitest + React Testing Library, react-icons.

## Global Constraints

- **Prerequisite (owned by the site author, in progress — NOT part of this plan):** `Author.imageLarge` is made **required** and every author record gets an `imageLarge` value. This plan assumes `author.imageLarge` is a `string`. Tasks 6 and 7 will only typecheck/build once that change is in the tree.
- Code style: 4-space indent, 120-char lines, always braces on `if`, `@/` import alias, named exports only, no default exports.
- No functions in JSX (`react/jsx-no-bind` at error) — curry handlers in the store.
- One hook per component file — the component's own `use<Name>Store()`; `useGlassmorphism` is the permanent exception (may be called alongside the store hook).
- No decorative/structural comments (no section dividers).
- Design-system layering (dependency-cruiser, error): atoms ✗ molecules/organism/templates; molecules ✗ organism/templates; organism ✗ templates; `design-system/**` ✗ `features/**`/`content/**`/`lib/**`; `design-system` may import `types` **type-only**; content pages ✗ each other; cross-folder imports go through `index.ts` barrels.
- Every component lives in its own kebab-case folder: `<name>.tsx` + `index.ts` (+ `use-<name>-store.ts` only if it has state/effects). Purely presentational components (like `ProfilePhoto`) have no store.
- Matrix theme only: reuse `glassmorphism`/`glow-container` classes and existing tokens; never hardcode the glass class — use `useGlassmorphism`.
- Verification gates (run before considering the whole plan done): `npm run lint`, `npm run validate-architecture`, `npm run knip`, `npm run typecheck`, `npm run test:run`, `npm run build`. Keep coverage at/above floor (statements 64 / branches 59 / functions 61 / lines 65).

---

## Task 1: `Chip` atom (extract the tag pill)

**Files:**
- Create: `src/components/design-system/atoms/chip/chip.tsx`
- Create: `src/components/design-system/atoms/chip/index.ts`
- Create (test): `src/components/design-system/atoms/chip/chip.test.tsx`
- Modify: `src/components/design-system/molecules/buttons/tag/tag.tsx`

**Interfaces:**
- Produces: `Chip: FC<{ children: ReactNode; big?: boolean; className?: string }>` (default `big=false`). Renders a `<span class="glow-container text-shadow-sm p-2 block text-primary-text {text-sm|text-2xl} leading-none {className}">`.
- `Tag` keeps its existing public API (`TagProps` unchanged); internally composes `InternalLink` + `Chip`.

- [ ] **Step 1: Write the failing test** — `src/components/design-system/atoms/chip/chip.test.tsx`

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Chip } from "./chip";

describe("Chip", () => {
    describe("render", () => {
        it("renders its children", () => {
            render(<Chip>3 posts</Chip>);
            expect(screen.getByText("3 posts")).toBeInTheDocument();
        });
    });

    describe("props", () => {
        it("applies the small text class by default", () => {
            render(<Chip>x</Chip>);
            expect(screen.getByText("x")).toHaveClass("text-sm");
        });

        it("applies the large text class when big is true", () => {
            render(<Chip big>x</Chip>);
            expect(screen.getByText("x")).toHaveClass("text-2xl");
        });

        it("appends a custom className", () => {
            render(<Chip className="mt-1">x</Chip>);
            expect(screen.getByText("x")).toHaveClass("mt-1");
        });
    });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/components/design-system/atoms/chip/chip.test.tsx`
Expected: FAIL — cannot resolve `./chip`.

- [ ] **Step 3: Create the `Chip` component** — `src/components/design-system/atoms/chip/chip.tsx`

```tsx
import { FC, ReactNode } from "react";

export interface ChipProps {
    children: ReactNode;
    big?: boolean;
    className?: string;
}

export const Chip: FC<ChipProps> = ({ children, big = false, className }) => {
    const textSize = big ? "text-2xl" : "text-sm";

    return (
        <span
            className={`glow-container text-shadow-sm p-2 block text-primary-text ${textSize} leading-none${className ? ` ${className}` : ""}`}
        >
            {children}
        </span>
    );
};
```

- [ ] **Step 4: Create the barrel** — `src/components/design-system/atoms/chip/index.ts`

```ts
export { Chip } from "./chip";
export type { ChipProps } from "./chip";
```

- [ ] **Step 5: Run the Chip test to verify it passes**

Run: `npx vitest run src/components/design-system/atoms/chip/chip.test.tsx`
Expected: PASS (4 tests).

- [ ] **Step 6: Refactor `Tag` to compose `Chip`** — replace the full contents of `src/components/design-system/molecules/buttons/tag/tag.tsx`

```tsx
import { InternalLink } from "@/components/design-system/atoms/links/internal-link";
import { Chip } from "@/components/design-system/atoms/chip";
import { FC } from "react";

interface TagContentProps {
    big: boolean;
}

export type TagProps = TagContentProps & {
    link: string;
    tag: string;
    onClick?: () => void;
};

export const Tag: FC<TagProps> = ({ tag, link, big, onClick }) => {
    const margins = big ? "mr-4 mb-6" : "mr-1 mb-1";

    return (
        <InternalLink
            className="inline-block no-underline"
            onClick={onClick}
            to={link}
        >
            <Chip
                big={big}
                className={margins}
            >
                {tag}
            </Chip>
        </InternalLink>
    );
};
```

- [ ] **Step 7: Run the existing Tag test to verify no regression**

Run: `npx vitest run src/components/design-system/molecules/buttons/tag/tag.test.tsx`
Expected: PASS (all existing tests — text, href, `text-2xl`/`text-sm`, onClick).

- [ ] **Step 8: Commit**

```bash
git add src/components/design-system/atoms/chip src/components/design-system/molecules/buttons/tag/tag.tsx
git commit -m "feat(ux): :sparkles: extract Chip atom from Tag pill"
```

---

## Task 2: Generalize `ProfilePhoto` with an optional `src`

**Files:**
- Modify: `src/components/design-system/organism/profile-photo/profile-photo.tsx`
- Modify (test): `src/components/design-system/organism/profile-photo/profile-photo.test.tsx`

**Interfaces:**
- Produces: `ProfilePhoto: FC<{ author: string; src?: string }>` — `src` defaults to `/media/authors/fabrizio-duroni.jpg`; `author` is the alt text. Backwards compatible.

- [ ] **Step 1: Add the failing test** — append inside the `describe("render", ...)` block in `profile-photo.test.tsx`

```tsx
        it("renders a provided src", () => {
            render(
                <ProfilePhoto
                    author="Alessandro Romano"
                    src="/media/authors/alessandro-romano-large.jpg"
                />,
            );
            expect(screen.getByAltText("Alessandro Romano")).toHaveAttribute(
                "src",
                "/media/authors/alessandro-romano-large.jpg",
            );
        });
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/components/design-system/organism/profile-photo/profile-photo.test.tsx`
Expected: FAIL — the image still renders the hardcoded fabrizio src (assertion mismatch) OR a TS error on the unknown `src` prop.

- [ ] **Step 3: Implement the `src` prop** — replace the full contents of `profile-photo.tsx`

```tsx
import { ImageGlow } from "@/components/design-system/atoms/effects/image-glow";
import { FC } from "react";

const defaultProfilePhoto = "/media/authors/fabrizio-duroni.jpg";

export const ProfilePhoto: FC<{ author: string; src?: string }> = ({ author, src = defaultProfilePhoto }) => (
    <div className="flex items-center justify-center">
        <ImageGlow
            className="w-[150px] h-[150px] rounded-full"
            src={src}
            alt={author}
            width={150}
            height={150}
            preload
        />
    </div>
);
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run src/components/design-system/organism/profile-photo/profile-photo.test.tsx`
Expected: PASS (default-src test + provided-src test).

- [ ] **Step 5: Commit**

```bash
git add src/components/design-system/organism/profile-photo
git commit -m "feat(ux): :sparkles: ProfilePhoto accepts an optional image src"
```

---

## Task 3: `ProfileHero` shell organism

**Files:**
- Create: `src/components/design-system/organism/profile-hero/profile-hero.tsx`
- Create: `src/components/design-system/organism/profile-hero/index.ts`
- Create (test): `src/components/design-system/organism/profile-hero/profile-hero.test.tsx`

**Interfaces:**
- Consumes: `ProfilePhoto` (Task 2), `useGlassmorphism` (`{ glassmorphismClass }`).
- Produces: `ProfileHero: FC<{ name: string; role?: string; imageSrc?: string; imageAlt?: string; children?: ReactNode }>`. Renders the glass card (`my-7 p-4 {glassmorphismClass}`), `ProfilePhoto` (alt = `imageAlt ?? name`, src = `imageSrc`), `<h3>` name, `<h5>` role when present, then `children`. Name `h3` / role `h5` (matches the current About Me box heading levels).

- [ ] **Step 1: Write the failing test** — `src/components/design-system/organism/profile-hero/profile-hero.test.tsx`

```tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProfileHero } from "./profile-hero";

vi.mock("next/image", () => ({
    default: ({ alt, src, ...rest }: React.ImgHTMLAttributes<HTMLImageElement> & { src: string }) => (
        <img alt={alt} src={src} {...rest} />
    ),
}));

describe("ProfileHero", () => {
    describe("render", () => {
        it("renders the name", () => {
            render(<ProfileHero name="Alessandro Romano" />);
            expect(screen.getByText("Alessandro Romano")).toBeInTheDocument();
        });

        it("renders the role when provided", () => {
            render(<ProfileHero name="A" role="Senior Engineer" />);
            expect(screen.getByText("Senior Engineer")).toBeInTheDocument();
        });

        it("does not render a role when absent", () => {
            render(<ProfileHero name="A" />);
            expect(screen.queryByText("Senior Engineer")).not.toBeInTheDocument();
        });

        it("renders children in the content slot", () => {
            render(
                <ProfileHero name="A">
                    <button>Jump</button>
                </ProfileHero>,
            );
            expect(screen.getByRole("button", { name: "Jump" })).toBeInTheDocument();
        });

        it("passes the image src and alt through to the photo", () => {
            render(<ProfileHero name="A" imageSrc="/media/authors/a-large.jpg" imageAlt="A photo" />);
            expect(screen.getByAltText("A photo")).toHaveAttribute("src", "/media/authors/a-large.jpg");
        });
    });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/components/design-system/organism/profile-hero/profile-hero.test.tsx`
Expected: FAIL — cannot resolve `./profile-hero`.

- [ ] **Step 3: Create the component** — `src/components/design-system/organism/profile-hero/profile-hero.tsx`

```tsx
"use client";

import { ProfilePhoto } from "@/components/design-system/organism/profile-photo";
import { useGlassmorphism } from "@/components/design-system/hooks/use-glassmorphism";
import { FC, ReactNode } from "react";

export interface ProfileHeroProps {
    name: string;
    role?: string;
    imageSrc?: string;
    imageAlt?: string;
    children?: ReactNode;
}

export const ProfileHero: FC<ProfileHeroProps> = ({ name, role, imageSrc, imageAlt, children }) => {
    const { glassmorphismClass } = useGlassmorphism();

    return (
        <div className={`my-7 p-4 ${glassmorphismClass}`}>
            <ProfilePhoto author={imageAlt ?? name} src={imageSrc} />
            <div className="text-center">
                <h3 className="text-primary-text mx-0 mt-3 text-center">{name}</h3>
                {role && <h5 className="text-secondary-text text-center">{role}</h5>}
            </div>
            {children}
        </div>
    );
};
```

- [ ] **Step 4: Create the barrel** — `src/components/design-system/organism/profile-hero/index.ts`

```ts
export { ProfileHero } from "./profile-hero";
export type { ProfileHeroProps } from "./profile-hero";
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `npx vitest run src/components/design-system/organism/profile-hero/profile-hero.test.tsx`
Expected: PASS (5 tests).

- [ ] **Step 6: Commit**

```bash
git add src/components/design-system/organism/profile-hero
git commit -m "feat(ux): :sparkles: add ProfileHero shell organism"
```

---

## Task 4: About Me box uses `ProfileHero`

**Files:**
- Modify: `src/components/content/about-me/about-me/about-me-table-of-contents/about-me-table-of-contents.tsx`
- Test (unchanged, must stay green): `.../about-me-table-of-contents.test.tsx`

**Interfaces:**
- Consumes: `ProfileHero` (Task 3), `Button`, the existing `useAboutMeTableOfContentsStore` (`scrollToSection`).

- [ ] **Step 1: Refactor the component** — replace the full contents of `about-me-table-of-contents.tsx`

```tsx
"use client";

import { Button } from "@/components/design-system/atoms/buttons/button";
import { ProfileHero } from "@/components/design-system/organism/profile-hero";
import { siteMetadata } from "@/types/configuration/site-metadata";
import { useAboutMeTableOfContentsStore } from "./use-about-me-table-of-contents-store";

const sections = [
    { id: "biography", label: "Biography" },
    { id: "technologies", label: "Technologies" },
    { id: "experience", label: "Experience" },
    { id: "open-source", label: "Open Source" },
];

export const AboutMeTableOfContents = () => {
    const { effects } = useAboutMeTableOfContentsStore();

    return (
        <ProfileHero
            name={siteMetadata.author}
            role="Software Engineer"
        >
            <div className="mt-6 flex flex-col md:flex-row md:flex-wrap items-center justify-center gap-2">
                {sections.map((section) => (
                    <Button
                        key={section.id}
                        onClick={effects.scrollToSection(section.id)}
                        aria-label={`Jump to ${section.label} section`}
                        className="text-primary-text w-full md:w-auto justify-center"
                    >
                        {section.label}
                    </Button>
                ))}
            </div>
        </ProfileHero>
    );
};
```

Note: About Me is the owner's page and does not hold an `Author` record — it passes no `imageSrc`, so `ProfilePhoto` uses its default (Fabrizio's photo). The name comes from `siteMetadata.author`.

- [ ] **Step 2: Run the existing About Me box test to verify no regression**

Run: `npx vitest run src/components/content/about-me/about-me/about-me-table-of-contents/about-me-table-of-contents.test.tsx`
Expected: PASS — still renders "Fabrizio Duroni", "Software Engineer", and all 4 "Jump to … section" buttons.

- [ ] **Step 3: Commit**

```bash
git add src/components/content/about-me/about-me/about-me-table-of-contents/about-me-table-of-contents.tsx
git commit -m "refactor(ux): :recycle: About Me box uses ProfileHero shell"
```

---

## Task 5: `AuthorSocials` sub-component

**Files:**
- Create: `src/components/content/blog/blog-author/author-socials/author-socials.tsx`
- Create: `src/components/content/blog/blog-author/author-socials/index.ts`
- Create (test): `src/components/content/blog/blog-author/author-socials/author-socials.test.tsx`

**Interfaces:**
- Consumes: `ExternalLink`, `Author` type, react-icons (`BiLogoLinkedin`, `BiLogoGithub`, `BiGlobe` from `react-icons/bi`; `FaXTwitter` from `react-icons/fa6`).
- Produces: `AuthorSocials: FC<{ author: Author }>` — always renders a LinkedIn `ExternalLink`; renders GitHub / X / Website links only when `githubUrl` / `xUrl` / `siteUrl` are present. Each link opens in a new tab (`target="_blank" rel="noopener noreferrer"`).

- [ ] **Step 1: Write the failing test** — `author-socials.test.tsx`

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { AuthorSocials } from "./author-socials";
import type { Author } from "@/types/content/author";

const base: Author = {
    id: "alessandro_romano",
    name: "Alessandro Romano",
    linkedinUrl: "https://www.linkedin.com/in/alessandroromano92/",
    image: "/media/authors/alessandro-romano.jpg",
    imageLarge: "/media/authors/alessandro-romano-large.jpg",
};

describe("AuthorSocials", () => {
    describe("render", () => {
        it("always renders the LinkedIn link", () => {
            render(<AuthorSocials author={base} />);
            const link = screen.getByRole("link", { name: /linkedin/i });
            expect(link).toHaveAttribute("href", base.linkedinUrl);
            expect(link).toHaveAttribute("target", "_blank");
            expect(link).toHaveAttribute("rel", "noopener noreferrer");
        });

        it("hides GitHub, X and Website when those fields are absent", () => {
            render(<AuthorSocials author={base} />);
            expect(screen.queryByRole("link", { name: /github/i })).not.toBeInTheDocument();
            expect(screen.queryByRole("link", { name: /^x$/i })).not.toBeInTheDocument();
            expect(screen.queryByRole("link", { name: /website/i })).not.toBeInTheDocument();
        });

        it("renders GitHub, X and Website links when present", () => {
            render(
                <AuthorSocials
                    author={{
                        ...base,
                        githubUrl: "https://github.com/aleromano",
                        xUrl: "https://x.com/aleromano",
                        siteUrl: "https://aleromano.dev",
                    }}
                />,
            );
            expect(screen.getByRole("link", { name: /github/i })).toHaveAttribute("href", "https://github.com/aleromano");
            expect(screen.getByRole("link", { name: /^x$/i })).toHaveAttribute("href", "https://x.com/aleromano");
            expect(screen.getByRole("link", { name: /website/i })).toHaveAttribute("href", "https://aleromano.dev");
        });
    });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/components/content/blog/blog-author/author-socials/author-socials.test.tsx`
Expected: FAIL — cannot resolve `./author-socials`.

- [ ] **Step 3: Create the component** — `author-socials.tsx`

```tsx
import { ExternalLink } from "@/components/design-system/atoms/links/external-link";
import { Author } from "@/types/content/author";
import { FC } from "react";
import { BiGlobe, BiLogoGithub, BiLogoLinkedin } from "react-icons/bi";
import { FaXTwitter } from "react-icons/fa6";

const linkClassName = "glow-container inline-flex items-center gap-2 px-4 py-2 no-underline hover:no-underline";

export interface AuthorSocialsProps {
    author: Author;
}

export const AuthorSocials: FC<AuthorSocialsProps> = ({ author }) => (
    <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
        <ExternalLink
            className={linkClassName}
            href={author.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
        >
            <BiLogoLinkedin size={20} />
            <span>LinkedIn</span>
        </ExternalLink>
        {author.githubUrl && (
            <ExternalLink
                className={linkClassName}
                href={author.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
            >
                <BiLogoGithub size={20} />
                <span>GitHub</span>
            </ExternalLink>
        )}
        {author.xUrl && (
            <ExternalLink
                className={linkClassName}
                href={author.xUrl}
                target="_blank"
                rel="noopener noreferrer"
            >
                <FaXTwitter size={18} />
                <span>X</span>
            </ExternalLink>
        )}
        {author.siteUrl && (
            <ExternalLink
                className={linkClassName}
                href={author.siteUrl}
                target="_blank"
                rel="noopener noreferrer"
            >
                <BiGlobe size={20} />
                <span>Website</span>
            </ExternalLink>
        )}
    </div>
);
```

- [ ] **Step 4: Create the barrel** — `index.ts`

```ts
export { AuthorSocials } from "./author-socials";
export type { AuthorSocialsProps } from "./author-socials";
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `npx vitest run src/components/content/blog/blog-author/author-socials/author-socials.test.tsx`
Expected: PASS (3 tests).

- [ ] **Step 6: Commit**

```bash
git add src/components/content/blog/blog-author/author-socials
git commit -m "feat(ux): :sparkles: per-author socials row (present fields only)"
```

---

## Task 6: Author detail page uses `ProfileHero`

**Files:**
- Modify: `src/components/content/blog/blog-author/blog-author.tsx`
- Modify (test): `src/components/content/blog/blog-author/blog-author.test.tsx`

**Interfaces:**
- Consumes: `ProfileHero` (Task 3), `Chip` (Task 1), `AuthorSocials` (Task 5), existing `PageTitle`, `ContentPage`, `JsonLd`, `PostsRow`, `groupArrayBy`.
- Depends on the `imageLarge` prerequisite (uses `author.imageLarge`).

- [ ] **Step 1: Update the test fixture + add coverage** — in `blog-author.test.tsx`:
  1. add `imageLarge` to `baseAuthor`;
  2. add a post-count-chip test and a GitHub-when-present test.

Replace the `baseAuthor` declaration with:

```tsx
const baseAuthor: Author = {
    id: "fabrizio_duroni",
    name: "Fabrizio Duroni",
    linkedinUrl: "https://www.linkedin.com/in/fabrizio-duroni/",
    image: "/media/authors/fabrizio-duroni-small.jpg",
    imageLarge: "/media/authors/fabrizio-duroni.jpg",
};
```

Add these two tests inside the `describe("render", ...)` block:

```tsx
        it("renders a post-count chip", () => {
            render(<BlogAuthor author={baseAuthor} posts={[makePost("post-a"), makePost("post-b")]} />);
            expect(screen.getByText("2 posts published")).toBeInTheDocument();
        });

        it("renders a GitHub link when githubUrl is present", () => {
            const author: Author = { ...baseAuthor, githubUrl: "https://github.com/chicio" };
            render(<BlogAuthor author={author} posts={[makePost("post-a")]} />);
            expect(screen.getByRole("link", { name: /github/i })).toHaveAttribute("href", "https://github.com/chicio");
        });
```

- [ ] **Step 2: Run the test to verify the new cases fail**

Run: `npx vitest run src/components/content/blog/blog-author/blog-author.test.tsx`
Expected: FAIL — "2 posts published" and the GitHub link are not rendered yet.

- [ ] **Step 3: Refactor the component** — replace the full contents of `blog-author.tsx`

```tsx
import { PageTitle } from "@/components/design-system/molecules/typography/page-title";
import { ProfileHero } from "@/components/design-system/organism/profile-hero";
import { Chip } from "@/components/design-system/atoms/chip";
import { ContentPage } from "@/components/features/content/content-page";
import { JsonLd } from "@/components/features/seo/jsond-ld";
import { PostsRow } from "@/components/content/blog/posts-row";
import { AuthorSocials } from "./author-socials";
import { groupArrayBy } from "@/lib/content/posts/posts";
import { Author } from "@/types/content/author";
import { Content } from "@/types/content/content";
import { siteMetadata } from "@/types/configuration/site-metadata";
import { tracking } from "@/types/configuration/tracking";
import { FC } from "react";

export interface BlogAuthorProps {
    author: Author;
    posts: Content[];
}

export const BlogAuthor: FC<BlogAuthorProps> = ({ author, posts }) => {
    const postsGrouped = groupArrayBy(posts, 2);

    return (
        <>
            <ContentPage
                author={siteMetadata.author}
                trackingCategory={tracking.category.blog_author}
            >
                <ProfileHero
                    name={author.name}
                    role={author.role}
                    imageSrc={author.imageLarge}
                    imageAlt={author.name}
                >
                    {author.bio && <p className="mx-auto mt-4 max-w-2xl text-center">{author.bio}</p>}
                    <AuthorSocials author={author} />
                    <div className="mt-4 flex justify-center">
                        <Chip>{`${posts.length} ${posts.length === 1 ? "post" : "posts"} published`}</Chip>
                    </div>
                </ProfileHero>
                <PageTitle>{`Posts published (${posts.length})`}</PageTitle>
                {postsGrouped.map((postsGroup, index) => (
                    <PostsRow
                        postsGroup={postsGroup}
                        key={`PostCardsRow${index}`}
                    />
                ))}
            </ContentPage>
            <JsonLd
                type="Blog"
                url={siteMetadata.siteUrl}
                imageUrl={siteMetadata.featuredImage}
                title={siteMetadata.title}
                keywords={[author.name]}
            />
        </>
    );
};
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run src/components/content/blog/blog-author/blog-author.test.tsx`
Expected: PASS — all existing tests plus the two new ones (name, avatar, role, bio, LinkedIn, GitHub-when-present, post-count chip, posts-published heading, post cards).

- [ ] **Step 5: Commit**

```bash
git add src/components/content/blog/blog-author/blog-author.tsx src/components/content/blog/blog-author/blog-author.test.tsx
git commit -m "feat(ux): :sparkles: author detail page uses ProfileHero box"
```

---

## Task 7: Author card — glass treatment + `Chip` + `imageLarge`

**Files:**
- Modify: `src/components/content/blog/blog-authors/author-card/author-card.tsx`
- Modify (test): `src/components/content/blog/blog-authors/author-card/author-card.test.tsx`

**Interfaces:**
- Consumes: `Chip` (Task 1), `useGlassmorphism`, existing `useAuthorCardStore` (`isInView`, `setEl`, `onClickAuthor`), `ImageGlow`, `InternalLink`, `authorHref`.
- Depends on the `imageLarge` prerequisite (uses `author.imageLarge`).

- [ ] **Step 1: Update the test fixture + add a glass-class assertion** — in `author-card.test.tsx`:
  1. add `imageLarge` to the `author` fixture;
  2. add a test that the card link carries the glass class.

Replace the `author` declaration with:

```tsx
const author: Author = {
    id: "fabrizio_duroni",
    name: "Fabrizio Duroni",
    linkedinUrl: "https://www.linkedin.com/in/fabrizio-duroni/",
    image: "/media/authors/fabrizio-duroni-small.jpg",
    imageLarge: "/media/authors/fabrizio-duroni.jpg",
};
```

Add this test inside the `describe("render", ...)` block:

```tsx
        it("applies the glassmorphism treatment to the card link", () => {
            render(<AuthorCard author={author} postCount={1} />);
            expect(screen.getByRole("link").className).toMatch(/glassmorphism/);
        });
```

- [ ] **Step 2: Run the test to verify the new case fails**

Run: `npx vitest run src/components/content/blog/blog-authors/author-card/author-card.test.tsx`
Expected: FAIL — the card link has `glow-container`, not a `glassmorphism*` class yet.

- [ ] **Step 3: Refactor the component** — replace the full contents of `author-card.tsx`

```tsx
"use client";

import { ImageGlow } from "@/components/design-system/atoms/effects/image-glow";
import { InternalLink } from "@/components/design-system/atoms/links/internal-link";
import { Chip } from "@/components/design-system/atoms/chip";
import { useGlassmorphism } from "@/components/design-system/hooks/use-glassmorphism";
import { Author } from "@/types/content/author";
import { authorHref } from "@/lib/content/authors/author-slug";
import { FC } from "react";
import { useAuthorCardStore } from "./use-author-card-store";

export interface AuthorCardProps {
    author: Author;
    postCount: number;
}

export const AuthorCard: FC<AuthorCardProps> = ({ author, postCount }) => {
    const { glassmorphismClass } = useGlassmorphism();
    const { state, effects } = useAuthorCardStore();
    const { isInView } = state;
    const { setEl, onClickAuthor } = effects;
    const href = authorHref(author.id);

    return (
        <div
            ref={setEl}
            className="flex min-h-[220px]"
        >
            {isInView && (
                <InternalLink
                    className={`${glassmorphismClass} flex h-full w-full flex-col items-center gap-2 p-6 text-center no-underline hover:no-underline`}
                    to={href}
                    onClick={onClickAuthor}
                >
                    <ImageGlow
                        className="rounded-full"
                        alt={author.name}
                        src={author.imageLarge}
                        width={96}
                        height={96}
                        noPlaceholder={true}
                    />
                    <h3 className="mt-2! mb-0!">{author.name}</h3>
                    {author.role && <p className="text-secondary-text mt-0!">{author.role}</p>}
                    <Chip className="mt-1">{`${postCount} ${postCount === 1 ? "post" : "posts"}`}</Chip>
                </InternalLink>
            )}
        </div>
    );
};
```

Note: the card name stays a default `<h3>` — it inherits the site sans font (Open Sans); no mono class is added.

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run src/components/content/blog/blog-authors/author-card/author-card.test.tsx`
Expected: PASS — name, avatar, "3 posts"/"1 post" chip, role present/absent, owner→/about-me link, non-owner→slug link, tracking on click, glass class.

- [ ] **Step 5: Commit**

```bash
git add src/components/content/blog/blog-authors/author-card/author-card.tsx src/components/content/blog/blog-authors/author-card/author-card.test.tsx
git commit -m "feat(ux): :sparkles: catchier glass author cards with Chip post count"
```

---

## Task 8: Full verification + live QA

**Files:** none (verification only).

- [ ] **Step 1: Run the full local gate suite**

```bash
npm run lint
npm run validate-architecture
npm run knip
npm run typecheck
npm run test:run
npm run build
```

Expected: all green. (Reminder: `typecheck`/`build` require the `imageLarge`-required prerequisite to be in the tree.)

- [ ] **Step 2: Live QA with the dev server + agent-browser**

Start the dev server, accept cookies (`localStorage.setItem('cookieConsent','accepted')`), then visually verify:
- `/blog/authors` — cards show the glass treatment (frosted border, hover lift) with a `Chip` post count.
- a sparse author detail page (e.g. `/blog/author/francesco-bonfadelli`) — glass hero with photo, name, LinkedIn, and a "N posts published" chip; no empty role/bio gaps.
- `/about-me` — the top box is unchanged in content (name, "Software Engineer", 4 jump pills) and visually consistent with the author box.

```bash
npm run dev
# in another shell / via agent-browser:
npx agent-browser open http://localhost:3000/blog/authors
npx agent-browser snapshot -i
```

- [ ] **Step 3: Final commit (only if any verification fix was needed)**

```bash
git add -A
git commit -m "test(ux): :white_check_mark: verify author pages redesign"
```

---

## Self-Review notes

- **Spec coverage:** card Direction A (Task 7), `Chip` reuse from `Tag` (Task 1), `ProfilePhoto` src (Task 2), `ProfileHero` shell (Task 3), About Me box shares shell + keeps pills (Task 4), author detail bio→socials→count with graceful degradation (Tasks 5–6), no new tracking (AuthorSocials has no hook), `imageLarge` used directly (Tasks 6–7), tests per component, verification gate (Task 8). All spec sections map to a task.
- **Prerequisite:** `Author.imageLarge` required + populated is the site author's separate change; Tasks 6/7 typecheck/build depend on it.
- **Type consistency:** `Chip` props, `ProfileHero` props, and `AuthorSocials` props are referenced identically across tasks; `ProfilePhoto` gains `src?: string` used by `ProfileHero`'s `imageSrc`.
