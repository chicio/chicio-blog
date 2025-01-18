import {siteMetadata} from "@/types/site-metadata";
import {ShowcasePageTemplate} from "@/components/templates/showcase-page-template";
import {ProfilePresentation} from "@/components/design-system/organism/profile-presentation";
import {tracking} from "@/types/tracking";
import {Technologies} from "@/components/design-system/organism/technologies";
import {Resume} from "@/components/design-system/organism/resume";
import {createMetadata} from "@/lib/seo";
import {slugs} from "@/types/slug";
import {JsonLd} from "@/components/website/jsond-ld";

export const metadata = createMetadata({
    author: siteMetadata.author,
    title: siteMetadata.title,
    url: `${siteMetadata.siteUrl}${slugs.blog}`,
    imageUrl: siteMetadata.featuredImage,
    ogPageType: 'website',
})

export default function Home() {
    return (
        <>
            <ShowcasePageTemplate
                fullScreenComponent={<ProfilePresentation author={siteMetadata.author}/>}
                trackingCategory={tracking.category.home}
            >
                <Technologies author={siteMetadata.author}/>
                <Resume/>
            </ShowcasePageTemplate>
            <JsonLd ogPageType="website" url={siteMetadata.siteUrl} imageUrl={siteMetadata.featuredImage}
                    title={siteMetadata.title}/>
        </>
    );
}
