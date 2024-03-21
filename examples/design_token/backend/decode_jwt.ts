import * as jwt from "jsonwebtoken";
import { JwksClient, SigningKeyNotFoundError } from "jwks-rsa";

const CACHE_EXPIRY_MS = 60 * 60 * 1_000; // 60 minutes
const TIMEOUT_MS = 30 * 1_000; // 30 seconds
const CANVA_BASE_URI = "https://api.canva.com";

type DesignToken = Omit<jwt.Jwt, "payload"> & {
  payload: {
    designId: string;
    appId: string;
    userId: string;
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
  designToken: string
) => {
  const unverifiedDecodedToken = jwt.decode(designToken, {
    complete: true,
  });

  if (unverifiedDecodedToken?.header?.kid == null) {
    throw new SigningKeyNotFoundError(
      "Error verifying DesignToken: expected token to contain 'kid' claim header in order to produce a signing key."
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
  const verifiedToken = jwt.verify(designToken, publicKey, {
    audience: appId,
    complete: true,
  }) as DesignToken;
  return verifiedToken.payload;
};
