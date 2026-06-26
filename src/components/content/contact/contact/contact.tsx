import { ContentPage } from "@/components/features/content/content-page";
import { siteMetadata } from "@/types/configuration/site-metadata";
import { tracking } from "@/types/configuration/tracking";
import { ContactForm } from "./contact-form";

export const Contact = () => {
    return (
        <ContentPage author={siteMetadata.author} trackingCategory={tracking.category.contact}>
            <ContactForm trackingCategory={tracking.category.contact} />
        </ContentPage>
    );
};
