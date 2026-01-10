export const siteMetadata = {
    title:
        "Fabrizio Duroni | Chicio Coding",
    description: "Official blog chicio coding. Property of Fabrizio Duroni. Main skills: mobile application development, computer graphics, web development.",
    siteUrl: "https://www.fabrizioduroni.it",
    featuredImage: "/chicio-coding-feature-graphic.jpg",
    featuredArtImage: "/chicio-art-featured.png",
    author: "Fabrizio Duroni",
    contacts: {
        email: "fabrizio.duroni@gmail.com",
        links: {
            twitter: "https://twitter.com/chicio86",
            facebook: "https://www.facebook.com/fabrizio.duroni",
            linkedin: "https://www.linkedin.com/in/fabrizio-duroni/",
            github: "https://github.com/chicio",
            medium: "https://medium.com/@chicio",
            devto: "https://dev.to/chicio",
            instagram: "https://www.instagram.com/__chicio__/",
        },
    },
}

export type SiteMetadataSocialLinks = {
    twitter: string,
    facebook: string,
    linkedin: string,
    github: string,
    medium: string,
    devto: string,
    instagram: string,
}

export type SiteMetadata = {
    title: string,
    siteUrl: string,
    featuredImage: string,
    featuredArtImage: string,
    author: string,
    contacts: {
        email: string,
        phone: string,
        links: SiteMetadataSocialLinks,
    },
};
