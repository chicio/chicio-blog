import {FC} from "react";
import {ContainerFullscreen} from "@/components/design-system/atoms/container-fullscreen";
import {Heading1} from "@/components/design-system/atoms/heading1";
import {Paragraph} from "@/components/design-system/atoms/paragraph";
import {CallToActionInternalWithTracking} from "@/components/design-system/atoms/call-to-action-internal-with-tracking";
import {tracking} from "@/types/tracking";

const NotFoundPage: FC = () => {
    return (
        <ContainerFullscreen>
            <Heading1>404!</Heading1>
            <Paragraph>Opss!?! Keep calm and go to</Paragraph>
            <CallToActionInternalWithTracking
                to={"/"}
                trackingData={{
                    action: tracking.action.open_home,
                    category: tracking.category.notfound,
                    label: tracking.label.body,
                }}
            >
                Homepage
            </CallToActionInternalWithTracking>
        </ContainerFullscreen>
    );
};

export default NotFoundPage;
