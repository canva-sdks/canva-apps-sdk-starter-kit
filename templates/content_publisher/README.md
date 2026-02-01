# Content Publisher Template

## Overview

This template provides a minimal starting point for building a content publisher app. It demonstrates the basic structure and key concepts of the Content Publisher intent, including:

- Implementing the Content Publisher intent with all required functions
- Rendering a settings UI where users configure publishing options
- Rendering a preview UI that shows how content will appear after publishing
- Defining output types and media slot specifications
- Handling publish operations (with placeholder implementation)

This template focuses on the intent structure and UI patterns. You'll need to add your own platform integration, including authentication and API calls to your publishing service.

## What's Included

### Content Publisher Intent Structure

The template implements all four required functions:

- `renderSettingsUi`: Renders a simple settings form with a caption input field
- `renderPreviewUi`: Displays a mock social media post preview
- `getPublishConfiguration`: Defines a "Feed Post" output type with image specifications
- `publishContent`: Placeholder function that returns mock success response

### UI Components

- **Settings UI** (`settings_ui.tsx`): A form using the App UI Kit with a caption field and validation
- **Preview UI** (`preview_ui.tsx`): A social media post preview showing how the published content will look

### App UI Kit

The App UI Kit is a React-based component library designed for creating apps that emulate Canva's look and feel. We strongly recommend using the App UI Kit if you're planning to release an app to the public, as this makes it easier to comply with our [design guidelines](https://www.canva.dev/docs/apps/design-guidelines/).

This template uses the App UI Kit for both the settings and preview UIs to demonstrate common patterns. The preview UI is more flexible in production and can be customized to match your target platform's design system.

## Getting Started

### 0. Set up your app

- If not already handled by the Canva CLI, you need to create an app via the [Developer Portal](https://www.canva.com/developers/apps).
- On the **Intents** page, enable the `Content Publisher` intent

### 1. Run the template

- Run `npm start` to start the development server
- Click **Preview URL** in the terminal or **Preview** in the [Developer Portal](https://www.canva.com/developers/apps) to view the app in the Canva editor
- Try entering a caption and viewing the preview

### 2. Customize for your platform

To integrate with your publishing platform, you'll need to:

- **Add authentication**: [Implement OAuth](https://www.canva.dev/docs/apps/authenticating-users/oauth/) or your authentication method to connect user accounts
- **Customize settings**: Modify `settings_ui.tsx` to collect platform-specific publishing options
- **Update preview**: Modify `preview_ui.tsx` to match your platform's post appearance
- **Configure output types**: Update `getPublishConfiguration` in `index.tsx` to define your supported formats and media requirements
- **Implement publishing**: Replace the placeholder in `publishContent` with actual API calls to your platform

# Canva App

Welcome to your Canva App! 🎉

This is a starting point for your app using your chosen template. The complete documentation for the platform is at [canva.dev/docs/apps](https://www.canva.dev/docs/apps/).

**Note:** This code and documentation assumes some experience with TypeScript and React.

## Requirements

- Node.js `v18` or `v20.10.0`
- npm `v9` or `v10`

**Note:** To make sure you're running the correct version of Node.js, we recommend using a version manager, such as [nvm](https://github.com/nvm-sh/nvm#intro). The [.nvmrc](/.nvmrc) file in the root directory of this repo will ensure the correct version is used once you run `nvm install`.

## Quick start

```bash
npm install
```

## Running your Canva App

### Step 1: Start the local development server

To start the boilerplate's development server, run the following command:

```bash
npm start
```

The server becomes available at <http://localhost:8080>.

The app's source code is in the `src/index.tsx` file.

### Step 2: Preview the app

The local development server only exposes a JavaScript bundle, so you can't preview an app by visiting <http://localhost:8080>. You can only preview an app via the Canva editor.

To preview an app:

1. Create an app via the [Developer Portal](https://www.canva.com/developers/apps).
2. Select **App source > Development URL**.
3. In the **Development URL** field, enter the URL of the development server.
4. Click **Preview**. This opens the Canva editor (and the app) in a new tab.
5. Click **Open**. (This screen only appears when using an app for the first time.)

The app will appear in the side panel.

<details>
  <summary>Previewing apps in Safari</summary>

By default, the development server is not HTTPS-enabled. This is convenient, as there's no need for a security certificate, but it prevents apps from being previewed in Safari.

**Why Safari requires the development server to be HTTPS-enabled?**

Canva itself is served via HTTPS and most browsers prevent HTTPS pages from loading scripts via non-HTTPS connections. Chrome and Firefox make exceptions for local servers, such as `localhost`, but Safari does not, so if you're using Safari, the development server must be HTTPS-enabled.

To learn more, see [Loading mixed-content resources](https://developer.mozilla.org/en-US/docs/Web/Security/Mixed_content#loading_mixed-content_resources).

To preview apps in Safari:

1. Start the development server with HTTPS enabled:

```bash
npm start --use-https
```

2. Navigate to <https://localhost:8080>.
3. Bypass the invalid security certificate warning:
   1. Click **Show details**.
   2. Click **Visit website**.
4. In the Developer Portal, set the app's **Development URL** to <https://localhost:8080>.
5. Click preview (or refresh your app if it's already open).

You need to bypass the invalid security certificate warning every time you start the local server. A similar warning will appear in other browsers (and will need to be bypassed) whenever HTTPS is enabled.

</details>

### Step 3 (Optional): Enable Hot Module Replacement

By default, every time you make a change to an app, you have to reload the entire app to see the results of those changes. If you enable [Hot Module Replacement](https://webpack.js.org/concepts/hot-module-replacement/) (HMR), changes will be reflected without a full reload, which significantly speeds up the development loop.

**Note:** HMR does **not** work while running the development server in a Docker container.

To enable HMR:

1. Navigate to an app via the [Your apps](https://www.canva.com/developers/apps).
1. Select **Security** -> **Credentials** -> **.env file**.
1. Copy the `.env` file contents.
1. Paste the contents into the starter kit's `.env` file. For example:

   ```bash
   CANVA_APP_ORIGIN=https://app-aabbccddeeff.canva-apps.com
   CANVA_HMR_ENABLED=true
   ```

1. Restart the local development server.
1. Reload the app manually to ensure that HMR takes effect.

### Step 4 (Optional): Setup the Canva Dev MCP Server

If you're using AI coding tools, such as Cursor or Claude Code, you can connect to the Canva Dev MCP Server to supercharge your development workflow. See this [setup guide](https://www.canva.dev/docs/apps/mcp-server/) to get started.

# Content Publisher Template

## Overview

This template provides a minimal starting point for building a content publisher app. It demonstrates the basic structure and key concepts of the Content Publisher intent, including:

- Implementing the Content Publisher intent with all required functions
- Rendering a settings UI where users configure publishing options
- Rendering a preview UI that shows how content will appear after publishing
- Defining output types and media slot specifications
- Handling publish operations (with placeholder implementation)

This template focuses on the intent structure and UI patterns. You'll need to add your own platform integration, including authentication and API calls to your publishing service.

## What's Included

### Content Publisher Intent Structure

The template implements all four required functions:

- `renderSettingsUi`: Renders a simple settings form with a caption input field
- `renderPreviewUi`: Displays a mock social media post preview
- `getPublishConfiguration`: Defines a "Feed Post" output type with image specifications
- `publishContent`: Placeholder function that returns mock success response

### UI Components

- **Settings UI** (`settings_ui.tsx`): A form using the App UI Kit with a caption field and validation
- **Preview UI** (`preview_ui.tsx`): A social media post preview showing how the published content will look

### App UI Kit

The App UI Kit is a React-based component library designed for creating apps that emulate Canva's look and feel. We strongly recommend using the App UI Kit if you're planning to release an app to the public, as this makes it easier to comply with our [design guidelines](https://www.canva.dev/docs/apps/design-guidelines/).

This template uses the App UI Kit for both the settings and preview UIs to demonstrate common patterns. The preview UI is more flexible in production and can be customized to match your target platform's design system.

## Getting Started

### 0. Set up your app

- If not already handled by the Canva CLI, you need to create an app via the [Developer Portal](https://www.canva.com/developers/apps).
- On the **Intents** page, enable the `Content Publisher` intent

### 1. Run the template

- Run `npm start` to start the development server
- Click **Preview URL** in the terminal or **Preview** in the [Developer Portal](https://www.canva.com/developers/apps) to view the app in the Canva editor
- Try entering a caption and viewing the preview

### 2. Customize for your platform

To integrate with your publishing platform, you'll need to:

- **Add authentication**: [Implement OAuth](https://www.canva.dev/docs/apps/authenticating-users/oauth/) or your authentication method to connect user accounts
- **Customize settings**: Modify `settings_ui.tsx` to collect platform-specific publishing options
- **Update preview**: Modify `preview_ui.tsx` to match your platform's post appearance
- **Configure output types**: Update `getPublishConfiguration` in `index.tsx` to define your supported formats and media requirements
- **Implement publishing**: Replace the placeholder in `publishContent` with actual API calls to your platform
