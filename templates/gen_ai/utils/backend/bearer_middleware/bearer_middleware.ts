/* eslint-disable no-console */
import debug from "debug";
import type { NextFunction, Request, Response } from "express";

/**
 * Prefix your start command with `DEBUG=express:middleware:bearer` to enable debug logging
 * for this middleware
 */
const debugLogger = debug("express:middleware:bearer");

/**
 * Augment the Express request context to include the appId/userId/brandId fields decoded
 * from the JWT.
 */
declare module "express-serve-static-core" {
  export interface Request {
    user_id: string;
  }
}

const sendUnauthorizedResponse = (res: Response, message?: string) =>
  res.status(401).json({ error: "unauthorized", message });

/**
 * An Express.js middleware verifying a Bearer token.
 * This middleware extracts the token from the `Authorization` header.
 *
 * @param getTokenFromRequest - A function that extracts a token from the request. If a token isn't found, throw a `JWTAuthorizationError`.
 * @returns An Express.js middleware for verifying and decoding JWTs.
 */
export function createBearerMiddleware(
  tokenToUser: (access_token: string) => Promise<string | undefined>,
  getTokenFromRequest: GetTokenFromRequest = getTokenFromHttpHeader,
): (req: Request, res: Response, next: NextFunction) => void {
  return async (req, res, next) => {
    try {
      debugLogger(`processing token for '${req.url}'`);

      const token = await getTokenFromRequest(req);
      const user = await tokenToUser(token);

      if (!user) {
        throw new AuthorizationError("Token is invalid");
      }

      req["user_id"] = user;

      return next();
    } catch (e) {
      if (e instanceof AuthorizationError) {
        return sendUnauthorizedResponse(res, e.message);
      }

      return next(e);
    }
  };
}

export type GetTokenFromRequest = (req: Request) => Promise<string> | string;

export const getTokenFromHttpHeader: GetTokenFromRequest = (
  req: Request,
): string => {
  // The names of a HTTP header bearing the JWT, and a scheme
  const headerName = "Authorization";
  const schemeName = "Bearer";

  const header = req.header(headerName);
  if (!header) {
    throw new AuthorizationError(`Missing the "${headerName}" header`);
  }

  if (!header.match(new RegExp(`^${schemeName}\\s+[^\\s]+$`, "i"))) {
    console.trace(
      `jwtMiddleware: failed to match token in "${headerName}" header`,
    );
    throw new AuthorizationError(
      `Missing a "${schemeName}" token in the "${headerName}" header`,
    );
  }

  const token = header.replace(new RegExp(`^${schemeName}\\s+`, "i"), "");

  return token;
};

/**
 * A class representing JWT validation errors in the JWT middleware.
 * The error message provided to the constructor will be forwarded to the
 * API consumer trying to access a JWT-protected endpoint.
 * @private
 */
export class AuthorizationError extends Error {
  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, AuthorizationError.prototype);
  }
}
