/* eslint-disable no-console */
import * as chalk from "chalk";
import * as debug from "debug";
import type { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import { JwksClient, SigningKeyNotFoundError } from "jwks-rsa";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Express from "express-serve-static-core";

/**
 * Prefix your start command with `DEBUG=express:middleware:jwt` to enable debug logging
 * for this middleware
 */
const debugLogger = debug("express:middleware:jwt");

const CANVA_BASE_URL = "https://api.canva.com";

/**
 * Augment the Express request context to include the appId/userId/brandId fields decoded
 * from the JWT.
 */
declare module "express-serve-static-core" {
  export interface Request {
    canva: {
      appId: string;
      userId: string;
      brandId: string;
    };
  }
}

type CanvaJwt = Omit<jwt.Jwt, "payload"> & {
  payload: {
    aud?: string;
    userId?: string;
    brandId?: string;
  };
};

const PUBLIC_KEY_DEFAULT_EXPIRY_MS = 60 * 60 * 1_000; // 60 minutes
const PUBLIC_KEY_DEFAULT_FETCH_TIMEOUT_MS = 30 * 1_000; // 30 seconds

const sendUnauthorizedResponse = (res: Response, message?: string) =>
  res.status(401).json({ error: "unauthorized", message });

const createJwksUrl = (appId: string) =>
  `${CANVA_BASE_URL}/rest/v1/apps/${appId}/jwks`;

/**
 * An Express.js middleware for decoding and verifying a JSON Web Token (JWT).
 * By default, this middleware extracts the token from the `Authorization` header.
 *
 * @remarks
 * If a JWT is successfully decoded, the following properties are added to the request object:
 * - `request.canva.appId` - The ID of the app.
 * - `request.canva.brandId` - The ID of the user's team.
 * - `request.canva.userId` - The ID of the user.
 *
 * @param appId - The ID of the app.
 * @param getTokenFromRequest - A function that extracts a token from the request. If a token isn't found, throw a `JWTAuthorizationError`.
 * @returns An Express.js middleware for verifying and decoding JWTs.
 */
export function createJwtMiddleware(
  appId: string,
  getTokenFromRequest: GetTokenFromRequest = getTokenFromHttpHeader,
): (req: Request, res: Response, next: NextFunction) => void {
  const jwksClient = new JwksClient({
    cache: true,
    cacheMaxAge: PUBLIC_KEY_DEFAULT_EXPIRY_MS,
    timeout: PUBLIC_KEY_DEFAULT_FETCH_TIMEOUT_MS,
    rateLimit: true,
    jwksUri: createJwksUrl(appId),
  });

  return async (req, res, next) => {
    try {
      debugLogger(`processing JWT for '${req.url}'`);

      const token = await getTokenFromRequest(req);
      const unverifiedDecodedToken = jwt.decode(token, {
        complete: true,
      });

      if (unverifiedDecodedToken?.header?.kid == null) {
        console.trace(
          `jwtMiddleware: expected token to contain 'kid' claim header`,
        );
        return sendUnauthorizedResponse(res);
      }

      const key = await jwksClient.getSigningKey(
        unverifiedDecodedToken.header.kid,
      );
      const publicKey = key.getPublicKey();
      const verifiedToken = jwt.verify(token, publicKey, {
        audience: appId,
        complete: true,
      }) as CanvaJwt;
      const { payload } = verifiedToken;
      debugLogger("payload: %O", payload);

      if (
        payload.userId == null ||
        payload.brandId == null ||
        payload.aud == null
      ) {
        console.trace(
          "jwtMiddleware: failed to decode jwt missing fields from payload",
        );
        return sendUnauthorizedResponse(res);
      }

      req.canva = {
        appId: payload.aud,
        brandId: payload.brandId,
        userId: payload.userId,
      };

      next();
    } catch (e) {
      if (e instanceof JWTAuthorizationError) {
        return sendUnauthorizedResponse(res, e.message);
      }

      if (e instanceof SigningKeyNotFoundError) {
        return sendUnauthorizedResponse(
          res,
          `Public key not found. ${chalk.bgRedBright(
            "Ensure you have the correct App_ID set",
          )}.`,
        );
      }

      if (e instanceof jwt.JsonWebTokenError) {
        return sendUnauthorizedResponse(res, "Token is invalid");
      }

      if (e instanceof jwt.TokenExpiredError) {
        return sendUnauthorizedResponse(res, "Token expired");
      }

      next(e);
    }
  };
}

export type GetTokenFromRequest = (req: Request) => Promise<string> | string;

export const getTokenFromQueryString: GetTokenFromRequest = (
  req: Request,
): string => {
  // The name of a query string parameter bearing the JWT
  const tokenQueryStringParamName = "canva_user_token";

  const queryParam = req.query[tokenQueryStringParamName];
  if (!queryParam || typeof queryParam !== "string") {
    console.trace(
      `jwtMiddleware: missing "${tokenQueryStringParamName}" query parameter`,
    );
    throw new JWTAuthorizationError(
      `Missing "${tokenQueryStringParamName}" query parameter`,
    );
  }

  if (!looksLikeJWT(queryParam)) {
    console.trace(
      `jwtMiddleware: invalid "${tokenQueryStringParamName}" query parameter`,
    );
    throw new JWTAuthorizationError(
      `Invalid "${tokenQueryStringParamName}" query parameter`,
    );
  }

  return queryParam;
};

export const getTokenFromHttpHeader: GetTokenFromRequest = (
  req: Request,
): string => {
  // The names of a HTTP header bearing the JWT, and a scheme
  const headerName = "Authorization";
  const schemeName = "Bearer";

  const header = req.header(headerName);
  if (!header) {
    throw new JWTAuthorizationError(`Missing the "${headerName}" header`);
  }

  if (!header.match(new RegExp(`^${schemeName}\\s+[^\\s]+$`, "i"))) {
    console.trace(
      `jwtMiddleware: failed to match token in "${headerName}" header`,
    );
    throw new JWTAuthorizationError(
      `Missing a "${schemeName}" token in the "${headerName}" header`,
    );
  }

  const token = header.replace(new RegExp(`^${schemeName}\\s+`, "i"), "");
  if (!token || !looksLikeJWT(token)) {
    throw new JWTAuthorizationError(
      `Invalid "${schemeName}" token in the "${headerName}" header`,
    );
  }

  return token;
};

/**
 * A class representing JWT validation errors in the JWT middleware.
 * The error message provided to the constructor will be forwarded to the
 * API consumer trying to access a JWT-protected endpoint.
 * @private
 */
export class JWTAuthorizationError extends Error {
  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, JWTAuthorizationError.prototype);
  }
}

const looksLikeJWT = (
  token: string,
): boolean => // Base64 alphabet includes
  //   - letters (a-z and A-Z)
  //   - digits (0-9)
  //   - two special characters (+/ or -_)
  //   - padding (=)
  token.match(/^[a-z0-9+/\-_=.]+$/i) != null;
