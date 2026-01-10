import {Consent,} from "cookieconsent";

declare global {
    interface Window {
        cookieconsent: Consent;
    }
}
