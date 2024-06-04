# Changelog

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

  | Deprecated Component   | New Component         |
  |------------------------|-----------------------|
  | `DraggableVideo`       | [VideoCard](https://www.canva.dev/docs/apps/app-ui-kit/storybook/?path=/docs/canva-app-ui-kit-card-videocard--docs)           |
  | `DraggableText`        | [TypographyCard](https://www.canva.dev/docs/apps/app-ui-kit/storybook/?path=/docs/canva-app-ui-kit-card-typographycard--docs)      |
  | `DraggableImage`       | [ImageCard](https://www.canva.dev/docs/apps/app-ui-kit/storybook/?path=/docs/canva-app-ui-kit-card-imagecard--docs)           |
  | `DraggableEmbed`       | [EmbedCard](https://www.canva.dev/docs/apps/app-ui-kit/storybook/?path=/docs/canva-app-ui-kit-card-embedcard--docs)           |
  | `DraggableAudio`       | [AudioCard](https://www.canva.dev/docs/apps/app-ui-kit/storybook/?path=/docs/canva-app-ui-kit-card-audiocard--docs)           |
  | `AudioContextProvider` | [AudioContextProvider](https://www.canva.dev/docs/apps/app-ui-kit/storybook/?path=/docs/canva-app-ui-kit-card-audiocard--docs)|

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

  | Deprecated Component   | New Component         |
  |------------------------|-----------------------|
  | `DraggableVideo`       | `VideoCard`           |
  | `DraggableText`        | `TypographyCard`      |
  | `DraggableImage`       | `ImageCard`           |
  | `DraggableEmbed`       | `EmbedCard`           |
  | `DraggableAudio`       | `AudioCard`           |
  | `AudioContextProvider` | `AudioContextProvider`|

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
