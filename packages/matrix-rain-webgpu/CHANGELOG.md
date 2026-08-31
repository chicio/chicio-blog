# Changelog

## [2.0.0](https://github.com/chicio/matrix-rain-webgpu/compare/1.0.1...2.0.0) (2026-07-03)

### Features

* **deps:** :package: ship TypeGPU packages as exact-pinned dependencies ([#16](https://github.com/chicio/matrix-rain-webgpu/issues/16)) ([ccbd0f8](https://github.com/chicio/matrix-rain-webgpu/commit/ccbd0f8d73d1b525af05fe10541e409ce052cc0b))

### Bug Fixes

* **deps:** :arrow_up: update all dependencies, require @typegpu/react ^0.11.2 ([#15](https://github.com/chicio/matrix-rain-webgpu/issues/15)) ([d8ab1b6](https://github.com/chicio/matrix-rain-webgpu/commit/d8ab1b604a565a8fcf77880de9efbbcd4d25f8d0))

## [1.0.1](https://github.com/chicio/matrix-rain-webgpu/compare/1.0.0...1.0.1) (2026-06-20)

### Features

* **docs:** :sparkles: add GitHub button to home hero, stack CTAs vertically on mobile ([2bbf558](https://github.com/chicio/matrix-rain-webgpu/commit/2bbf558637cedd685b0daba871e7914ee0473614))

## [1.0.0](https://github.com/chicio/matrix-rain-webgpu/compare/1.0.0-beta.1...1.0.0) (2026-06-13)

### Bug Fixes

* **renderer:** :recycle: drop sleep/background debug probes; document context-loss as known v1 limit ([ea68ae1](https://github.com/chicio/matrix-rain-webgpu/commit/ea68ae116bddaa007d37b7c0a42b276ed1c5c947))

### Performance Improvements

* :zap: memoize debug-panel so a slider drag re-renders one control ([7be39cb](https://github.com/chicio/matrix-rain-webgpu/commit/7be39cb989b82e05bd25fa6fa2dfcfa209e92f8a))

## [1.0.0-beta.1](https://github.com/chicio/matrix-rain-webgpu/compare/1.0.0-beta.0...1.0.0-beta.1) (2026-06-13)

## [1.0.0-beta.0](https://github.com/chicio/matrix-rain-webgpu/compare/0.9.0...1.0.0-beta.0) (2026-06-13)

### Features

* **demo:** intuitive canvas-size controls; fix broken resize ([f4a1747](https://github.com/chicio/matrix-rain-webgpu/commit/f4a17479750c0e850c77d7e4bc58c79fded78ba5)), closes [#canvas-frame](https://github.com/chicio/matrix-rain-webgpu/issues/canvas-frame) [#canvas-frame](https://github.com/chicio/matrix-rain-webgpu/issues/canvas-frame)
* **docs:** Mermaid pipeline diagram + hero Playground link in new tab ([d54e6ca](https://github.com/chicio/matrix-rain-webgpu/commit/d54e6ca3b654a737ae683733d06721028bcbdf0f))
* **docs:** migrate internal demo to /playground ([cddfb5c](https://github.com/chicio/matrix-rain-webgpu/commit/cddfb5cf0f1508133d84ca1c8bfc07485a86f48f))
* **docs:** open the Playground sidebar link in a new tab ([13aeb4c](https://github.com/chicio/matrix-rain-webgpu/commit/13aeb4c4a974adcc3cdf6d85bbae13ab381d4853))
* **docs:** persistent Playground link, GitHub source links (new tab), drop pre-release note ([4c57c9e](https://github.com/chicio/matrix-rain-webgpu/commit/4c57c9e671e601b65641abd384b8bdd4d774d003))
* **docs:** React island + unplugin-typegpu; hero renders public MatrixRainWebGPU ([13b8ea1](https://github.com/chicio/matrix-rain-webgpu/commit/13b8ea11796ee32c58e9b9d6fbd5884c7f432776))
* **docs:** real sidebar IA, KaTeX math, matrix theme, content stubs ([caa9cce](https://github.com/chicio/matrix-rain-webgpu/commit/caa9ccec4e34b3ad2e8999087c05a6b7eabc450f))
* **docs:** scaffold Astro + Starlight site in docs/ ([e619cbd](https://github.com/chicio/matrix-rain-webgpu/commit/e619cbdaa1d42d67aad62f3f6072a74107a22dee))
* **docs:** site logo + favicon, sponsorship links to fabrizioduroni.it ([769a438](https://github.com/chicio/matrix-rain-webgpu/commit/769a438ff5af808e7b19b9883463ee4bef909499))
* **m10:** public <MatrixRainWebGPU> API + clean first-paint ([ba3f74f](https://github.com/chicio/matrix-rain-webgpu/commit/ba3f74f5fa98254cf2a5246a61f8efbb2b345f92))
* tunable head emission for bloom (bloom.emission) ([4ee188e](https://github.com/chicio/matrix-rain-webgpu/commit/4ee188e85c34253763b96aadd9b4920a346540dc))

### Bug Fixes

* **docs:** dedupe typegpu/react so lib source shares one instance ([91bc083](https://github.com/chicio/matrix-rain-webgpu/commit/91bc083690d9a8deb4519564dd27841ae644bfa3))
* **docs:** hide mermaid source until rendered; round + border the header logo ([2acc97f](https://github.com/chicio/matrix-rain-webgpu/commit/2acc97f14a9baaa7558f5a3e8deda6816b30ade7))
* **docs:** wrap playground demo in Suspense (stops hooks-order warning) ([6a48524](https://github.com/chicio/matrix-rain-webgpu/commit/6a485243464637ee8e165c1906ea09f989e671b5))
