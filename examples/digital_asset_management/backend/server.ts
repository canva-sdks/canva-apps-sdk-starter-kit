import "dotenv/config";
import * as cookieParser from "cookie-parser";
import * as crypto from "crypto";
import * as express from "express";
import * as cors from "cors";
import { createBaseServer } from "../../../utils/backend/base_backend/create";
import { createJwtMiddleware } from "../../../utils/backend/jwt_middleware";
import type {
  Container,
  FindResourcesRequest,
  Resource,
} from "@canva/app-components";

/**
 * Generates a unique hash for a url.
 * Handy for uniquely identifying an image and creating an image id
 */
async function generateHash(message: string) {
  const msgUint8 = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
}

const imageUrls = [
  "https://cdn.pixabay.com/photo/2023/09/16/18/26/hummingbird-8257355_1280.jpg",
  "https://cdn.pixabay.com/photo/2023/12/10/03/00/peacock-8440548_1280.jpg",
  "https://cdn.pixabay.com/photo/2023/12/20/07/04/mountains-8459056_1280.jpg",
  "https://cdn.pixabay.com/photo/2023/11/26/07/29/sparrow-8413000_1280.jpg",
  "https://cdn.pixabay.com/photo/2023/12/12/16/11/mountain-8445543_1280.jpg",
];

/**
 * This file contains routes needed for a DAM content app.
 */

async function main() {
  // add your CANVA_APP_ID to the .env file at the root level
  const APP_ID = process.env.CANVA_APP_ID;
  if (!APP_ID) {
    throw new Error(
      `The CANVA_APP_ID environment variable is undefined. Set the variable in the project's .env file.`,
    );
  }

  const router = express.Router();

  /**
   * TODO: Configure your CORS Policy
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
   * The `cookieParser` middleware allows the routes to read and write cookies.
   *
   * By passing a value into the middleware, we enable the "signed cookies" feature of Express.js. The
   * value should be static and cryptographically generated. If it's dynamic (as shown below), cookies
   * won't persist between server restarts.
   *
   * TODO: Replace `crypto.randomUUID()` with a static value, loaded via an environment variable.
   */
  router.use(cookieParser(crypto.randomUUID()));

  /**
   * TODO: Add this middleware to all routes that will receive requests from
   * your app.
   */
  const jwtMiddleware = createJwtMiddleware(APP_ID);

  /**
   * All routes that start with /api will be protected by JWT authentication
   */
  router.use("/api", jwtMiddleware);

  /**
   * This endpoint returns the data for your app.
   *
   * TODO: you must change this path to `/api/resources/find` before
   * submitting to ensure a user is authenticated
   */
  router.post("/resources/find", async (req, res) => {
    // You should modify these lines to return data from your
    // digital asset manager (DAM) based on the findResourcesRequest
    const findResourcesRequest: FindResourcesRequest = req.body;
    const { types } = findResourcesRequest;

    let resources: Resource[] = [];
    if (types.includes("IMAGE")) {
      resources = await Promise.all(
        Array.from({ length: 40 }, async (_, i) => ({
          id: await generateHash(imageUrls[i % imageUrls.length]),
          mimeType: "image/jpeg",
          name: "My new thing",
          type: "IMAGE",
          thumbnail: {
            url: imageUrls[i % imageUrls.length],
          },
          url: imageUrls[i % imageUrls.length],
        })),
      );
    }

    if (types.includes("CONTAINER")) {
      const containers = await Promise.all(
        Array.from(
          { length: 10 },
          async (_, i) =>
            ({
              id: await generateHash(i + ""),
              containerType: "folder",
              name: `My folder ${i}`,
              type: "CONTAINER",
            }) satisfies Container,
        ),
      );

      resources = resources.concat(containers);
    }

    res.send({
      resources,
      continuation: +(findResourcesRequest.continuation || 0) + 1,
    });
  });

  const server = createBaseServer(router);
  server.start(process.env.CANVA_BACKEND_PORT);
}

main();
