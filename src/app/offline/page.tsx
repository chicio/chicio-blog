"use client";

import { MatrixRain } from "@/components/design-system/atoms/effects/matrix-rain/matrix-rain";
import { MatrixTerminal } from "@/components/design-system/molecules/effects/matrix-terminal";
import { BluePillLink } from "@/components/design-system/molecules/links/pills-links";
import { RedPillButton } from "@/components/design-system/molecules/buttons/pills-buttons";
import { tracking } from "@/types/configuration/tracking";

const terminalLines = [
    { text: "Connecting to Matrix...", delay: 600 },
    { text: "PING 8.8.8.8 ... Request timeout", type: "error" as const, delay: 700 },
    { text: "PING fabrizioduroni.it ... Unreachable", type: "error" as const, delay: 900 },
    { text: "You are disconnected from the Matrix.", type: "quote" as const, delay: 1200 },
];

export default function OfflinePage() {
    return (
        <div className="container-fullscreen text-accent-color relative min-h-screen overflow-hidden bg-black">
            <MatrixRain fontSize={14} density={0.975} />
            <div className="relative z-10 flex flex-col items-center justify-center gap-2 p-2">
                <h1 className="heading animate-glitch text-accent text-[72px] font-bold sm:text-[100px]">
                    OFFLINE
                </h1>
                <MatrixTerminal lines={terminalLines} />
                <div className="flex flex-row gap-4 mt-3">
                    <BluePillLink
                        to="/"
                        trackingData={{
                            category: tracking.category.pwa,
                            label: tracking.label.body,
                            action: tracking.action.blue_pill,
                        }}
                    >
                        Stay cached
                    </BluePillLink>
                    <RedPillButton onClick={() => window.location.reload()}>
                        Try again
                    </RedPillButton>
                </div>
            </div>
        </div>
    );
}
