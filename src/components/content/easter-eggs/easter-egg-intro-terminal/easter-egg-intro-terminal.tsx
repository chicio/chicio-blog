"use client";

import { FC } from "react";
import { MatrixTerminal } from "@/components/design-system/molecules/effects/matrix-terminal";
import { easterEggHuntIntroLines } from "@/lib/content/easter-eggs/easter-eggs-content";

const terminalLines = easterEggHuntIntroLines.map((text) => ({ text }));

export const EasterEggIntroTerminal: FC = () => (
    <div className="mt-8">
        <MatrixTerminal lines={terminalLines} widthClassName="w-full" />
    </div>
);
