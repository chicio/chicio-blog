# Website

Fabrizio Duroni's personal site: the content he publishes and the interactive, Matrix-flavoured layer that surrounds it.

## Language

### Content

**Section**:
A named area of the site as a reader knows it (the Blog, the DSA course, Videogames, Art), made of Collections and
Standalone Pages.
_Avoid_: using it for a block inside a page, or for the ingestion unit in code

**Collection**:
Many pieces of content of one kind, each at its own path under a shared route shape (posts, consoles, games, DSA
exercises).

**Standalone Page**:
A single piece of content at exactly one path (about me, cookie policy).
_Avoid_: Page, which is ambiguous with Content Page

**Post**:
One dated entry in the Blog, technical or personal.
_Avoid_: Article, blog post

**Tag**:
A free-form label on a Post; every Tag in use gets its own listing page.
_Avoid_: category

**Author**:
A person from the site's fixed roster of writers; a Post can have several.
_Avoid_: writer, contributor

**Topic**:
One lesson of the DSA course.
_Avoid_: Article, post

**Exercise**:
A single problem of the DSA course, solved and explained.
_Avoid_: Problem, article

**Console**:
A piece of videogame hardware Fabrizio owns, with its own page and the Games played on it.

**Game**:
A videogame Fabrizio owns, always belonging to exactly one Console.

**Format**:
Whether a Game is owned as a physical copy or a digital one.

**Manga**:
A manga series Fabrizio collects, with its own page, whichever of its Volumes he owns.
_Avoid_: title, book, using it for a single Volume

**Volume**:
One physical book of a Manga; a Manga is complete when every Volume of its edition is owned.
_Avoid_: tankobon, issue

**Startup**:
The part of a Console page that describes and shows the Console's boot sequence.
_Avoid_: calling it a Section

**Read Next**:
The two other Posts sharing the most Tags with the one just read, suggested at its end.
_Avoid_: related posts

**Roadmap**:
The overview of the DSA course that orders its Topics.

**Clowns**:
The joke Section of clown photos and videos, a nod to the "full-clown developer" running gag.

### Chat

**Chat**:
The page where a visitor talks to an assistant that answers on Fabrizio's behalf, grounded in the Knowledge Base.
_Avoid_: Oracle (UI copy only), bot, assistant

**Knowledge Base**:
The Posts, chunked, that the Chat can retrieve to ground its answers; only Posts explicitly uploaded are in it, and
nothing from the DSA course, Videogames or other Sections is.
_Avoid_: index, vector store, RAG

**Guardrail**:
A check that decides whether a visitor's message may reach the Chat at all, and answers with a refusal when it may not.
_Avoid_: filter, moderation

### Agent-facing

**Markdown Representation**:
The Markdown version of a page, returned instead of HTML to a client that asks for Markdown.
_Avoid_: markdown version, markdown page, markdown content

### Site architecture

**Content Registry**:
The single description of every Collection and Standalone Page, from which the Markdown Representation, site search,
the sitemap and the agent-facing site index are derived.

**Template**:
A layout that receives everything it shows, including navigation and tracking, from its caller.

**Content Page**:
A Template bound to this site's navigation, footer and tracking.

**Reading Page**:
A Content Page for long-form reading.

**Terminal**:
The full-screen shell overlay that lets a visitor move through the site as a filesystem.
_Avoid_: using it for terminal-styled components, which are design-system chrome

### Easter eggs

**Easter Egg**:
A hidden experience in the site, reached only through a Trigger.

**Trigger**:
The secret action that fires an Easter Egg.

**Found**:
An Easter Egg the visitor has fired through its Trigger, remembered per browser.
_Avoid_: counting a Reveal as found

**Reveal**:
Playing an Easter Egg from the Hunt without triggering it; it never makes the egg Found.

**Hunt**:
The page that lists every Easter Egg with its Hints and Reveals.

**Hint**:
A clue on the Hunt that points toward a Trigger.
