# Releasing matrix-rain-webgpu

Releases run from **GitHub Actions** (Actions → **Release** → Run workflow) via OIDC trusted
publishing — no token needed. The version and `CHANGELOG.md` are derived from
[Conventional Commits](https://www.conventionalcommits.org/), so commit messages decide the
bump: `fix:` → patch, `feat:` → minor, `feat!:`/`BREAKING CHANGE:` → major.

## 1. Dry-run first

Run the workflow with **`dry_run: true`** and your chosen `increment`. Check the computed
version, the `CHANGELOG.md` diff, and the publish plan. Nothing is published, tagged, or
pushed.

## 2. Run for real

Same `increment`, **`dry_run: false`**:

| Goal | `increment` | Result | npm tag |
|------|-------------|--------|---------|
| First beta on the 1.0.0 line | `major-beta` | `1.0.0-beta.0` | `beta` |
| Next beta | `beta` | `1.0.0-beta.1`, `.2`, … | `beta` |
| Graduate beta → stable | `minor` (or `major`/`patch`) | `1.0.0` | `latest` |
| Routine release after 1.0.0 | `patch` / `minor` / `major` | bumped | `latest` |

Betas reach consumers only via `npm i matrix-rain-webgpu@beta`; `@latest` is untouched until
you graduate.

## What happens automatically

The version bump, `CHANGELOG.md`, the bump commit + git tag pushed to `main`, the GitHub
release, the `npm publish`, and a signed provenance attestation — all handled by the
workflow. Do none of it by hand.

## Gotchas

- The bump commit redeploys the docs site (expected, harmless).
- Only `feat`/`fix`/`feat!` commits drive the version and appear in the changelog;
  `docs`/`chore`/`refactor`/`build`/`ci` are shipped but filtered out.

---

_Trusted publishing is configured once for the package on npmjs.com; the first publish was
bootstrapped locally because OIDC can't create a not-yet-existing package._
