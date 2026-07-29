// For usage information, see the README.md file.
/* eslint-disable @typescript-eslint/no-non-null-assertion -- user and brandTemplate are guaranteed by verifyToken middleware */
import cors from "cors";

import "dotenv/config";
import express from "express";
import { createBaseServer } from "../../../../utils/backend/base_backend/create";
import {
  user,
  brandTemplate,
  tokenExtractors,
} from "@canva/app-middleware/express";
import { createBrand, createInMemoryDatabase } from "./database";

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
 * Endpoint for decoding a brand template token and retrieving the data
 * associated with that brand template. Brand template data is stored
 * per-brand, since brand templates belong to a brand rather than an
 * individual user.
 *
 * The brandTemplate.verifyToken() middleware verifies the brand template token from the
 * query parameter and populates req.canva.brandTemplate with { brandTemplateId, appId }.
 * This ensures we only accept valid, Canva-generated brand template tokens and prevents
 * unauthorized access to arbitrary brand template IDs.
 *
 * The response includes the decoded brandTemplateId, since the token itself
 * isn't a usable BrandTemplateId — the client needs this real, verified ID to
 * call getBrandTemplateMetadata and applyTemplate from @canva/design.
 */
router.get(
  "/brand-template",
  brandTemplate.verifyToken({
    appId: APP_ID,
    tokenExtractor: tokenExtractors.fromQuery("brandTemplateToken"),
  }),
  async (req, res) => {
    const { brandTemplateId } = req.canva.brandTemplate!;
    const { brandId } = req.canva.user!;

    const brand = data.get(brandId);
    const brandTemplateData = brand?.brandTemplates?.get(brandTemplateId) ?? {
      applyCount: 0,
    };
    return res.send({ brandTemplateId, ...brandTemplateData });
  },
);

/**
 * Endpoint for recording that a brand template was applied to a design.
 * Brand template data is stored per-brand, since brand templates belong to a brand
 * rather than an individual user.
 *
 * The brandTemplate.verifyToken() middleware verifies the brand template token from the
 * query parameter and populates req.canva.brandTemplate with { brandTemplateId, appId }.
 * This ensures we only increment the apply count for valid, Canva-generated brand template
 * tokens, and prevents unauthorized access to arbitrary brand template IDs.
 */
router.post(
  "/brand-template",
  brandTemplate.verifyToken({
    appId: APP_ID,
    tokenExtractor: tokenExtractors.fromQuery("brandTemplateToken"),
  }),
  async (req, res) => {
    const { brandTemplateId } = req.canva.brandTemplate!;
    const { brandId } = req.canva.user!;

    let brand = data.get(brandId);
    if (brand == null) {
      brand = createBrand();
      data.set(brandId, brand);
    }
    const brandTemplateData = brand.brandTemplates.get(brandTemplateId) ?? {
      applyCount: 0,
    };
    brandTemplateData.applyCount += 1;
    brand.brandTemplates.set(brandTemplateId, brandTemplateData);
    return res.sendStatus(200);
  },
);

const server = createBaseServer(router);
server.start(process.env.CANVA_BACKEND_PORT);
