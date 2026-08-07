import { trackWith } from "@/lib/tracking/tracking";
import { tracking } from "@/types/configuration/tracking";
import { EASTER_EGG_CATALOG, type EasterEggSlug } from "./easter-egg-catalog";
import { markEasterEggFound } from "./easter-egg-found";
import { getEasterEggOverlaySlug, openEasterEgg } from "./easter-egg-overlay-state";

/**
 * Opens the shared overlay for the given egg, marks it found and fires tracking, all in one call.
 * Every trigger (Konami, tap hotspot, spoon phrase, "101" query, header clicks, whoami, rain-at-max)
 * funnels through here so "found" and tracking can never drift from "the overlay actually opened".
 * A no-op while another egg is already showing, so two triggers firing close together cannot stomp
 * on each other.
 */
export const triggerEasterEgg = (slug: EasterEggSlug): void => {
    if (getEasterEggOverlaySlug() !== null) {
        return;
    }

    const entry = EASTER_EGG_CATALOG[slug];

    openEasterEgg(slug);
    markEasterEggFound(slug);
    trackWith({
        category: tracking.category.easter_egg_hunt,
        label: entry.trackingLabel,
        action: entry.trackingAction,
    });
};
