# Changelog

## [2.0.0](https://github.com/chicio/chicio-blog/compare/matrix-rain-webgpu%402.0.3...matrix-design-system%401.1.0) (2026-09-28)

### ⚠ BREAKING CHANGES

* **capabilities:** Footer no longer takes navHrefs and navTracking. It receives links (label, to, onClick) and contactHref.
* **capabilities:** Menu no longer takes navHrefs and tracking. It receives entries (links and dropdowns of grouped links), pinnedOnPaths and per-link onClick.

### Features

* **capabilities:** :boom: design system Menu and Footer take injected navigation (v2.0.0) ([#712](https://github.com/chicio/chicio-blog/issues/712)) ([317165c](https://github.com/chicio/chicio-blog/commit/317165ced546bf3fd34ad6e200bc71d4f84ea68a))

## [1.1.0](https://github.com/chicio/chicio-blog/compare/matrix-design-system%401.0.0...matrix-design-system%401.1.0) (2026-08-30)

### Features

* **capabilities:** :sparkles: publish the design system as a Storybook showcase ([#547](https://github.com/chicio/chicio-blog/issues/547)) ([d094849](https://github.com/chicio/chicio-blog/commit/d094849f5ff4ee72488d160b9effc19063ad8d52))

### Bug Fixes

* :bug: skip release-it's npm auth precondition under trusted publishing ([#546](https://github.com/chicio/chicio-blog/issues/546)) ([023d170](https://github.com/chicio/chicio-blog/commit/023d1704168f8e73b2096562012aa706b37d6084))
