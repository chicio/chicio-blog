# The repository is Chicio Labs, and the Website is one Lab Project

The repository started as the source of fabrizioduroni.it and was named `chicio-blog`. It now also publishes npm
packages, Showcases and Claude Code plugins, and it is where Fabrizio experiments with code, AI and computer graphics.
So it was renamed `chicio/chicio-labs`: the repository is **Chicio Labs**, and the Website is one **Lab Project** among
others (see `GLOSSARY-MAP.md`). The repository's homepage is the **Labs Hub** at `labs.fabrizioduroni.it`, not the
Website.

## Considered Options

- **Keep `chicio-blog`**: no migration, but the name says the repository is the blog, which stopped being true once
  the packages, Showcases and plugins were published from it.
- **Split the Website into its own repository**: rejected, because the Website builds against the local packages
  ([ADR-0001](0001-monorepo.md)) and splitting would bring back the publish-then-consume loop the monorepo removed.
- **Serve the Labs Hub at `chicio.github.io/<repo>/`**: rejected. GitHub does not redirect project Pages URLs when a
  repository is renamed, and the rain Showcase hard-codes its base path, so every rename would break both. A subdomain
  of fabrizioduroni.it does not depend on the repository name. The zone is hosted at register.it, so the `labs` CNAME
  to `chicio.github.io` is independent of the apex and `www` records that point at Vercel.

## Consequences

- The Vercel project is named `fabrizioduroni-it`, after the Lab Project it deploys, not after the repository.
- Three bindings outside the repository follow the repository's name and do not follow GitHub's redirect: npm trusted
  publishing (one entry per package, naming the repository and `release-package.yml`), npm provenance (each package's
  `repository.url` must match the repository in the OIDC token), and giscus (it looks the repository up by
  `owner/name`). Another rename has to change all three.
- No repository may be created under the old name `chicio/chicio-blog`: that would end GitHub's redirect for git
  remotes, issue and PR links, and installs of the plugin marketplace made from the old name.
- "chicio-blog" is kept out of every glossary's _Avoid_ list on purpose: older Posts name the repository as it was then.
