import { describe, it, expect, vi, beforeEach } from "vitest";
import { triggerEasterEgg } from "./trigger-easter-egg";
import { closeEasterEgg, getEasterEggOverlaySlug } from "./easter-egg-overlay-state";
import { readFoundEasterEggs } from "./easter-egg-found";
import { trackWith } from "@/lib/tracking/tracking";
import { tracking } from "@/types/configuration/tracking";

vi.mock("@/lib/tracking/tracking", () => ({ trackWith: vi.fn() }));

describe("triggerEasterEgg", () => {
    beforeEach(() => {
        closeEasterEgg();
        localStorage.clear();
        vi.mocked(trackWith).mockClear();
    });

    it("opens the overlay for the given slug", () => {
        triggerEasterEgg("the-one");
        expect(getEasterEggOverlaySlug()).toBe("the-one");
    });

    it("marks the egg as found", () => {
        triggerEasterEgg("dodge-this");
        expect(readFoundEasterEggs()).toEqual(["dodge-this"]);
    });

    it("fires tracking with the catalog's action and label", () => {
        triggerEasterEgg("i-know-kung-fu");
        expect(trackWith).toHaveBeenCalledWith({
            category: tracking.category.easter_egg_hunt,
            label: "i_know_kung_fu",
            action: tracking.action.easter_egg_kung_fu,
        });
    });

    it("does nothing when another egg is already open", () => {
        triggerEasterEgg("the-one");
        triggerEasterEgg("dodge-this");
        expect(getEasterEggOverlaySlug()).toBe("the-one");
        expect(readFoundEasterEggs()).toEqual(["the-one"]);
        expect(trackWith).toHaveBeenCalledTimes(1);
    });
});
