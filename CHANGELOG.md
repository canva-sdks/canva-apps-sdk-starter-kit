# Changelog

## 2024-09-25

### 🔨 Breaking changes

- Upgraded Apps SDK dependencies to v2.0.0 (design 2.1.0)

### 🧰 Added

- Updated the starter kit with internationalization tooling including `react-intl` and `formatjs`.
  See the docs on the [Canva app localization process](https://www.canva.dev/docs/apps/localization/) to learn more.
- Added [/examples/i18n](/examples/i18n) to demonstrate how to internationalize your app using `react-intl`
- Added [/examples/i18n/tests](/examples/i18n/tests) to demonstrate how to unit test an app using localization
- Added `.vscode` recommended extensions, helps to enforce eslint rules more uniformly by default.
- Added `.pr-train.yml` to `.gitignore`
- Added `use_feature_support` utils.
- Added [/examples/feature_support](/examples/feature_support) to demonstrate usage of the Feature Support API.
- Added `use_add_element` hook utils
- `@canva/design@beta`
  - Added `openDesign` method, which allows apps to read the current page of the user's design. To learn more, see [Design Editing](https://canva.dev/docs/apps/traversal).
- Added a new example [/examples/design_editing](/examples/design_editing) to demonstrate how to use the Design Editing API.

### 🔧 Changed

- Added `alt` attributes where they were missing from `ImageCard` usage in examples.
- `examples`
  - Update `dnd` example apps to use feature supports to ensure they work correctly in different design types.
  - Change TableWrapper and `native_table_element` example to work with new Table API.
  - Updated @canva/asset examples to be compatible with 2.0.
  - Update relevant example apps to:
    - use new lowercase element type as part of upgraded `@canva/design` to version `2.0.0`.
    - use `altText`
    - use `use_add_element` hook to ensure they work correctly in different design types.
  - Drop all `native_*` prefix from example apps' name.
- `@canva/app-ui-kit`
  - Upgraded `app-ui-kit` to version `4.0.0`. Please see the [changelog](https://www.canva.dev/docs/apps/app-ui-kit/changelog/) for the list of changes.
- Upgraded `express` to `4.21.0`.
- Update manual authentication example to use OAuth
- Temporarily downgraded `eslint` to version `8.57.0` while formatjs lint rules are updated to be made compatible with v9.

### 🗑️ Removed

- Removed authentication from `examples/digital_asset_management` pending migration to `auth.requestAuthorization`.

## 2024-08-27

### 🔨 Breaking changes

- Upgraded the `css-loader` package to version `7.1.2`, requiring a css modules import syntax change across all examples. A breaking change was introduced in version `7.0.0`, [see css-loader changelog](https://github.com/webpack-contrib/css-loader/blob/master/CHANGELOG.md#700-2024-04-04) and below for before and after:

  ```diff
  -  import style from "./style.css";
  +  import * as style from "./style.css";
  ```

### 🧰 Added

- `@canva/design@beta`
  - Added `readContent` method, which allows apps to read all of the text content on the current page of the user's design. To learn more, see [Querying](https://www.canva.dev/docs/apps/querying).
- Added tests for `table_wrapper.ts`

### 🐞 Fixed

- Added explanation on how to test app backends on Safari
- Resolved npm audit vulnerabilities - `micromatch: ">=4.0.8"`

### 🔧 Changed

- `@canva/asset`
  - Upgraded `@canva/asset` to version `1.7.1` which has the following changes:
    - Upgraded [`asset.upload`](https://www.canva.dev/docs/apps/api/asset-upload/#uploading-images) to allow larger image uploads (25 MB -> 50 MB).
- `@canva/app-ui-kit`
  - Upgraded `app-ui-kit` to version `3.8.0`. Please see the [changelog](https://www.canva.dev/docs/apps/app-ui-kit/changelog/) for the list of changes.
- Updated the `typescript` package to version `5.5.4` and adjusted tsconfig to suit. [See the release notes](https://devblogs.microsoft.com/typescript/announcing-typescript-5-5/).
- Dependencies audit, upgrading all modules where possible and locking versions to ensure future stability:

  ```text
    @eslint/js                          ^9.6.0  →  9.9.0
    @ngrok/ngrok                        ^1.1.0  →  1.4.1
    @svgr/webpack                       ^8.0.1  →  8.1.0
    @testing-library/dom               ^10.2.0  →  10.4.0
    @types/debug                        ^4.1.7  →  4.1.12
    @types/express                    ^4.17.13  →  4.17.21
    @types/jest                        ^29.4.0  →  29.5.12
    @types/jsonwebtoken                 ^9.0.1  →  9.0.6
    @types/node                       ^20.10.0  →  20.10.0
    @types/node-fetch                   ^2.6.2  →  2.6.11
    @types/node-forge                   ^1.3.1  →  1.3.11
    @types/nodemon                     ^1.19.2  →  1.19.6
    @types/prompts                      ^2.4.2  →  2.4.9
    @types/webpack-env                 ^1.18.0  →  1.18.5
    @typescript-eslint/eslint-plugin    ^7.6.0  →  8.2.0
    @typescript-eslint/parser           ^7.6.0  →  8.2.0
    chalk                                4.1.2  →  4.1.2
    cli-table3                          ^0.6.2  →  0.6.5
    css-loader                          ^6.7.1  →  7.1.2
    cssnano                             ^6.0.1  →  7.0.5
    debug                               ^4.3.4  →  4.3.6
    dotenv                             ^16.0.1  →  16.4.5
    eslint                             ^8.57.0  →  9.9.0
    eslint-plugin-jest                 ^27.9.0  →  28.8.0
    eslint-plugin-react                ^7.34.1  →  7.35.0
    eslint-plugin-react-hooks           ^4.6.0  →  x
    exponential-backoff                 ^3.1.0  →  3.1.1
    express                            ^4.18.1  →  4.19.2
    jsonwebtoken                        ^9.0.0  →  9.0.2
    jwks-rsa                            ^3.0.1  →  3.1.0
    mini-css-extract-plugin             ^2.6.1  →  2.9.1
    node-fetch                          ^2.6.7  →  3.3.2
    nodemon                              3.0.1  →  3.0.1
    postcss-loader                      ^7.3.3  →  8.1.1
    prettier                            ^2.7.1  →  3.3.3
    style-loader                        ^3.3.1  →  4.0.0
    terser-webpack-plugin               ^5.3.5  →  5.3.10
    ts-jest                            ^29.0.5  →  29.2.4
    ts-loader                           ^9.3.1  →  9.5.1
    ts-node                            ^10.9.1  →  10.9.2
    webpack                            ^5.74.0  →  5.94.0
    webpack-cli                        ^4.10.0  →  5.1.4
    webpack-dev-server                 ^4.10.0  →  5.0.4
    yargs                              ^17.5.1  →  17.7.2
  ```

- Migrating eslint config to the new `9.9.0` flat config format, after doing so additional lint rule disabling was needed in a few places.
- Moved `utils/table_wrapper.ts` closer to example referencing it, given it's still in preview.
- Dependencies audit to all workspaces/examples, upgrading all modules where possible and locking versions to ensure future stability:

  ```bash
  # examples/app_image_elements/package.json
  clsx  ^2.1.0  →  2.1.1

  # examples/authentication/package.json
  @types/cookie-parser   ^1.4.6  →   1.4.7
  express               ^4.18.2  →  4.19.2

  # examples/digital_asset_management/package.json
  @canva/app-components  ^1.0.0-beta.17  →  ^1.0.0-beta.22
  express                       ^4.18.2  →         4.19.2

  # examples/fetch/package.json
  express  ^4.18.2  →  4.19.2

  # examples/native_image_elements/package.json
  clsx  ^2.1.0  →  2.1.1

  # examples/positioning_elements/package.json
  clsx  ^2.1.0  →  2.1.1
  ```

### 🗑️ Removed

- `@canva/preview`:

  - Removed `/sdk/preview`, as all of our preview SDKs are now published to NPM with an `@beta` tag. e.g. to install the preview `@canva/design` SDK, run the following command

    ```
    npm install @canva/design@beta
    ```

  - Note that not every SDK is guaranteed to have a preview version released.

- `@canva/preview/data`:
  - The Preview Data APIs have been removed, and are no longer available as a preview SDK.
  - The `data_provider_basic` and `data_provider_options` examples have also been removed.

## 2024-07-24

### 🧰 Added

- `examples`
  - Added a new example [/examples/ui_test](/examples/ui_test) to demonstrate how to test your app's UI.

### 🔧 Changed

- `@canva/app-ui-kit`
  - Upgraded `app-ui-kit` to version `3.7.0`. Please see the [changelog](https://www.canva.dev/docs/apps/app-ui-kit/changelog/) for the list of changes.
- `examples/fonts`
  - Updated font preview img to be a non-interactive ImageCard.

## 2024-07-23

### 🧰 Added

- `@canva/asset`

  - Upgraded to version `1.7.0` which has the following changes:
    - Added [asset.openColorSelector](https://www.canva.dev/docs/apps/using-color-selectors) which was previously in beta.
    - Added selectedColor prop to [asset.openColorSelector](https://www.canva.dev/docs/apps/using-color-selectors/#optional-step-5-handle-multiple-colors)

- `@canva/preview/asset`
  - Added selectedColor prop to [asset.openColorSelector](https://www.canva.dev/docs/apps/using-color-selectors)

### 🔧 Changed

- `@canva/preview/asset`
  - Updated [asset.openColorSelector](https://www.canva.dev/docs/apps/using-color-selectors) and some related types to be public.
- Updated color example to use `@canva/asset` instead of `@canva/preview/asset`

## 2024-07-18

### 🔨 Breaking changes

- `@canva/preview`
  - `RichtextRange`
    - `formatText`, `appendText` and `replaceText` only accept attributes defined as `InlineFormatting`.
    - `formatParagraph` has been introduced to explicitly apply formatting attributes to entire paragraphs. `formatParagraph` takes `RichtextFormatting`, which includes the entire set of formatting attributes
    - See the documentation on [Richtext API](https://www.canva.dev/docs/apps/design-guidelines/rich-text) for more information.

### 🧰 Added

- `@canva/preview`
  - Added the ability to add a new Richtext element via `design.addNativeElement`. See the [documentation](https://www.canva.dev/docs/apps/api/design-create-richtext-range).
- `examples`
  - Added an example to demonstrate the new Richtext element in [`/examples/native_richtext_elements`](/examples/native_richtext_elements).
- ESLint to the repo, by adding required dependencies and a config in [eslintrc.json](./.eslintrc.json).
- Added an `npm run lint` step in `ci.yml`.

### 🐞 Fixed

- A number of changes to various files to fix or suppress various eslint errors and warnings.

## 2024-07-03

### 🧰 Added

- An `npm run test` step in `ci.yml`.

### 🐞 Fixed

- Fix of date test in `utils/backend/jwt_middleware`.
- Updated some dependencies by running `npm audit fix`.

### 🔧 Changed

- `@canva/app-ui-kit`
  - Upgraded `app-ui-kit` to version `3.6.0`. Please see the [changelog](https://www.canva.dev/docs/apps/app-ui-kit/changelog/) for the list of changes.
- Upgraded `react`, `react-dom` and their type packages to version `18.3.1`.
- Removed unnecessary react imports by switching to `jsx-react`

## 2024-06-20

### 🔧 Changed

- `@canva/asset`
  - Upgraded to version `1.6.0` which has the following changes:
    - Added the ability to filter by fontRefs in [findFonts API](https://www.canva.dev/docs/apps/api/asset-find-fonts/#filtering).

## 2024-06-04

### 🧰 Added

- `examples`
  - Added an example to demonstrate the new [Video Selection API](https://www.canva.dev/docs/apps/api/design-selection-register-on-change/) in `examples/video_replacement`.
- `@canva/preview/asset`
  - Added the ability to filter by fontRefs in `findFonts` API.

### 🐞 Fixed

- `examples`
  - Continue removing `dataUrl` usages in `examples/native_image_elements`.
- Fixed a number of instances of stale info in our `README.md` files.

### 🔧 Changed

- Update Hot Module Replacement warnings to a avoid using the HMR acronym.
- Pinned `nodemon` version to `3.0.1`.
- `@canva/design`
  - Upgraded to version `1.9.0` which has the following changes:
    - Added the ability to read/write video via the selection API.

## 2024-05-09

### 🧰 Added

- `@canva/design`
  - Added the ability to edit richtext via the Selection API.
- `examples`
  - Added an example to demonstrate the new [Richtext Selection API](https://www.canva.dev/docs/apps/api/design-selection-register-on-change/) in `examples/richtext_replacement`.

### 🔧 Changed

- `@canva/app-ui-kit`
  - Upgraded `app-ui-kit` to version `3.5.1`. Please see the [changelog](https://www.canva.dev/docs/apps/app-ui-kit/changelog/) for the list of changes.

## 2024-05-06

### 🧰 Added

- `@canva/design`
  - Added [design.overlay.registerOnCanOpen](http://canva.dev/docs/apps/api/design-overlay-register-on-can-open/) which was previously in beta.
- `@canva/platform`
  - Added [appProcess](https://www.canva.dev/docs/apps/api/platform-app-process/) under `@canva/platform` which was previously in beta.

### 🔧 Changed

- `examples`
  - Remove `dataUrl` usages in all examples. We recommend [Upload API](https://www.canva.dev/docs/apps/api/asset-upload/#uploading-images) before adding images to the design.
  - Updated [/examples/image_editing_overlay](/examples/image_editing_overlay) to use `@canva/design` and `@canva/platform` instead of `@canva/preview`.
- `utils/backend`
  - Fixed a number of minor linting and typing related warnings.
- `examples/digital_asset_management`
  - Updated `@canva/app-components` to version `1.0.0-beta.17` in `digital_asset_management` example.
- `README.md`
  - Minor ordering changes of content in the repository [README.md](/README.md).

## 2024-04-23

### 🧰 Added

- `@canva/preview`
  - Added [asset.openColorSelector](https://www.canva.dev/docs/apps/using-color-selectors) under `@canva/preview/asset` to open a selector to pick Document, Brand, and custom colors.
  - Added [/examples/color](/examples/color) to demonstrate usage of the Colors API.

### 🔧 Changed

- The HMR warning printed to the console on app run is now an info warning instead.
- `examples`
  - Update [/examples/image_editing_overlay](/examples/image_editing_overlay) to reflect current recommended practices when working with overlay api.

### 🗑️ Removed

- `@canva/preview`
  - Removed `AppProcessInfo.context` for selected_image_overlay surface due to stale selection, which results in wrong imageUrl passing to the overlay surface. Image url should not be requested outside of overlay code since it can be stale as users can change selection during opening overlay.
- `examples`
  - Removed `OverlayLoadingIndicator` React component to [/examples/image_editing_overlay](/examples/image_editing_overlay) due to issue with cropped and flipped image.

## 2024-04-16

### 🧰 Added

- `@canva/preview`
  - Added `AppProcessInfo.context` for selected_image_overlay surface, allow apps to get additional context data about the surface where the overlay is opened on.
  - Added `NativeTableElement` to addNativeElement, allows apps to insert a table to a design. [See the documentation](https://www.canva.dev/docs/apps/creating-tables/).
  - Added `table_wrapper` utils, which helps to create a table element.
- `examples`
  - Added [/examples/native_table_elements](/examples/native_table_elements) to demonstrate usage of Table API.
  - Added `OverlayLoadingIndicator` React component to [/examples/image_editing_overlay](/examples/image_editing_overlay) to align loading overlay loading experience with native experience.

### 🔧 Changed

- `@canva/preview`

  - Update typings to [appProcess](http://canva.dev/docs/apps/api/platform-app-process/) API methods including `setOnDispose`, `registerOnMessage` and `requestClose`.

- Updated `@canva/app-components` version in digital_asset_management example.

## 2024-04-10

### 🧰 Added

- `@canva/design`
  - Added [design.getDesignToken](https://www.canva.dev/docs/apps/using-design-ids) under `@canva/design` which was previously in beta. See the documentation.

### Updated

- `examples`
  - Updated [/examples/design_token](/examples/design_token) to use `@canva/design` instead of `@canva/preview/design`
- `@canva/design`
  - NativeVideoElement is now supported in app elements. [See the documentation](https://www.canva.dev/docs/apps/creating-app-elements/)

### 🔧 Fixed

- `examples`
  - Fixed some authentication examples using a deprecated parameter instead of the JWT middleware

## 2024-04-02

### 🧰 Added

- `@canva/asset`
  - Added support for TIFF in `upload`

### 🔧 Changed

- Minor fix in [README.md](./README.md) Step 2: Preview the app to reflect the latest instructions.
- `examples`
  - Updated the [/examples/design_token](/examples/design_token) example to include more checks against important JWT claims.
  - Downgraded ExpressJS module used in [/examples/design_token](/examples/design_token) from v5 to v4 to be consistent with other examples.

## 2024-03-21

### 🧰 Added

- `@canva/preview`
  - Added [design.getDesignToken](https://www.canva.dev/docs/apps/using-design-ids) under `@canva/preview/design` to retrieve a signed JWT that contains the Design ID.
- `examples`
  - Added [/examples/design_token](/examples/design_token) to demonstrate usage of [Design Token](https://www.canva.dev/docs/apps/using-design-ids) API.

### 🗑️ Removed

- Removed the `.devcontainer` directory.

## 2024-03-20

### 🧰 Added

- `@canva/preview`
  - Added [design.overlay.registerOnCanOpen](http://canva.dev/docs/apps/api/design-overlay-register-on-can-open/) under `@canva/preview/design`, to register a callback that runs when an overlay canOpen status changed on a particular target. If canOpen, the app can open an overlay on top of the specified target.
  - Added [appProcess](http://canva.dev/docs/apps/api/platform-app-process/) API under `@canva/preview/platform`, which allows app runtime lifecycle management.
  - Added `use_overlay_hook` utils
- `examples`
  - Added [/examples/image_editing_overlay](/examples/image_editing_overlay) to demonstrate [appProcess](http://canva.dev/docs/apps/api/platform-app-process/) API and [design.overlay.registerOnCanOpen](http://canva.dev/docs/apps/api/design-overlay-register-on-can-open/)

### 🔧 Changed

- `@canva/app-ui-kit`
  - Upgraded `app-ui-kit` to version `3.4.0`. Please see the [changelog](https://www.canva.dev/docs/apps/app-ui-kit/changelog/) for the list of changes.
  - Updated examples to use the `ImageCard` component over local styles.
- Minor markdown formatting changes in [README.md](./README.md)
- Add npm workspaces so that individual examples can manage their own dependencies.

## 2024-03-13

### 🧰 Added

- Basic CI github actions steps to format, type-check and ensure `package-lock.json` is up-to-date.

### 🐞 Fixed

- `examples`
  - Replaced previewUrl with thumbnail image in [/examples/drag_and_drop_image](/examples/drag_and_drop_image).
- `webpack.config.js`
  - Fixed a few incorrectly types and missing config property JSDocs.

### 🔧 Changed

- Moved styles from `styles/components.css` that were only used in examples, into the example folders.
- `@canva/asset`
  - Upgraded `asset` to version `1.4.0`. Which transitions the `id` field to optional from required.
  - Updated example apps to remove usages of the `id` field.
- Updated `@canva/app-components` to version `1.0.0-beta.10` in `digital_asset_management` example.

## 2024-02-29

### 🧰 Added

- The Canva Developer Portal now provides the apps origin under the `Configure your app` tab, to simplify
  configuring HMR for your app we have added the `CANVA_APP_ORIGIN` to the environment configuration. Please
  see the updated README.md for how to configure your app for HMR

- Added a [digital asset management app](./examples/digital_asset_management/README.md) example, which
  helps developers create a digital asset management app within Canva.

### 🐞 Fixed

- ngrok now requires an account and `authtoken`. To address this, updated the authentication example's [readme](/examples/authentication/README.md) to describe the ngrok configuration process.

### 🔧 Changed

- `examples`
  - Updated example app [/examples/fonts](examples/fonts/) to align with design guidelines.
- `@canva/preview/design`
  - Updated `fontRef` of `TextAttributes` to `public`.
- `@canva/preview/asset`
  - Updated `requestFontSelection` and `findFonts` to `public`.
- `@canva/app-ui-kit`

  - Upgraded `app-ui-kit` to version `3.3.0`. Please see the [changelog](https://www.canva.dev/docs/apps/app-ui-kit/changelog/).

- Swapped out the community maintained `ngrok` package with the official `@ngrok/ngrok` SDK.
- Minor refactor to the start app script:
  - Improve error messaging when ngrok forward fails.
  - Improved logging readability by utilizing colored messaged more.

### 🗑️ Removed

- Removed the `components` directory, and all of the `Draggable*` components which were `deprecated` in favour of new components from the [App UI Kit](https://www.npmjs.com/package/@canva/app-ui-kit):

  | Deprecated Component   | New Component                                                                                                                  |
  | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
  | `DraggableVideo`       | [VideoCard](https://www.canva.dev/docs/apps/app-ui-kit/storybook/?path=/docs/canva-app-ui-kit-card-videocard--docs)            |
  | `DraggableText`        | [TypographyCard](https://www.canva.dev/docs/apps/app-ui-kit/storybook/?path=/docs/canva-app-ui-kit-card-typographycard--docs)  |
  | `DraggableImage`       | [ImageCard](https://www.canva.dev/docs/apps/app-ui-kit/storybook/?path=/docs/canva-app-ui-kit-card-imagecard--docs)            |
  | `DraggableEmbed`       | [EmbedCard](https://www.canva.dev/docs/apps/app-ui-kit/storybook/?path=/docs/canva-app-ui-kit-card-embedcard--docs)            |
  | `DraggableAudio`       | [AudioCard](https://www.canva.dev/docs/apps/app-ui-kit/storybook/?path=/docs/canva-app-ui-kit-card-audiocard--docs)            |
  | `AudioContextProvider` | [AudioContextProvider](https://www.canva.dev/docs/apps/app-ui-kit/storybook/?path=/docs/canva-app-ui-kit-card-audiocard--docs) |

  For more information, refer to our docs on [Supporting drag-and-drop](https://www.canva.dev/docs/apps/supporting-drag-drop/).

- Removed references to the now deleted `components` directory from the following files:

  - `tsconfig.json`
  - `webpack.config.js`
  - `package.json`

  > If you've added new components in `/components`, you'll have to re-add the config changes mentioned above.

## 2024-02-19

### 🔨 Breaking changes

- Increased the right padding in the `.scrollContainer` class from `--ui-kit-space-1` to `--ui-kit-space-2`

### 🧰 Added

- `examples`
  - Added an app examples explorer which can be run via `npm start examples`.
  - Added an example app [/examples/fonts](examples/fonts/) to demonstrate [requestFontSelection](https://www.canva.dev/docs/apps/api/asset-request-font-selection/) and [findFonts](https://www.canva.dev/docs/apps/api/asset-find-fonts/).
  - Added two examples that use [selection.registerOnChange](https://www.canva.dev/docs/apps/api/design-selection-register-on-change/) in [/examples/image_replacement](examples/image_replacement/) and [/examples/text_replacement](examples/text_replacement/).
  - Added an example to show how to use the [Masonry](https://www.canva.dev/docs/apps/app-ui-kit/storybook/?path=/docs/canva-app-ui-kit-layout-masonry--docs) component from the App UI Kit.

### 🐞 Fixed

- Updated the [webpack config](/webpack.config.js) to always output at most a single JS bundle.
  - At times, when using certain libraries, multiple chunks will be outputted, but given our apps platform doesn't support lazy loading, we must always output at most 1 chunk.

### 🔧 Changed

- `@canva/app-ui-kit`
  - Upgraded `app-ui-kit` to version `3.2.0`. Please see the [changelog](https://www.canva.dev/docs/apps/app-ui-kit/changelog/) for the list of new components added.
- `@canva/design`
  - Upgraded to version `1.5.0` which has the following changes:
    - Updated `fontWeight` of `startDrag` to allow more values.
    - Exported some additional types, such as `FontWeight` and `TextAttributes`.
- `@canva/preview/design`
  - Updated `startDrag` to support `fontRef` for text drag.
- `@canva/preview/asset`
  - Updated `requestFontSelection` to accept a `FontSelectionRequest` object.
- examples:
  - Updated [drag_and_drop_text](examples/drag_and_drop_text), [app_text_elements](examples/app_text_elements), [native_text_elements](examples/native_text_elements) example apps to use more `fontWeight` values.
- Refactored the app start script in `/scripts` to use typescript, and better organized the code.

## 2023-12-14

### 🧰 Added

- `@canva/design`
  - Added a `background` property in the options for [addPage](https://www.canva.dev/docs/apps/api/design-add-page/), which was previously available in preview mode.
  - Added [setCurrentPageBackground](https://www.canva.dev/docs/apps/api/design-set-current-page-background/) which was previously in preview mode.
  - Added an example for using `setCurrentPageBackground` in [/examples/page_background](examples/page_background/).
  - Added the ability to [read plaintext and images](https://www.canva.dev/docs/apps/reading-elements/) from the user's selection, and [edit it too](https://www.canva.dev/docs/apps/replacing-elements/). This was previously available in preview mode. Please note that there have been some changes from the preview API.
- `@canva/asset`
  - Added [getTemporaryUrl](https://www.canva.dev/docs/apps/api/asset-get-temporary-url/) to get URL of an asset, which was previously available in preview mode.
  - Added [parentRef](https://www.canva.dev/docs/apps/api/asset-upload/#parameters) in `ImageUploadOptions` and `VideoUploadOptions` to a reference to the original asset, which was previously available in preview mode.
- `@canva/preview/asset`
  - Added [findFonts](https://www.canva.dev/docs/apps/api/asset-find-fonts/) method for listing available fonts within Canva.
  - Added [requestFontSelection](https://www.canva.dev/docs/apps/api/asset-request-font-selection/) to support font selection through font family panel.

### 🐞 Fixed

- `@canva/design`
  - Excluded `undefined` in `Array` type, and removed `bigint`, `Set`, and `Map` types from `AppElementData` to align with existing internal validation.

### 🔧 Changed

- `@canva/design`
  - Updated `fontWeight` to allow more values.
- `@canva/preview/design`
  - Updated `NativeTextElement` to support the `fontRef` property.
- Migration of SDKs to NPM
  - The following SDKs are now available as NPM packages:
    - [@canva/asset](https://www.npmjs.com/package/@canva/asset)
    - [@canva/design](https://www.npmjs.com/package/@canva/design)
    - [@canva/error](https://www.npmjs.com/package/@canva/error)
    - [@canva/platform](https://www.npmjs.com/package/@canva/platform)
    - [@canva/user](https://www.npmjs.com/package/@canva/user)
  - Dependencies in [package.json](./package.json) were changed to use the NPM registry accordingly.
- Updated node version in [.nvmrc](.nvmrc) to LTS version of [v20.10.0](https://nodejs.org/en/blog/release/v20.10.0)

  - Run the below command at the repo root to upgrade via [nvm](https://github.com/nvm-sh/nvm#intro)

    ```
    nvm install
    ```

### 🗑️ Removed

- [/sdk](/sdk)
  - Bundled source directories for the SDKs published to NPM have been removed.

## 2023-12-13

### 🧰 Added

- `@canva/app-ui-kit`
  - Upgraded `app-ui-kit` to version `3.1.0`. Please see the [changelog](https://www.canva.dev/docs/apps/app-ui-kit/changelog/) for the list of new components added.
- `@canva/platform`
  - Added an example in [/examples/open_external_link](/examples/open_external_link)

### 🗑️ Removed

- `/storybook`
  - App UI Kit stories are now published on [canva.dev](https://www.canva.dev/docs/apps/app-ui-kit/storybook/) 🎉 therefore its source code is removed from the starter kit.

### ⛔️ Deprecated

- The following components in [/components](/components/) have been deprecated in favor of new ones from `app-ui-kit`:

  | Deprecated Component   | New Component          |
  | ---------------------- | ---------------------- |
  | `DraggableVideo`       | `VideoCard`            |
  | `DraggableText`        | `TypographyCard`       |
  | `DraggableImage`       | `ImageCard`            |
  | `DraggableEmbed`       | `EmbedCard`            |
  | `DraggableAudio`       | `AudioCard`            |
  | `AudioContextProvider` | `AudioContextProvider` |

  The drag and drop example apps have been updated to use the new components accordingly.

## 2023-12-12

### 🧰 Added

- `@canva/platform`
  - A new SDK which contains the [requestOpenExternalUrl](https://www.canva.dev/docs/apps/api/platform-request-open-external-url) and [getPlatformInfo](https://www.canva.dev/docs/apps/api/platform-get-platform-info/) methods.

### 🔧 Changed

- Updated `nodemon` to version `3.0.1`. [Changelog](https://github.com/remy/nodemon/releases).

## 2023-11-09

### 🔨 Breaking changes

- `@canva/preview/design`
  - Updated the `design.getDefaultPageDimensions` to return `Promise<undefined>` when in an unbounded document. [See the documentation](https://www.canva.dev/docs/apps/api/design-get-default-page-dimensions/).

### 🧰 Added

- `@canva/design`
  - Added `addPage` which was previously in preview mode. [See the documentation](https://www.canva.dev/docs/apps/api/design-add-page/).
    - Added a `title` option, which sets the title for the new page being added.
  - Added `getDefaultPageDimensions` which was previously in preview mode. [See the documentation](https://www.canva.dev/docs/apps/api/design-get-default-page-dimensions/).
- `@canva/preview`
  - Added a `background` option in the `design.addPage` API, which sets the background for the new page being added.
  - Added `design.setCurrentPageBackground`, which sets the background for the currently opened page.

### 🐞 Fixed

- Made `ColorSelector` component story stateful, such that the component is updated whenever the color changes

### 🔧 Changed

- Grouped stories in `/storybook/stories` by functionality

## 2023-11-02

### 🔨 Breaking changes

- Upgraded `app-ui-kit` to version `3.0.0`. Please see the `api-ui-kit` [changelog](https://www.canva.dev/docs/apps/app-ui-kit/changelog) for the list of new components added, and any breaking changes
- Updated the `typescript` package to version 5.2.2. [See the release notes](https://devblogs.microsoft.com/typescript/announcing-typescript-5-2/).

### 🧰 Added

- `@canva/design`
  - Added `ui.startDrag`, which handles the `dragStart` event for drag-and-drop. [See the documentation](https://www.canva.dev/docs/apps/api/design-ui-start-drag/).
- Added `DraggableEmbed` component
- Added an example app `drag_and_drop_embed` demonstrating how to make embeds draggable

### 🔧 Changed

- Marked `ui.makeDraggable` as `@deprecated`.
- Formatted SDK `*.d.ts` files
- Minor TSDoc fixes and improvements
- Updated all references to legacy icons, with ones from the `app-ui-kit`
- Upgraded examples to use new `app-ui-kit` components where applicable
- Various changes and improvements in the `/storybook` folder, per the latest version of `app-ui-kit`
- Updated any references to old `app-ui-kit` color tokens according to the [changelog](https://www.canva.dev/docs/apps/app-ui-kit/changelog/#200-2023-09-14)

### 🗑️ Removed

- `assets/icons`
  - Removed all the icons from `assets/icons`, in favour of curated set of icons included in v3 of `@canva/app-ui-kit`
  - Removed custom webpack loader for these icons
- Removed `.thumbnailGrid` class from `styles/components.css`. Please use the `<Grid />` component from `app-ui-kit` instead

## 2023-10-18

### 🔨 Breaking changes

#### Authentication flow

- Updated the authentication flow for Canva Apps. This change impacts the app's backend, so there are no frontend changes required. To learn how to update the backend, see [the migration guide](https://www.canva.dev/docs/apps/authentication-migration-guide).
- Updated [the authentication example](https://github.com/canva-sdks/canva-apps-sdk-starter-kit/blob/main/examples/authentication/backend/server.ts) to demonstrate the new authentication flow.

### 🐞 Fixed

- Corrected CORS documentation in the authentication example as it incorrectly stated that the policy should be set to your backends domain rather than the domain of your app in Canva.

## 2023-09-18

### 🧰 Added

- Added an `open-in-new-tab` icon
- `@canva/preview`
  - Added `design.addPage`, which allows adding a page with pre-populated elements. See docs [here](https://www.canva.dev/docs/apps/api/design-add-page).
  - Added `design.getDefaultPageDimensions` which retrieves the default dimensions of a new page in the design. See docs [here](https://www.canva.dev/docs/apps/api/design-get-default-page-dimensions).

### 🐞 Fixed

- Fixed a number of occurrences where some icons had inconsistent dimensions and fill color.
- Fixed an issue where draggable images did not have the correct opacity.

## 2023-08-24

### 🧰 Added

- `@canva/asset`
  - Added support for Lottie in `upload`
  - Added support for WebP in `upload`

## 2023-08-17

### 🧰 Added

- `@canva/design`
  - Added a `title` property to the response payload of `requestExport`, which represents the title of a successful export.
  - Support shape element with image or video fill.
- `@canva/preview`
  - Added `ui.startDrag` method for drag and drop behaviour.
- Added `rotate` and `reload` icon. Shout out to [NoahDavey](https://github.com/canva-sdks/canva-apps-sdk-starter-kit/pull/6) for submitting a PR to add the rotate icon.

### 🐞 Fixed

- Fixed an issue where the `DraggableVideo` component would ignore onClick events.
- Community shout out:
  - [srelbo](https://github.com/canva-sdks/canva-apps-sdk-starter-kit/pull/4) submitted a fix to an issue with the video badge where text would not be vertically centered.

### 🔧 Changed

- Updated draggable example apps to include click to insert functionality by default.

## 2023-07-27

### 💥 Breaking changes

- `@canva/preview`
  - Data Provider SDK can now be found at `@canva/preview/data` instead of `@canva/preview/data-provider`
  - Renamed `DataProviderColumnType` to `DataColumnType`
  - Removed `getDataProvider` method in favour of importing its methods directly

### 🐞 Fixed

- Fixed type import bug causing import paths to end in "/index"
- Fixed missing `devServer.host` setting when running in non-HMR mode
- Fixed issue in Safari based browsers where example backends were unable to make fetch calls with https enabled

### 🔧 Changed

- NPM version and Node Engine versions are now enforced
- Reorganized the components folder for ease of readability
- Updated Data Provider examples in line with the SDK changes
- Updated code formatter command to check css files and check files in the `storybook` folder
- Updated `@canva/app-ui-kit` to `1.0.0`. There are no changes from `1.0.0-beta.2`.

## 2023-06-14

### 🐞 Fixed

- Replaced legacy CSS and TS tokens with App UI Kit counterparts

### 🗑️ Removed

- Removed unused legacy token files

## 2023-06-13

Initial public release
