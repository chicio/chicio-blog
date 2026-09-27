# The design system imports no framework; hosts supply Bindings

The Matrix Design System imports nothing from `next` or any other framework. Whatever only the host can know (its link
and image implementations, the current path, its assets such as the logo, per-item tracking callbacks) arrives as
props, each with a framework-free default (`AnchorLink`, `PlainImage`). The website supplies these through its Bindings
in `apps/website/src/components/features/design-system-next/`, and everything the site renders imports from there.

This keeps the published package usable by any React host and forces application concerns (routes, tracking, consent,
site metadata) to stay in the application. It is enforced at error by dependency-cruiser.

## Considered Options

- **Depend on Next directly**: fewer props, but the package would be Next-only and would drag the site's concerns into
  a library meant for outside consumers.
- **Publish the Bindings as a second package**: would let other Next sites reuse them, but the goal is a
  framework-agnostic design system, not shared Next glue.
