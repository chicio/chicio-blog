import { SelfHostedVideo } from "chicio-blog";

const appJsConfTalk = "/media/content/blog/post/2026/06/01/app-js-conf-2026/app-js-conf-2026-william-1.mp4";
const kungFu = "/media/video/i-know-kung-fu.mp4";

export const Default = () => (
    <div className="max-w-2xl">
        <SelfHostedVideo src={appJsConfTalk} />
    </div>
);

export const WithCaption = () => (
    <div className="max-w-2xl">
        <SelfHostedVideo src={appJsConfTalk} caption="William Candillon on stage at App.js Conf 2026" />
    </div>
);

export const CustomSizing = () => (
    <div className="max-w-md">
        <SelfHostedVideo
            src={kungFu}
            ariaLabel="I know kung fu"
            className="border-accent-alpha-40 aspect-video w-full overflow-hidden rounded-xl border border-solid shadow-lg"
        />
    </div>
);
