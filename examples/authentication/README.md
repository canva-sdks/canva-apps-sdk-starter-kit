# README

## Step 1: Set the `APP_ID` environment variable

1. Get the ID of an app.
   1. Log in to the [Developer Portal](https://www.canva.com/developers/).
   2. Navigate to the [Your apps](https://www.canva.com/developers/apps) page.
   3. Copy the ID of an app from the **App ID** column.
2. Open the starter kit's `.env` file.
3. Set the `APP_ID` environment variable to the ID of the app.

## Step 2: Run the development servers

1. Navigate into the starter kit:

   ```
   cd canva-apps-sdk-starter-kit
   ```

2. Run the following command:

   ```
   npm start authentication
   ```

   This will launch two development servers: one for the frontend and one for the backend.

3. Use a tool, such as [ngrok](https://ngrok.com/) to expose the backend server via a public URL:

   ```
   ngrok http http://localhost:3001
   ```

   The backend must be exposed via a public URL because Canva must be able to send requests to it.

## Step 3: Configure the app

1. Navigate to the app via the Developer Portal.
2. In the **App source > Development URL** field, enter `http://localhost:8080`.
3. In the sidebar, select **Add authentication**.
4. Enable **This app requires authentication**.
5. In the **Redirect URL** field, enter the publicly accessible URL of the backend server, with `/redirect-url` appended.
6. In the **Authentication base URL** field, enter the publicly accessible URL of the backend server.
