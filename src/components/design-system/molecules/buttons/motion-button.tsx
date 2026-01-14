"use client";

import { usePathname } from "next/navigation";
import {
    MotionOffIcon,
    MotionOnIcon,
} from "../../atoms/icons/motion-toggle-icon";
import { writeMotion } from "@/lib/motion/motion";
import { useMotionStore } from "../../utils/hooks/use-motion-store";

const MotionButton = () => {
    const motionEnabled = useMotionStore();
    const pathname = usePathname();

    if (pathname.startsWith("/chat")) {
        return null;
    }

    const toggleMotion = () => {
        writeMotion(motionEnabled ? "off" : "on");
    };

    return (
        <div
            aria-label={motionEnabled ? "Enable animation" : "Disable animation"}
            onClick={toggleMotion}
        >
            {motionEnabled ? <MotionOnIcon /> : <MotionOffIcon />}
        </div>
    );
};

export default MotionButton;
