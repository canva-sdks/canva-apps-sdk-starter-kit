# Changelog

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
