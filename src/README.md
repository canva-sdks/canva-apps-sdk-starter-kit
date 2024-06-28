# README

## Step 1: Set the `APP_ID` environment variable

1. Get the ID of your app.
   1. Log in to the [Developer Portal](https://www.canva.com/developers/).
   2. Navigate to the [Your apps](https://www.canva.com/developers/apps) page.
   3. Copy the ID from the **App ID** column in the apps table.
2. Open the starter kit's [.env file](../../.env).
3. Set the `APP_ID` environment variable to the ID of the app.

## Step 2: Run the development servers

1. Navigate into the starter kit:

   ```bash
   cd canva-apps-sdk-starter-kit
   ```

1. Run the following command:

   ```bash
   npm start digital_asset_management
   ```

   This will launch one development server for the frontend and backend

2. Navigate to your app at `https://www.canva.com/developers/apps`, and click **Preview** to preview the app.

3. If your app requires authentication with a third party service, continue to Step 3.
   Otherwise, you can make requests to your service via [./backend/server.ts](./backend/server.ts) inside `"/resources/find"`.

## Step 3: (optional) Configure ngrok

If your app requires authentication with a third party service,
your server needs to be exposed via a publicly available URL, so that Canva can send requests to it. This step explains how to do this with [ngrok](https://ngrok.com/).

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

## Step 3: Run the development server with ngrok and add authentication to the app

These steps demonstrate how to start the local development server with ngrok.

From the `canva-apps-sdk-starter-kit` directory

1. Stop any running scripts, and run the following command to launch the backend and frontend development servers. The `--ngrok` parameter exposes the backend server via a publicly accessible URL.

   ```bash
   npm start digital_asset_management --ngrok
   ```

2. After ngrok is running, copy your ngrok url
   (e.g. <https://0000-0000.ngrok-free.app>) to the clipboard.
   1. Go to your app in the [Developer Portal](https://www.canva.com/developers/apps).
   2. Navigate to the "Add authentication" section of your app.
   3. Check "This app requires authentication"
   4. In the "Redirect URL" text box, enter your ngrok url followed by `/redirect-url` e.g.
      <https://0000-0000.ngrok-free.app/redirect-url>
   5. In the "Authentication base URL" text box, enter your ngrok url followed by `/` e.g.
      <https://0000-0000.ngrok-free.app/>
      Note: Your ngrok URL changes each time you restart ngrok. Keep these fields up to
      date to ensure your example authentication step will run.

3. Make sure the app is authenticating users by making the following changes:
   1. Replace

      `router.post("/resources/find", async (req, res) => {`

      with  

      `router.post("/api/resources/find", async (req, res) => {`

      in [./backend/server.ts](./backend/server.ts). Adding `/api/` to the route ensures
      the JWT middleware authenticates requests.

   2. Replace

      ```const url = new URL(`${BACKEND_HOST}/resources/find`);```

      with

      ```const url = new URL(`${BACKEND_HOST}/api/resources/find`);```

      in [./adapter.ts](./adapter.ts)

   3. Comment out these lines in [./app.tsx](./app.tsx)

      ```typescript
      // Comment this next line out for production apps
      setAuthState("authenticated");
      ```

4. Navigate to your app at `https://www.canva.com/developers/apps`, and click **Preview** to preview the app.
   1. A new screen will appear asking if you want to authenticate.
      Press **Connect** to start the authentication flow.
   2. A ngrok screen may appear. If it does, select **Visit Site**
   3. An authentication popup will appear. For the username, enter `username`, and
      for the password enter `password`.
   4. If successful, you will be redirected back to your app.

5. You can now modify the `/redirect-url` function in `server.ts` to authenticate with your third-party
   asset manager, and `/api/resources/find` to pull assets from your third-party asset manager.

   See `https://www.canva.dev/docs/apps/authenticating-users/` for more details.
