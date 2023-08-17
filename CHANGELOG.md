# Changelog

## 2023-08-17 

### 🧰 Added
- `@canva/design`
  - Added a `title` property to the response payload of `requestExport`, which represents the title of a successful export.
  - Support shape element with image or video fill.
- `@canva/preview`
  - Added `ui.startDrag` method for drag and drop behaviour.
- Added `rotate` and `reload` icon. Shout out to [NoahDavey](https://github.com/canva-sdks/canva-apps-sdk-starter-kit/pull/6) for submiting a PR to add the rotate icon.

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
