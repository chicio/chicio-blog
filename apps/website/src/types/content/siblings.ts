import { Content } from "./content";

/**
 * A content item together with its neighbours in an ordered list. `previous`/`next` are absent at the
 * ends of the list.
 */
export type Siblings<TMeta = unknown> = {
    current: Content<TMeta>;
    previous?: Content<TMeta>;
    next?: Content<TMeta>;
};
