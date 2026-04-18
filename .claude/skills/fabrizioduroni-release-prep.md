---
description: "Pre-release checklist — verify changelog, lint, build, and version bump before running npm run release"
---

# Release Preparation Checklist

Run this before `npm run release` to verify everything is ready.

## Steps

### 1. Check Working Tree

```bash
git status
```

Verify no uncommitted changes. If there are, warn the user and stop.

### 2. Check Current Version

Read `package.json` to get the current version. Then check the latest git tag:

```bash
git describe --tags --abbrev=0
```

### 3. Preview Changelog

Show commits since the last tag:

```bash
git log $(git describe --tags --abbrev=0)..HEAD --oneline
```

Based on conventional commit prefixes, predict the version bump:
- `feat:` commits → minor bump
- `fix:` commits → patch bump
- `BREAKING CHANGE` or `!:` → major bump

Tell the user what version the release would produce.

### 4. Run Verification

```bash
npm run lint
npm run build
```

Both must pass.

### 5. Check CI Status

```bash
gh run list --limit 1 --branch main
```

Verify the latest CI run on main passed.

### 6. Report

Summarize:
- Current version → predicted next version
- Number of commits to include
- Lint/build status
- CI status
- Any warnings (e.g., no feat commits for a minor release, uncommitted files)

If everything passes, tell the user they can run `npm run release`.
