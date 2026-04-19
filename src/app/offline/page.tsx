"use client";

import { RedPillButton } from "@/components/design-system/molecules/buttons/pills-buttons";
import { MatrixBackground } from "@/components/design-system/molecules/effects/matrix-background";
import { TerminalLine, SuccessText, Cursor } from "@/components/design-system/atoms/typography/terminal-blocks";

const lines = [
    { text: "INITIALIZING CONNECTION..." },
    { text: "PING 8.8.8.8 ... REQUEST TIMEOUT" },
    { text: "PING fabrizioduroni.it ... UNREACHABLE" },
    { text: "STATUS: CONNECTION_LOST" },
];

export default function OfflinePage() {
    return (
        <MatrixBackground fontSize={14} density={0.97}>
            <div className="flex flex-col items-center justify-center gap-8 px-6 text-center">
                <div className="flex flex-col gap-1 rounded-md border border-matrix-primary/30 bg-black/60 p-8 backdrop-blur-sm">
                    {lines.map(({ text }) => (
                        <TerminalLine key={text}>
                            <SuccessText>{`> ${text}`}</SuccessText>
                        </TerminalLine>
                    ))}
                    <TerminalLine>
                        <SuccessText>{`> `}</SuccessText>
                        <Cursor />
                    </TerminalLine>
                    <div className="mt-4 border-t border-matrix-primary/20 pt-4">
                        <TerminalLine>
                            <span className="text-matrix-green/70">
                                You are disconnected from the Matrix.
                            </span>
                        </TerminalLine>
                        <TerminalLine>
                            <span className="text-matrix-green/50">
                                Check your connection and try again.
                            </span>
                        </TerminalLine>
                    </div>
                </div>
                <RedPillButton onClick={() => window.location.reload()}>
                    Try Again
                </RedPillButton>
            </div>
        </MatrixBackground>
    );
}
