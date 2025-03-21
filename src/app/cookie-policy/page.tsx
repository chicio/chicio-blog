import { siteMetadata } from "@/types/site-metadata";
import { BlogPageTemplate } from "@/components/templates/blog-page-template";
import { tracking } from "@/types/tracking";
import { Heading1 } from "@/components/design-system/atoms/heading1";
import { Paragraph } from "@/components/design-system/atoms/paragraph";
import { ContainerSection } from "@/components/design-system/atoms/container-section";
import { Heading4 } from "@/components/design-system/atoms/heading4";
import { List } from "@/components/design-system/atoms/list";
import { StandardExternalLink } from "@/components/design-system/atoms/standard-external-link";
import { createMetadata } from "@/lib/seo";
import { slugs } from "@/types/slug";

export const metadata = createMetadata({
  author: siteMetadata.author,
  title: siteMetadata.title,
  url: `${siteMetadata.siteUrl}${slugs.cookiePolicy}`,
  imageUrl: siteMetadata.featuredImage,
  ogPageType: "website",
});

export default function CookiePolicy() {
  const author = siteMetadata.author;

  return (
    <BlogPageTemplate
      author={author}
      trackingCategory={tracking.category.cookie_policy}
    >
      <Heading1>Cookies Policy</Heading1>
      <Paragraph>
        {`Last updated: (20th November 2017) Fabrizio Duroni uses cookies on "Fabrizio Duroni" (the "Service"). 
        By using the Service, you consent to the use of cookies. My Cookies Policy explains what cookies are, how 
        I use cookies, how third­parties I may partner with may use cookies on the Service, 
        your choices regarding cookies and further information about cookies`}
      </Paragraph>
      <ContainerSection>
        <Heading4>What are cookies</Heading4>
        <Paragraph>
          {`Cookies are small pieces of text sent by your web browser by a website
        you visit. A cookie file is stored in your web browser and allows the
        Service or a third­party to recognize you and make your next visit
        easier and the Service more useful to you. Cookies can be "persistent"
        or "session" cookies.`}
        </Paragraph>
      </ContainerSection>
      <ContainerSection>
        <Heading4>
          <strong>{`How "Fabrizio Duroni" uses cookies`}</strong>
        </Heading4>
        <Paragraph>
          {`When you use and access the Service, I may place a number of cookies
        files in your web browser. I use cookies for the following purposes: to
        enable certain functions of the Service, to provide analytics, to store
        your preferences, to enable advertisements delivery, including
        behavioral advertising. I use both session and persistent cookies on the
        Service and I use different types of cookies to run the Service:`}
        </Paragraph>
        <List>
          <li>
            Essential cookies. I may use essential cookies to authenticate users
            and prevent fraudulent use of user accounts.
          </li>
          <li>
            Advertising cookies. I may use essential cookies to deliver to the
            users advertisement.
          </li>
        </List>
      </ContainerSection>
      <ContainerSection>
        <Heading4>Third party cookies</Heading4>
        <Paragraph>
          In addition to our own cookies, I may also use various third parties
          cookies to report usage statistics of the Service, deliver
          advertisements on and through the Service, and so on.
        </Paragraph>
      </ContainerSection>
      <ContainerSection>
        <Heading4>
          <strong>What are your choices regarding cookies</strong>
        </Heading4>
        <Paragraph>
          {`If you'd like to delete cookies or instruct your web browser to delete
        or refuse cookies, please visit the help pages of your web browser.
        Please note, however, that if you delete cookies or refuse to accept
        them, you might not be able to use all of the features I offer, you may
        not be able to store your preferences, and some of my pages might not
        display properly.`}
        </Paragraph>
      </ContainerSection>
      <ContainerSection>
        <Heading4>Where can your find more information about cookies</Heading4>
        <Paragraph>
          You can learn more about cookies and the following third party
          websites:
        </Paragraph>
        <List>
          <li>
            Cookies:
            <StandardExternalLink href="https://en.wikipedia.org/wiki/HTTP_cookie">
              https://en.wikipedia.org/wiki/HTTP_cookie
            </StandardExternalLink>
          </li>
          <li>
            Network Advertising Initiative:{" "}
            <StandardExternalLink href="https://www.networkadvertising.org/">
              https://www.networkadvertising.org/
            </StandardExternalLink>
          </li>
        </List>
      </ContainerSection>
    </BlogPageTemplate>
  );
}
