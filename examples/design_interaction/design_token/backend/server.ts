// For usage information, see the README.md file.
/* eslint-disable @typescript-eslint/no-non-null-assertion -- user is guaranteed by verifyToken middleware */
import cors from "cors";

import "dotenv/config";
import express from "express";
import { createBaseServer } from "../../../../utils/backend/base_backend/create";
import { user, design, tokenExtractors } from "@canva/app-middleware/express";
import { createBrand, createInMemoryDatabase, createUser } from "./database";

/**
 * Retrieve the CANVA_APP_ID from environment variables.
 * Set this in your .env file at the root level of the project.
 */
const APP_ID = process.env.CANVA_APP_ID;
if (!APP_ID) {
  throw new Error(
    `The CANVA_APP_ID environment variable is undefined. Set the variable in the project's .env file.`,
  );
}

/**
 * Initialize ExpressJS router.
 */
const router = express.Router();

/**
 * In-memory database for demonstration purposes.
 * Production apps should use a persistent database solution.
 */
const data = createInMemoryDatabase();

/**
 * IMPORTANT: You must configure your CORS Policy
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
 * JWT middleware for authenticating requests from Canva apps.
 * This should be applied to all routes that require user authentication.
 */
router.use(user.verifyToken({ appId: APP_ID }));

/**
 * Endpoint for retrieving the data associated with a particular design.
 * Design data is stored per-user. Users are also separated into brands.
 *
 * The design.verifyToken() middleware verifies the design token from the query parameter
 * and populates req.canva.design with { designId, appId }. This ensures we only accept
 * valid, Canva-generated design tokens and prevents unauthorized access to arbitrary design IDs.
 */
router.get(
  "/design",
  design.verifyToken({
    appId: APP_ID,
    tokenExtractor: tokenExtractors.fromQuery("designToken"),
  }),
  async (req, res) => {
    const { designId } = req.canva.design!;
    const { userId, brandId } = req.canva.user!;

    const brand = data.get(brandId);
    const userRecord = brand?.users?.get(userId);
    return res.send(userRecord?.designs?.get(designId) || {});
  },
);

/**
 * Endpoint for saving the data associated with a particular design.
 * Design data is stored per-user. Users are also separated into brands.
 *
 * The design.verifyToken() middleware verifies the design token from the query parameter
 * and populates req.canva.design with { designId, appId }. This ensures we only accept
 * valid, Canva-generated design tokens and prevents unauthorized access to arbitrary design IDs.
 */
router.post(
  "/design",
  design.verifyToken({
    appId: APP_ID,
    tokenExtractor: tokenExtractors.fromQuery("designToken"),
  }),
  async (req, res) => {
    const { designId } = req.canva.design!;
    const { userId, brandId } = req.canva.user!;

    let brand = data.get(brandId);
    if (brand == null) {
      brand = createBrand();
      data.set(brandId, brand);
    }
    let userRecord = brand.users.get(userId);
    if (userRecord == null) {
      userRecord = createUser();
      brand.users.set(userId, userRecord);
    }
    userRecord.designs.set(designId, req.body);
    return res.sendStatus(200);
  },
);

const server = createBaseServer(router);
server.start(process.env.CANVA_BACKEND_PORT);
