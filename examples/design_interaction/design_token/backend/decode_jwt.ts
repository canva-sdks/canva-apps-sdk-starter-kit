import * as jwt from "jsonwebtoken";
import { JwksClient, SigningKeyNotFoundError } from "jwks-rsa";

const CACHE_EXPIRY_MS = 60 * 60 * 1_000; // 60 minutes
const TIMEOUT_MS = 30 * 1_000; // 30 seconds
const CANVA_BASE_URI = "https://api.canva.com";

/**
 * The JWT payload we'll decode contains:
 * designId - The ID of the Canva Design where this token was issued.
 * aud (audience) - We use the App ID to identify the targeted audience for this payload.
 * exp (expiry) - The expiry timestamp for this JWT, in seconds.
 * iat (issuedAt) - The timestamp at which this JWT was issued, in seconds.
 * nbf (notBefore) - The JWT should only be valid after this timestamp, in seconds.
 *
 * See the JWT specification for more details on each claim and what it represents.
 * https://datatracker.ietf.org/doc/html/rfc7519#section-4.1
 */
type DesignToken = Omit<jwt.Jwt, "payload"> & {
  payload: {
    designId: string;
    aud: string;
    exp: number;
    iat: number;
    nbf: number;
  };
};

/**
 * A helper function for decoding the JWT and verifying that it originated from Canva by checking its signature.
 * @param appId - The ID of the app
 * @param designToken - The DesignToken JWT that contains the Design ID, App ID and User ID.
 * @returns A Promise that resolves to the payload contained by the DesignToken.
 */
export const decodeAndVerifyDesignToken = async (
  appId: string,
  designToken: string,
) => {
  const unverifiedDecodedToken = jwt.decode(designToken, {
    complete: true,
  });

  if (unverifiedDecodedToken?.header?.kid == null) {
    throw new SigningKeyNotFoundError(
      "Error verifying DesignToken: expected token to contain 'kid' claim header in order to produce a signing key.",
    );
  }

  const jwksClient = new JwksClient({
    cache: true,
    cacheMaxAge: CACHE_EXPIRY_MS,
    timeout: TIMEOUT_MS,
    rateLimit: true,
    jwksUri: `${CANVA_BASE_URI}/rest/v1/apps/${appId}/jwks`,
  });
  const key = await jwksClient.getSigningKey(unverifiedDecodedToken.header.kid);
  const publicKey = key.getPublicKey();
  const { payload } = jwt.verify(designToken, publicKey, {
    audience: appId,
    complete: true,
  }) as DesignToken;

  if (payload.designId == null || payload.aud == null) {
    throw new jwt.JsonWebTokenError("Invalid JWT payload");
  }

  /**
   * Convert current timestamp to seconds, as determined by the NumericDate object in the JWT specifications
   * See https://datatracker.ietf.org/doc/html/rfc7519#section-2
   */
  const now = convertMillisecondsToSeconds(Date.now());

  /**
   * Dates provided in a JWT payload are in seconds, as per the NumericDate object in the JWT specification.
   * See https://datatracker.ietf.org/doc/html/rfc7519#section-2
   * We convert them to milliseconds before creating JS Date objects.
   */
  if (payload.exp < now) {
    throw new jwt.TokenExpiredError(
      "The provided DesignToken has expired.",
      new Date(convertSecondsToMilliseconds(payload.exp)),
    );
  }

  if (payload.iat > now) {
    throw new jwt.NotBeforeError(
      "Invalid issue date for DesignToken",
      new Date(convertSecondsToMilliseconds(payload.iat)),
    );
  }

  if (payload.nbf > now) {
    throw new jwt.NotBeforeError(
      "Cannot verify DesignToken prior to the NotBefore date",
      new Date(convertSecondsToMilliseconds(payload.nbf)),
    );
  }

  return payload;
};

const convertSecondsToMilliseconds = (seconds: number) => seconds * 1000;
const convertMillisecondsToSeconds = (milliseconds: number) =>
  milliseconds / 1000;
