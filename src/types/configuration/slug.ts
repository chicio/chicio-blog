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
    roadmap: `${dsa}/roadmap`,
    timeAndSpaceComplexity: `${dsa}/time-and-space-complexity`,
    array: `${dsa}/array`,
    string: `${dsa}/string`,
    bitManipulation: `${dsa}/bit-manipulation`,
    hashTable: `${dsa}/hashtable`,
    twoPointers: `${dsa}/two-pointers`,
    prefixSum: `${dsa}/prefix-sum`,
    slidingWindow: `${dsa}/sliding-window`,
    kadaneAlgorithm: `${dsa}/kadane-algorithm`,
    matrix: `${dsa}/matrix`,
    linkedList: `${dsa}/linked-list`,
    stack: `${dsa}/stack`,
  }
};
