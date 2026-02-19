const blog = '/blog'
const videogames = '/videogames';
const dsa = `/data-structures-and-algorithms`;

export const slugs = {
  aboutMe: `/about-me`,
  blog: {
    home: blog,
    blogPostsPage: `${blog}/posts`,
    blogPost: `${blog}/post/[year]/[month]/[day]/[slug]`,
    tags: `${blog}/tags`,
    tag: `${blog}/tag`,
    blogArchive: `${blog}/archive`,
  },
  art: "/art",
  chat: "/chat",
  contact: "/contact",
  cookiePolicy: "/cookie-policy",
  dataStructuresAndAlgorithms: {
    home: dsa,
    roadmap: `${dsa}/roadmap`,
    topic: `${dsa}/topic/[topic]`,
  },
  videogames: {
    home: videogames,
    console: `${videogames}/console/[console]`,
    game: `${videogames}/console/[console]/game/[game]`,
  }
};
