import { ContentPageTemplate } from "@/components/design-system/templates/content-page-template";
import { siteMetadata } from "@/types/configuration/site-metadata";
import { tracking } from "@/types/configuration/tracking";
import { ContactForm } from "./contact-form";

/**
 * Contact section component
 * 
 * Main component for the contact page that wraps the ContactForm
 * with the standard page template.
 * 
 * @author Fabrizio Duroni
 */

export const Contact = () => {
    return (
        <ContentPageTemplate author={siteMetadata.author} trackingCategory={tracking.category.contact}>
            <ContactForm trackingCategory={tracking.category.contact} />
        </ContentPageTemplate>
    );
};
