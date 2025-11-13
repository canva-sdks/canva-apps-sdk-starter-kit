// For usage information, see the README.md file.
import express from "express";
import cors from "cors";
import { createDamRouter } from "./routers/dam";
import { createBaseServer } from "../../../../utils/backend/base_backend/create";

async function main() {
  /*
    Set the CANVA_APP_ID environment variable in your project's .env file.
    This should match the app ID from your Canva Developer Portal.
  */
  const APP_ID = process.env.CANVA_APP_ID;

  if (!APP_ID) {
    throw new Error(
      `The CANVA_APP_ID environment variable is undefined. Set the variable in the project's .env file.`,
    );
  }

  const router = express.Router();

  /**
   * IMPORTANT: Configure your CORS Policy
   *
   * Cross-Origin Resource Sharing
   * ([CORS](https://developer.mozilla.org/en-US/docs/Glossary/CORS)) is an
   * [HTTP](https://developer.mozilla.org/en-US/docs/Glossary/HTTP)-header based
   * mechanism that allows a server to indicate any
   * [origins](https://developer.mozilla.org/en-US/docs/Glossary/Origin)
   * (domain, scheme, or port) other than its own from which a browser should
   * permit loading resources.
   *
   * A basic CORS configuration would include the origin of your app in the
   * following example:
   * const corsOptions = {
   *   origin: 'https://app-abcdefg.canva-apps.com',
   *   optionsSuccessStatus: 200
   * }
   *
   * The origin of your app is https://app-${APP_ID}.canva-apps.com, and note
   * that the APP_ID should to be converted to lowercase.
   *
   * https://www.npmjs.com/package/cors#configuring-cors
   *
   * You may need to include multiple permissible origins, or dynamic origins
   * based on the environment in which the server is running. Further
   * information can be found
   * [here](https://www.npmjs.com/package/cors#configuring-cors-w-dynamic-origin).
   */
  router.use(cors());

  /**
   * Add routes for digital asset management.
   */
  const damRouter = createDamRouter();
  router.use(damRouter);

  const server = createBaseServer(router);
  server.start(process.env.CANVA_BACKEND_PORT);
}

main();
