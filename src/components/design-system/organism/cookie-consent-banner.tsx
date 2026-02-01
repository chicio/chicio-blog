"use client";

import { hasConsented, writeConsent } from "@/lib/consents/consents";
import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import {
  BluePillButton,
  RedPillButton,
} from "../molecules/buttons/pills-buttons";
import { useGlassmorphism } from "../utils/hooks/use-glassmorphism";

const CookieConsentBanner = () => {
  const { glassmorphismClass } = useGlassmorphism();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!hasConsented()) {
      setVisible(true);
    }
  }, []);

  const handle = (accepted: "accepted" | "rejected") => {
    writeConsent(accepted);
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <div
          className={`${glassmorphismClass} backdrop-blur-2xl! fixed right-0 bottom-5 left-0 mx-auto my-0 p-4 flex max-w-[95%] flex-col items-center gap-4 lg:max-w-[60%] lg:flex-row z-50`}
          role="dialog"
          aria-live="polite"
        >
          <p className="text-shadow-md">
            This website uses cookies. Take the{" "}
            <span className="text-confirm">red pill</span>, and you’ll see how
            deep the rabbit hole goes. Take the{" "}
            <span className="text-undo">blue pill</span>, and the story ends,
            you wake up in your browser and believe whatever you want.
          </p>
          <div className="flex flex-row gap-4">
            <BluePillButton
              onClick={() => handle("rejected")}
              aria-label="Reject cookie"
            >
              Sleep (Reject)
            </BluePillButton>
            <RedPillButton
              onClick={() => handle("accepted")}
              aria-label="Accept cookie"
            >
              Wake up (Accept)
            </RedPillButton>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsentBanner;