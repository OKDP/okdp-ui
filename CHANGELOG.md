# Changelog

## [0.3.0](https://github.com/OKDP/okdp-ui/compare/v0.2.0...v0.3.0) (2025-07-10)


### Features

* add basic projects management ([abcf318](https://github.com/OKDP/okdp-ui/commit/abcf318cafcd2fc83bf7f0aeb83c0159ca8a6022))


### Refactoring

* add common content header for pages content ([58e8532](https://github.com/OKDP/okdp-ui/commit/58e853250ec6897f038697000330b6c256a7c5b8))
* add confirmation dialog for sensitive operations ([e04e330](https://github.com/OKDP/okdp-ui/commit/e04e330a3f0ba86f531bf083e5b419a85605fd01))
* add content-toolbar with search, action slot, and view mode toggles ([0071643](https://github.com/OKDP/okdp-ui/commit/00716433694980c27874a76e8b9061d00abfeebb))
* add deployment steps for releases, updates and view mode ([e563bf4](https://github.com/OKDP/okdp-ui/commit/e563bf4b79efb723184715fa0bb0aa8a6417f896))
* add helm versioning ([85c2aaa](https://github.com/OKDP/okdp-ui/commit/85c2aaa8d7223aa65d0a64dc28a7fbcc4afae8a0))
* add reusable stepper component for deployment workflow steps ([15a7975](https://github.com/OKDP/okdp-ui/commit/15a7975079c42aa4664e03c3c60dfd489e28f1aa))
* add toolbar actions (search, view mode) for catalogs ([aa70557](https://github.com/OKDP/okdp-ui/commit/aa7055732fffd7f998f47be75cbed71ed77c5bcb))
* apply eslint ([f3b2728](https://github.com/OKDP/okdp-ui/commit/f3b2728778b287b0956722d2bd8907422d0a7584))
* implement KuboCD releases deletion ([61a9715](https://github.com/OKDP/okdp-ui/commit/61a9715e0a597c37bd28b698cf97b7ea3e84247d))
* implement KuboCD releases update ([a346e7f](https://github.com/OKDP/okdp-ui/commit/a346e7f0fb50a7dfa0cf3b83a4fcfe1fbeba8607))
* persist viewmode across navigation ([c0e1b29](https://github.com/OKDP/okdp-ui/commit/c0e1b29693c32987647b9c892068c784116bebef))
* refresh notification list when clusterId or projectName changes ([94fcf2e](https://github.com/OKDP/okdp-ui/commit/94fcf2ec3dab42bc06a13e8b393f851586f63aba))
* reset the filter on page navigation change ([4997784](https://github.com/OKDP/okdp-ui/commit/4997784175f6f42a021902d44a8e5fb0072a6edb))
* set releases deployment mode to kubernetes as default ([af27a05](https://github.com/OKDP/okdp-ui/commit/af27a05e2dbf6af8d50eb84d7f809c4194845244))
* update global layout ([9eff5a2](https://github.com/OKDP/okdp-ui/commit/9eff5a21bbefd7efeb67d6036defe0ee34e7c3d5))
* update the menu layout ([eeccef1](https://github.com/OKDP/okdp-ui/commit/eeccef138768dd939579c2f1c044fc2763c6a957))

## [0.2.0](https://github.com/OKDP/okdp-ui/compare/v0.1.0...v0.2.0) (2025-06-29)


### Features

* **config:** add support for 'git' and 'kubernetes' submission modes ([7784f26](https://github.com/OKDP/okdp-ui/commit/7784f2687872cb9c149c5650d8bf669bf7c7d8b3))


### Bug Fixes

* resolve SPA routing 404 errors on page refresh by adding nginx try_files configuration ([7890034](https://github.com/OKDP/okdp-ui/commit/7890034a693d4b5532705bd6026c2141f24d7bb2))


### Refactoring

* KuboCD integration - deploy and list KuboCD releases ([173a6ac](https://github.com/OKDP/okdp-ui/commit/173a6aca77955ee35ecf27357a179147570a61b0))
* kubocd integration - remove catalog from kad ([a2a244f](https://github.com/OKDP/okdp-ui/commit/a2a244fcb40ee97accf8b4cdf6c0790fa727949c))

## 0.1.0 (2025-04-03)


### Features

* add About OKDP section ([b182c4e](https://github.com/OKDP/okdp-ui/commit/b182c4ef028fb9fc51d17af1501521d2e1484e72))
* add user profile display ([2296d4a](https://github.com/OKDP/okdp-ui/commit/2296d4aef6a0a13e15e14400034a8797378b347c))
* catalogs - display services catalogs and deploy services from catalogs ([b7fd33a](https://github.com/OKDP/okdp-ui/commit/b7fd33a1dcdd27e316303ee971521efc361a0cad))
* **helm:** add initial Helm chart ([2fe746d](https://github.com/OKDP/okdp-ui/commit/2fe746ddaa455c725ff1f5b51c53bb22b3f9bfd4))
* home - add home page layout ([01c426a](https://github.com/OKDP/okdp-ui/commit/01c426ae3719e0b02fdb41d2ab93aeff484506d8))
* kad integration - fetch kad instances ([5afdbd5](https://github.com/OKDP/okdp-ui/commit/5afdbd5527d0ae08bdf183ed4dca99a17a965cea))
* kad integration - fetch okdp configured services ([a0917fd](https://github.com/OKDP/okdp-ui/commit/a0917fd6ac47c75bdfc1d91fde62f7610dcfe8c3))
* login - add login page component ([c8906d8](https://github.com/OKDP/okdp-ui/commit/c8906d8ddeed2b8684ff42f6be410ee998fffcac))
* notifications management for event alerts ([afbbc1e](https://github.com/OKDP/okdp-ui/commit/afbbc1e4cb487a2ce9c127a59eed1bb2a8da926b))
* OAuth2 authentication - Authenticate using OpenId connect provider with public client ([8bc4aa2](https://github.com/OKDP/okdp-ui/commit/8bc4aa28a65c66edf09fe81ed94de7c93efbe8d7))
* okdp services - deploy a service ([6ee0562](https://github.com/OKDP/okdp-ui/commit/6ee0562c3715e623618d7894a49989179ee28305))
* okdp services - show list of deployed services as cards ([39b1c1a](https://github.com/OKDP/okdp-ui/commit/39b1c1ac860bbe7ef5bea06e3a4bf8eeac802244))


### Bug Fixes

* display left menus services grouped by catalog ([31b8603](https://github.com/OKDP/okdp-ui/commit/31b8603d020cd8374289a9787d4085d4cf30d269))
* remove add parameters and display kad provided ones only ([4d6f694](https://github.com/OKDP/okdp-ui/commit/4d6f6948a59a1a9da8d95847463c1fea8f431a3f))
* remove git folder and commit message inputs ([a20ddb1](https://github.com/OKDP/okdp-ui/commit/a20ddb1d2320d79ed10f78eb5b994b8d57de74e9))
* remove kad roles and dependencies ([f5a15bd](https://github.com/OKDP/okdp-ui/commit/f5a15bd7a973df3c7eca1774e051740b6307fc41))
