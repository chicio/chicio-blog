const blog = '/blog'
const blogPost = `${blog}/post`;
const dsa = `/data-structures-and-algorithms`;



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
  cookiePolicy: "/cookie-policy",
  dsa: {
    timeAndSpaceComplexity: `${dsa}/time-and-space-complexity`,
    roadmap: `${dsa}`,
    arrays: `${dsa}/arrays`,
    strings: `${dsa}/strings`,
    bitManipulation: `${dsa}/bit-manipulation`,
    hashTables: `${dsa}/hashtables`,
    twoPointers: `${dsa}/two-pointers`,
    prefixSum: `${dsa}/prefix-sum`,
    slidingWindow: `${dsa}/sliding-window`,
    kadaneAlgorithm: `${dsa}/kadane-algorithm`,
    matrix: `${dsa}/matrix`,
    linkedList: `${dsa}/linked-list`,
  }
};
