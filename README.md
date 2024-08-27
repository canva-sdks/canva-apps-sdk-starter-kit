# Canva Apps SDK starter kit

Welcome to the **Apps SDK starter kit** for Canva's app development platform. 🎉

This repo contains everything you need to get an app up and running in a matter of minutes, including a boilerplate project and lots of examples. The complete documentation for the platform is at [canva.dev/docs/apps](https://www.canva.dev/docs/apps/).

**Note:** The starter kit and documentation assumes some experience with TypeScript and React.

## Requirements

- Node.js `v18` or `v20.10.0`
- npm `v9` or `v10`

**Note:** To make sure you're running the correct version of Node.js, we recommend using a version manager, such as [nvm](https://github.com/nvm-sh/nvm#intro). The [.nvmrc](/.nvmrc) file in the root directory of this repo will ensure the correct version is used once you run `nvm install`.

## Quick start

```bash
git clone git@github.com:canva-sdks/canva-apps-sdk-starter-kit.git
cd canva-apps-sdk-starter-kit
npm install
```

## Using the boilerplate

### Step 1: Start the local development server

The `src` directory contains the boilerplate of an app.

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

### (Optional) Step 3: Enable Hot Module Replacement

By default, every time you make a change to an app, you have to reload the entire app to see the results of those changes. If you enable [Hot Module Replacement](https://webpack.js.org/concepts/hot-module-replacement/) (HMR), changes will be reflected without a full reload, which significantly speeds up the development loop.

**Note:** HMR does **not** work while running the development server in a Docker container.

To enable HMR:

1. Navigate to an app via the [Your apps](https://www.canva.com/developers/apps).
2. Select **Configure your app**.
3. Copy the value from the **App origin** field. This value is unique to each app and cannot be customized.
4. In the starter kit's directory, open the `.env` file.
5. Set the `CANVA_APP_ORIGIN` environment variable to the value copied from the **App origin** field:

   ```bash
   CANVA_APP_ORIGIN=# YOUR APP ORIGIN GOES HERE 
   ```

6. Set the `CANVA_HMR_ENABLED` environment variable to `true`:

   ```bash
   CANVA_HMR_ENABLED=true
   ```

7. Restart the local development server.
8. Reload the app manually to ensure that HMR takes effect.

<details>
  <summary>Previewing apps in Safari</summary>

  By default, the development server is not HTTPS-enabled. This is convenient, as there's no need for a security certificate, but it prevents apps from being previewed in Safari.

  **Why Safari requires the development server to be HTTPS-enabled?**

  Canva itself is served via HTTPS and most browsers prevent HTTPS pages from loading scripts via non-HTTPS connections. Chrome and Firefox make exceptions for local servers, such as `localhost`, but Safari does not, so if you're using Safari, the development server must be HTTPS-enabled.

  To learn more, see [Loading mixed-content resources](https://developer.mozilla.org/en-US/docs/Web/Security/Mixed_content#loading_mixed-content_resources).

  To preview apps in Safari:

  1. Start the development server with HTTPS enabled:

  ```bash
  # Run the main app
  npm start --use-https

  # Run an example
  npm start <example-name> --use-https
  ```

  2. Navigate to <https://localhost:8080>.
  3. Bypass the invalid security certificate warning:
    1. Click **Show details**.
    2. Click **Visit website**.
  4. In the Developer Portal, set the app's **Development URL** to <https://localhost:8080>.
  5. Click preview (or refresh your app if it's already open).

  You need to bypass the invalid security certificate warning every time you start the local server. A similar warning will appear in other browsers (and will need to be bypassed) whenever HTTPS is enabled.

  **Note**: If you are running your server on HTTPS (such as for testing on Safari) be sure to change the `CANVA_BACKEND_HOST` environment variable to `https://localhost:3001`.
</details>

## Running an example's backend

Some examples have a backend. This backend is defined in the example's `backend/server.ts` file, automatically starts when the `npm start` command is run, and becomes available at <http://localhost:3001>.

To run examples that have a backend:

1. Navigate to the [Your apps](https://www.canva.com/developers/apps) page.
2. Copy the ID of an app from the **App ID** column in the apps table.
3. In the starter kit's `.env` file, set `CANVA_APP_ID` to the ID of the app.

   For example:

   ```bash
   CANVA_APP_ID=AABBccddeeff
   CANVA_APP_ORIGIN=#
   CANVA_BACKEND_PORT=3001
   CANVA_FRONTEND_PORT=8080
   CANVA_BACKEND_HOST=http://localhost:3001
   CANVA_HMR_ENABLED=FALSE
   ```

4. Start the example:

   ```bash
   npm start fetch
   ```

The ID of the app must be explicitly defined because it's required to [send and verify HTTP requests](https://www.canva.dev/docs/apps/verifying-http-requests/). If you don't set up the ID in the `.env` file, an error will be thrown when attempting to run the example.

**Note**: If you are running your server on HTTPS (such as for testing on Safari) be sure to change the `CANVA_BACKEND_HOST` environment variable to `https://localhost:3001`.

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
