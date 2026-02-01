import { Contact } from "@/components/sections/contact/components/contact";
import { createMetadata } from "@/lib/seo/seo";
import { siteMetadata } from "@/types/configuration/site-metadata";
import { slugs } from "@/types/configuration/slug";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
    return createMetadata({
        author: siteMetadata.author,
        title: `Contact Me | ${siteMetadata.title}`,
        description: "Send me a message. Fill out the form to contact me directly.",
        slug: slugs.contact,
        imageUrl: siteMetadata.featuredImage,
        ogPageType: "website",
    });
}

export default async function ContactPage() {
    return <Contact />;
}
