import { CallToActionExternalWithTracking } from "chicio-blog";

export const Default = () => (
    <div className="flex">
        <CallToActionExternalWithTracking
            href="https://github.com/chicio/matrix-rain-webgpu"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {}}
        >
            Github
        </CallToActionExternalWithTracking>
    </div>
);

export const LongLabel = () => (
    <div className="flex">
        <CallToActionExternalWithTracking
            href="https://www.npmjs.com/package/react-native-skia-skeleton"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {}}
        >
            Read the documentation
        </CallToActionExternalWithTracking>
    </div>
);

export const ProjectActions = () => (
    <div className="flex flex-wrap gap-4">
        <CallToActionExternalWithTracking
            href="https://github.com/chicio/react-native-skia-skeleton"
            target="_blank"
            rel="noopener noreferrer"
        >
            Github
        </CallToActionExternalWithTracking>
        <CallToActionExternalWithTracking
            href="https://www.npmjs.com/package/react-native-skia-skeleton"
            target="_blank"
            rel="noopener noreferrer"
        >
            NPM
        </CallToActionExternalWithTracking>
    </div>
);
