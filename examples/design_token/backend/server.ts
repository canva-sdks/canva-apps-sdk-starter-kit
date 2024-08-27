import * as cors from "cors";

import "dotenv/config";
import * as express from "express";
import { createBaseServer } from "../../../utils/backend/base_backend/create";
import { createJwtMiddleware } from "../../../utils/backend/jwt_middleware";
import { createBrand, createInMemoryDatabase, createUser } from "./database";
import { decodeAndVerifyDesignToken } from "./decode_jwt";
import { SigningKeyNotFoundError } from "jwks-rsa";
import * as jwt from "jsonwebtoken";

/**
 * TODO: add your CANVA_APP_ID to the .env file at the root level
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
 * Instantiate JWT middleware to be used to parse the auth token from the header.
 */
const jwtMiddleware = createJwtMiddleware(APP_ID);

/**
 * TODO: Replace this with a real database.
 */
const data = createInMemoryDatabase();

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
 * TODO: Add this middleware to all routes that will receive authenticated requests from
 * your app.
 */
router.use(jwtMiddleware);

/**
 * Endpoint for retrieving the data associated with a particular design.
 * Design data is stored per-user. Users are also separated into brands.
 */
router.get("/design/:token", async (req, res) => {
  /**
   * Ensure to retrieve Design ID by decoding a Canva-generated DesignToken JWT. We can trust the content of these
   * tokens and safely assume that the current user has access.
   *
   * We strongly recommend you do not expose endpoints that receive plain Design IDs. Doing so will mean that anyone
   * could pass through an arbitrary Design ID, including the IDs of designs they don't actually have access to
   * within Canva.
   */
  let designId: string;
  try {
    ({ designId } = await decodeAndVerifyDesignToken(APP_ID, req.params.token));
  } catch (e) {
    return res
      .status(401)
      .json({ error: "unauthorized", message: getErrorMessage(e) });
  }

  const { userId, brandId } = req.canva;
  const brand = data.get(brandId);
  const user = brand?.users?.get(userId);
  res.send(user?.designs?.get(designId) || {});
});

/**
 * Endpoint for saving the data associated with a particular design.
 * Design data is stored per-user. Users are also separated into brands.
 */
router.post("/design/:token", async (req, res) => {
  /**
   * Ensure to retrieve Design ID by decoding a Canva-generated DesignToken JWT. We can trust the content of these
   * tokens and safely assume that the current user has access.
   *
   * We strongly recommend you do not expose endpoints that receive plain Design IDs. Doing so will mean that anyone
   * could pass through an arbitrary Design ID, including the IDs of designs they don't actually have access to
   * within Canva.
   */
  let designId: string;
  try {
    ({ designId } = await decodeAndVerifyDesignToken(APP_ID, req.params.token));
  } catch (e) {
    return res
      .status(401)
      .json({ error: "unauthorized", message: getErrorMessage(e) });
  }

  const { userId, brandId } = req.canva;
  let brand = data.get(brandId);
  if (brand == null) {
    brand = createBrand();
    data.set(brandId, brand);
  }
  let user = brand.users.get(userId);
  if (user == null) {
    user = createUser();
    brand.users.set(userId, user);
  }
  user.designs.set(designId, req.body);
  res.sendStatus(200);
});

const server = createBaseServer(router);
server.start(process.env.CANVA_BACKEND_PORT);

/**
 * Gets a readable error message to send back to the caller.
 * @param e - The Error object from which we derive the error message.
 */
const getErrorMessage = (e: unknown) => {
  if (e instanceof SigningKeyNotFoundError) {
    return "Public key not found";
  }

  if (e instanceof jwt.JsonWebTokenError) {
    return "Invalid token";
  }

  if (e instanceof jwt.TokenExpiredError) {
    return "Token expired";
  }

  return "An error has occurred while decoding the token.";
};
