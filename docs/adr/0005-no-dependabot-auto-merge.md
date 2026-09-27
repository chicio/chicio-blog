# No Dependabot auto-merge, and no ruleset on `main`

Dependabot PRs are merged by hand, and `main` has no ruleset. Auto-merge needs a required status check to wait on, a
required status check gates direct pushes as well as merges, and `release-website.yml` pushes its bump commit and tag
as `github-actions[bot]`, which cannot be added as a ruleset bypass actor on a repository owned by a personal account
("Actor GitHub Actions integration must be part of the ruleset source or owner organization").

## Considered Options

- **Auto-merge with a required check**: blocks `release-website.yml` from pushing, for the reason above. Evaluate mode,
  which would have made this observable before enforcing, is Enterprise-only.
- **A long-lived PAT or a GitHub App as the pushing identity**: would work, but neither is worth it for a queue that
  daily scheduling and the `others` group already keep to one to three PRs. Merging them is a click.
