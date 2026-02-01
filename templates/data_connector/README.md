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

The app's source code is in the `src/app.tsx` file.

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

## Running an app's backend

Some templates provide an example backend. This backend is defined in the template's `backend/server.ts` file, automatically starts when the `npm start` command is run, and becomes available at <http://localhost:3001>.

To run templates that have a backend:

1. Navigate to the [Your apps](https://www.canva.com/developers/apps) page.
1. Select the app you want to run the example with.
1. Copy your environment variables from **Security** -> **Credentials** -> **.env file**.
1. Paste the contents into the starter kit's `.env` file.

   For example:

   ```bash
   CANVA_APP_ID=AABBccddeeff
   CANVA_APP_ORIGIN=https://app-aabbccddeeff.canva-apps.com
   CANVA_BACKEND_PORT=3001
   CANVA_FRONTEND_PORT=8080
   CANVA_BACKEND_HOST=http://localhost:3001
   CANVA_HMR_ENABLED=TRUE
   ```

1. Start the app:

   ```bash
   npm start
   ```

The ID of the app must be explicitly defined because it's required to [send and verify HTTP requests](https://www.canva.dev/docs/apps/verifying-http-requests/). If you don't set up the ID in the `.env` file, an error will be thrown when attempting to run the example.

## Customizing the backend host

If your app has a backend, the URL of the server likely depends on whether it's a development or production build. For example, during development, the backend is probably running on a localhost URL, but once the app's in production, the backend needs to be exposed to the internet.

To more easily customize the URL of the server:

1. Open the `.env` file in the text editor of your choice.
2. Set the `CANVA_BACKEND_HOST` environment variable to the URL of the server.
3. When sending a request, use `BACKEND_HOST` as the base URL:

   ```ts
   const response = await fetch(`${BACKEND_HOST}/custom-route`);
   ```

   **Note:** `BACKEND_HOST` is a global constant that contains the value of the `CANVA_BACKEND_HOST` environment variable. The variable is made available to the app via webpack and does not need to be imported.

4. Before bundling the app for production, update `CANVA_BACKEND_HOST` to point to the production backend.

## Configure ngrok (optional)

If your app requires authentication with a third party service, your server needs to be exposed via a publicly available URL, so that Canva can send requests to it.
This step explains how to do this with [ngrok](https://ngrok.com/).

**Note:** ngrok is a useful tool, but it has inherent security risks, such as someone figuring out the URL of your server and accessing proprietary information. Be mindful of the risks, and if you're working as part of an organization, talk to your IT department.
You must replace ngrok urls with hosted API endpoints for production apps.

To use ngrok, you'll need to do the following:

1. Sign up for a ngrok account at <https://ngrok.com/>.
2. Locate your ngrok [authtoken](https://dashboard.ngrok.com/get-started/your-authtoken).
3. Set an environment variable for your authtoken, using the command line. Replace `<YOUR_AUTH_TOKEN>` with your actual ngrok authtoken:

   For macOS and Linux:

   ```bash
   export NGROK_AUTHTOKEN=<YOUR_AUTH_TOKEN>
   ```

   For Windows PowerShell:

   ```shell
   $Env:NGROK_AUTHTOKEN = "<YOUR_AUTH_TOKEN>"
   ```

This environment variable is available for the current terminal session, so the command must be re-run for each new session. Alternatively, you can add the variable to your terminal's default parameters.

# Data Connector Template

## Overview

This template provides a working example of a data connector app which uses the Canva Connect API as a data source. It demonstrates how to log in with OAuth and then fetch data from an external source, using Canva's API for listing Designs and Brand Templates. There are instructions below for how to configure your authentication settings to try it out.

The template provides a list / detail interface for choosing a data source. The user would first select the data source they want to import from a list. Next, they configure the data source to select the desired query by applying search filters or sort criteria. The app turns their configured data source into an API request and then returns the data in a table format for use in a Canva Design.

## Best Practices

This template captures best practices for improving user experience in your application.

### State Management

In this template, we've set up state management using `React Context`. It's just one way to do it, not a strict rule. If your app gets more complicated, you might want to check out other options like `Redux` or `MobX`.

### Routing

As your application evolves, you may find the need for routing to manage multiple views or pages. In this template, we've integrated React Router to illustrate how routing can facilitate seamless navigation between various components.

### App UI Kit

The App UI Kit is a React-based component library designed for creating apps that emulate Canva's look and feel. We strongly recommend using the App UI Kit if you're planning to release an app to the public, because this makes it easier to comply with our [design guidelines](https://www.canva.dev/docs/apps/design-guidelines/).

### Data Sources

A data source is a type of data that this connector can retrieve. It has:

- properties that define the configuration for this source - e.g. search criteria, ordering conditions, selection filters
- UI for how to edit this configuration
- columns to display for each data item
- logic for how to fetch the data from an external API

The initial data sources for the Canva Connect API (Designs and Brand Templates) in this template are located in `src/api/data_sources/`.

This template provides a `DataSourceHandler` class in `src/api/data_source.ts` as a suggested starting point for defining a reusable concept for a data source and convert API responses into data table outputs.

## Setup - Authentication

This template is a working app that reads the [Canva Connect API](https://www.canva.dev/docs/connect/).

To run it and authenticate with the Canva Connect API via OAuth you must first complete some authentication setup steps.

### 0. Set up an App

- If not already handled by the Canva CLI, you need to create an app via the [Developer Portal](https://www.canva.com/developers/apps).
- On the **Intents** page, enable the `Data Connector` intent.

### 1. Set up a Connect API Integration

- Go to [Your Integrations](https://www.canva.com/developers/integrations/connect-api) and create a new integration
- On the **Configuration** page, generate a client secret - you need the client ID and client secret in the app setup.
- On the **Scopes** page, add the `designs:meta` and `brandtemplate:meta` read scopes
- On the **Authentication** page, set `https://www.canva.com/apps/oauth/authorized` as an Authorized redirect

### 2. Set up OAuth for the app

- Go to [Your Apps](https://www.canva.com/developers/apps) and open your data connector app.
- On the **Authentication** page, add an OAuth 2.0 provider with the following settings:
  > Provider: `CanvaConnect`
  >
  > Client ID: `(generated in step 1)`
  >
  > Client secret: `(generated in step 1)`
  >
  > Credential transfer mode: `Headers (default)`
  >
  > Authorization server URL: `https://www.canva.com/api/oauth/authorize`
  >
  > Token exchange URL: `https://api.canva.com/rest/v1/oauth/token`
  >
  > Proof Key for Code Exchange (PKCE): `Enabled`

### 3. Run your app

- Run `npm start` to run the app.
- Click **Preview** in the [Developer Portal](https://www.canva.com/developers/apps) to view the app in the Canva editor.
- You should be able to log in and then choose from the available data sources.

### To use another OAuth source

- `src/api/oauth.ts` has a `scope` property that will be used in the oauth flow.
- This template starts with the scope for the Canva Connect API login set to `["design:meta:read", "brandtemplate:meta:read"]`
- It should match the scopes set in Step 1.

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

The app's source code is in the `src/app.tsx` file.

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

## Running an app's backend

Some templates provide an example backend. This backend is defined in the template's `backend/server.ts` file, automatically starts when the `npm start` command is run, and becomes available at <http://localhost:3001>.

To run templates that have a backend:

1. Navigate to the [Your apps](https://www.canva.com/developers/apps) page.
1. Select the app you want to run the example with.
1. Copy your environment variables from **Security** -> **Credentials** -> **.env file**.
1. Paste the contents into the starter kit's `.env` file.

   For example:

   ```bash
   CANVA_APP_ID=AABBccddeeff
   CANVA_APP_ORIGIN=https://app-aabbccddeeff.canva-apps.com
   CANVA_BACKEND_PORT=3001
   CANVA_FRONTEND_PORT=8080
   CANVA_BACKEND_HOST=http://localhost:3001
   CANVA_HMR_ENABLED=TRUE
   ```

1. Start the app:

   ```bash
   npm start
   ```

The ID of the app must be explicitly defined because it's required to [send and verify HTTP requests](https://www.canva.dev/docs/apps/verifying-http-requests/). If you don't set up the ID in the `.env` file, an error will be thrown when attempting to run the example.

## Customizing the backend host

If your app has a backend, the URL of the server likely depends on whether it's a development or production build. For example, during development, the backend is probably running on a localhost URL, but once the app's in production, the backend needs to be exposed to the internet.

To more easily customize the URL of the server:

1. Open the `.env` file in the text editor of your choice.
2. Set the `CANVA_BACKEND_HOST` environment variable to the URL of the server.
3. When sending a request, use `BACKEND_HOST` as the base URL:

   ```ts
   const response = await fetch(`${BACKEND_HOST}/custom-route`);
   ```

   **Note:** `BACKEND_HOST` is a global constant that contains the value of the `CANVA_BACKEND_HOST` environment variable. The variable is made available to the app via webpack and does not need to be imported.

4. Before bundling the app for production, update `CANVA_BACKEND_HOST` to point to the production backend.

## Configure ngrok (optional)

If your app requires authentication with a third party service, your server needs to be exposed via a publicly available URL, so that Canva can send requests to it.
This step explains how to do this with [ngrok](https://ngrok.com/).

**Note:** ngrok is a useful tool, but it has inherent security risks, such as someone figuring out the URL of your server and accessing proprietary information. Be mindful of the risks, and if you're working as part of an organization, talk to your IT department.
You must replace ngrok urls with hosted API endpoints for production apps.

To use ngrok, you'll need to do the following:

1. Sign up for a ngrok account at <https://ngrok.com/>.
2. Locate your ngrok [authtoken](https://dashboard.ngrok.com/get-started/your-authtoken).
3. Set an environment variable for your authtoken, using the command line. Replace `<YOUR_AUTH_TOKEN>` with your actual ngrok authtoken:

   For macOS and Linux:

   ```bash
   export NGROK_AUTHTOKEN=<YOUR_AUTH_TOKEN>
   ```

   For Windows PowerShell:

   ```shell
   $Env:NGROK_AUTHTOKEN = "<YOUR_AUTH_TOKEN>"
   ```

This environment variable is available for the current terminal session, so the command must be re-run for each new session. Alternatively, you can add the variable to your terminal's default parameters.
