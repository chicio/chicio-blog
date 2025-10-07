import { StandardExternalLinkWithTracking } from "@/components/design-system/atoms/links/standard-external-link-with-tracking";
import { PageTitle } from "@/components/design-system/molecules/typography/page-title";
import { ContentPageTemplate } from "@/components/design-system/templates/content-page-template";
import { createMetadata } from "@/lib/seo/seo";
import { siteMetadata } from "@/types/site-metadata";
import { slugs } from "@/types/slug";
import { tracking } from "@/types/tracking";

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
    <ContentPageTemplate
      author={author}
      trackingCategory={tracking.category.cookie_policy}
    >
      <PageTitle>Cookies Policy</PageTitle>
      <p>
        {`Last updated: (20th November 2017) Fabrizio Duroni uses cookies on "Fabrizio Duroni" (the "Service"). 
        By using the Service, you consent to the use of cookies. My Cookies Policy explains what cookies are, how 
        I use cookies, how third­parties I may partner with may use cookies on the Service, 
        your choices regarding cookies and further information about cookies`}
      </p>
      <div className="container-section">
        <h4>What are cookies</h4>
        <p>
          {`Cookies are small pieces of text sent by your web browser by a website
        you visit. A cookie file is stored in your web browser and allows the
        Service or a third­party to recognize you and make your next visit
        easier and the Service more useful to you. Cookies can be "persistent"
        or "session" cookies.`}
        </p>
      </div>
      <div className="container-section">
        <h4>
          <strong>{`How "Fabrizio Duroni" uses cookies`}</strong>
        </h4>
        <p>
          {`When you use and access the Service, I may place a number of cookies
        files in your web browser. I use cookies for the following purposes: to
        enable certain functions of the Service, to provide analytics, to store
        your preferences, to enable advertisements delivery, including
        behavioral advertising. I use both session and persistent cookies on the
        Service and I use different types of cookies to run the Service:`}
        </p>
        <ul>
          <li>
            Essential cookies. I may use essential cookies to authenticate users
            and prevent fraudulent use of user accounts.
          </li>
          <li>
            Advertising cookies. I may use essential cookies to deliver to the
            users advertisement.
          </li>
        </ul>
      </div>
      <div className="container-section">
        <h4>Third party cookies</h4>
        <p>
          In addition to our own cookies, I may also use various third parties
          cookies to report usage statistics of the Service, deliver
          advertisements on and through the Service, and so on.
        </p>
      </div>
      <div className="container-section">
        <h4>
          <strong>What are your choices regarding cookies</strong>
        </h4>
        <p>
          {`If you'd like to delete cookies or instruct your web browser to delete
        or refuse cookies, please visit the help pages of your web browser.
        Please note, however, that if you delete cookies or refuse to accept
        them, you might not be able to use all of the features I offer, you may
        not be able to store your preferences, and some of my pages might not
        display properly.`}
        </p>
      </div>
      <div className="container-section">
        <h4>Where can your find more information about cookies</h4>
        <p>You can learn more about cookies :</p>
        <ul>
          <li>
            Cookies:
            <StandardExternalLinkWithTracking
              href="https://en.wikipedia.org/wiki/HTTP_cookie"
              trackingData={{
                category: tracking.category.cookie_policy,
                action: tracking.action.open_http_cookie_policy,
                label: tracking.label.body,
              }}
              className="mx-2"
            >
              https://en.wikipedia.org/wiki/HTTP_cookie
            </StandardExternalLinkWithTracking>
          </li>
        </ul>
      </div>
    </ContentPageTemplate>
  );
}
