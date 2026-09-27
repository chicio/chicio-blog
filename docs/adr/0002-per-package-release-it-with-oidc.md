# Each package is released with its own release-it config, published through npm OIDC

Every published package carries its own `.release-it.json` with a tag prefix (`matrix-design-system@1.1.0`) and a
changelog scoped to its own path, and is published from the manual `release-package.yml` workflow authenticated by
npm OIDC trusted publishing. Changesets is the usual monorepo choice; release-it was kept because the site already
releases with it, so the whole repository follows one release paradigm.

## Considered Options

- **Changesets**: the idiomatic monorepo tool, but a second release paradigm next to the site's release-it, and its
  coordinated-bump model buys little here: caret ranges absorb minors and patches, so packages only need to move
  together on a major.
- **An `NPM_TOKEN` secret**: simpler to set up, but a long-lived credential; OIDC needs none and adds provenance.

## Consequences

- The site never auto-bumps its dependency on a newly published package: it resolves the workspace copy, so it is
  always ahead of npm.
- A brand-new package name may need one bootstrap publish before a trusted publisher can be attached to it.
