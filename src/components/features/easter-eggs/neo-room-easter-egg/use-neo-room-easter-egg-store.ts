import { useState } from "react";
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

    const onComplete = () => {
        setIsCompleted(true);
        const audio = new Audio("/media/sounds/knock-knock.mp3");
        audio.play();
    };

    const onKnock = () => {
        const audio = new Audio("/media/sounds/knock-knock.mp3");
        audio.play();
    };

    return {
        state: { isCompleted },
        effects: { onComplete, onKnock },
    };
};
