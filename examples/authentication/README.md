# README

## Step 1: Set the `APP_ID` environment variable

1. Get the ID of an app.
   1. Log in to the [Developer Portal](https://www.canva.com/developers/).
   2. Navigate to the [Your apps](https://www.canva.com/developers/apps) page.
   3. Copy the ID of an app from the **App ID** column in the Apps table.
2. Open the starter kit's `.env` file.
3. Set the `APP_ID` environment variable to the ID of the app.

## Step 2: Configure ngrok

You server needs to be exposed via a publicly available URL, so that Canva can send requests to it. This step explains how to do this with [ngrok](https://ngrok.com/).

**Note:** ngrok is a useful tool, but it has inherent security risks, such as someone figuring out the URL of your server and accessing proprietary information. Be mindful of the risks, and if you're working as part of an organization, talk to your IT department.

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

## Step 3: Run the development servers

These steps demonstrate how to start the local development servers:

1. Navigate into the starter kit:

   ```
   cd canva-apps-sdk-starter-kit
   ```

2. Run the following command to launch the backend and frontend development servers. The `--ngrok` parameter exposes the backend server via a publicly accessible URL.

   ```
   npm start authentication --ngrok
   ```

## Step 4: Configure the app

1. Navigate to the app via the Developer Portal.
2. In the **App source > Development URL** field, enter `http://localhost:8080`.
3. In the sidebar, select **Add authentication**.
4. Enable **This app requires authentication**.
5. In the **Redirect URL** field, enter the publicly accessible URL of the backend server, with `/redirect-url` appended.
6. In the **Authentication base URL** field, enter the publicly accessible URL of the backend server.
