import { useCallback, useRef, useState } from "react";
import { ComponentStore } from "@/types/component-store";

interface NeoRoomEasterEggState {
    isCompleted: boolean;
}

interface NeoRoomEasterEggEffects {
    onComplete: () => void;
    onKnock: () => void;
}

export const useNeoRoomEasterEggStore = (): ComponentStore<NeoRoomEasterEggState, NeoRoomEasterEggEffects> => {
    const [isCompleted, setIsCompleted] = useState<boolean>(false);
    const completionSoundFired = useRef(false);

    const onComplete = useCallback(() => {
        setIsCompleted(true);
        if (!completionSoundFired.current) {
            completionSoundFired.current = true;
            const audio = new Audio("/media/sounds/knock-knock.mp3");
            audio.play().catch(() => {});
        }
    }, []);

    const onKnock = useCallback(() => {
        const audio = new Audio("/media/sounds/knock-knock.mp3");
        audio.play().catch(() => {});
    }, []);

    return {
        state: { isCompleted },
        effects: { onComplete, onKnock },
    };
};
