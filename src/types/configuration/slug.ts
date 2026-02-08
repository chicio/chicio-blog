const blog = '/blog'
const blogPost = `${blog}/post`;
const dsa = `/data-structures-and-algorithms`;
const videogames = '/videogames';

export const slugs = {
  aboutMe: `/about-me`,
  blog: {
    home: blog,
    blogPostsPage: `${blog}/posts`,
    blogPost,
    tags: `${blog}/tags`,
    tag: `${blog}/tag`,
    blogArchive: `${blog}/archive`,
  },
  art: "/art",
  chat: "/chat",
  contact: "/contact",
  cookiePolicy: "/cookie-policy",
  dataStructuresAndAlgorithms: {
    roadmap: `${dsa}/roadmap`,
    topic: `${dsa}/topic`,
  },
  videogames: {
    timeline: `${videogames}/timeline`,
    console: `${videogames}/console`,
    game: `${videogames}/game`,
  }
};
