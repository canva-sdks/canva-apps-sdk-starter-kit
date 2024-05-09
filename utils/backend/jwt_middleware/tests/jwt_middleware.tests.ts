/* eslint-disable @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires */
import type { NextFunction, Request, Response } from "express";
import type { DecodeOptions, Jwt, Secret, VerifyOptions } from "jsonwebtoken";
import type { JwksClient, SigningKey } from "jwks-rsa";
import type {
  createJwtMiddleware,
  GetTokenFromRequest,
} from "../jwt_middleware";

type Middleware = (req: Request, res: Response, next: NextFunction) => void;

describe("createJwtMiddleware", () => {
  const FAKE_APP_ID = "AAAAAAAAAA1";
  const FAKE_BRAND_ID = "BAAAAAAAAA1";
  const FAKE_USER_ID = "UAAAAAAAAA1";
  const FAKE_JWKS_URI = "https://api.canva.com/rest/v1/apps/AAAAAAAAAA1/jwks";

  class FakeSigningKeyNotFoundError extends Error {}
  class FakeJsonWebTokenError extends Error {}
  class FakeTokenExpiredError extends Error {}

  let fakeGetTokenFromRequest: jest.MockedFn<GetTokenFromRequest>;
  let verify: jest.MockedFn<
    (
      token: string,
      secretOrPublicKey: Secret,
      options: VerifyOptions & { complete: true }
    ) => Jwt
  >;
  let decode: jest.MockedFn<
    (token: string, options: DecodeOptions & { complete: true }) => Jwt | null
  >;

  let getPublicKey: jest.MockedFn<() => string>;
  let getSigningKey: jest.MockedFn<
    (kid?: string | null | undefined) => Promise<SigningKey>
  >;
  let client: jest.Mocked<typeof JwksClient>;

  let req: Request;
  let res: Response;
  let next: jest.MockedFn<() => void>;

  let JWTAuthorizationError: typeof Error;
  let createJwtMiddlewareFn: typeof createJwtMiddleware;
  let jwtMiddleware: Middleware;

  beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();

    fakeGetTokenFromRequest = jest.fn();
    verify = jest.fn();
    decode = jest.fn();

    getPublicKey = jest.fn().mockReturnValue("public-key");
    getSigningKey = jest.fn().mockResolvedValue({
      getPublicKey,
    });

    client = jest.fn().mockImplementation(() => ({
      getSigningKey,
    }));

    jest.doMock("jsonwebtoken", () => ({
      verify,
      decode,
      JsonWebTokenError: FakeJsonWebTokenError,
      TokenExpiredError: FakeTokenExpiredError,
    }));

    jest.doMock("jwks-rsa", () => ({
      JwksClient: client,
      SigningKeyNotFoundError: FakeSigningKeyNotFoundError,
    }));

    const jwtMiddlewareModule = require("../jwt_middleware");
    createJwtMiddlewareFn = jwtMiddlewareModule.createJwtMiddleware;
    JWTAuthorizationError = jwtMiddlewareModule.JWTAuthorizationError;
  });

  describe("Before called", () => {
    it("Creates a JwksClient", async () => {
      expect.assertions(3);

      expect(client).not.toHaveBeenCalled();
      jwtMiddleware = createJwtMiddlewareFn(
        FAKE_APP_ID,
        fakeGetTokenFromRequest
      );

      expect(client).toHaveBeenCalledTimes(1);
      expect(client).toHaveBeenLastCalledWith({
        cache: true,
        cacheMaxAge: 3_600_000,
        timeout: 30_000,
        rateLimit: true,
        jwksUri: FAKE_JWKS_URI,
      });
    });
  });

  describe("When called", () => {
    beforeEach(() => {
      req = {
        header: (_name: string) => undefined,
      } as Request;

      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
        send: jest.fn().mockReturnThis(),
      } as unknown as Response;

      next = jest.fn();

      jwtMiddleware = createJwtMiddlewareFn(
        FAKE_APP_ID,
        fakeGetTokenFromRequest
      );
    });

    describe("When `getTokenFromRequest` throws an exception ('Fake error')", () => {
      beforeEach(() => {
        fakeGetTokenFromRequest.mockRejectedValue(
          new JWTAuthorizationError("Fake error")
        );
      });

      it(`Does not call next() and returns HTTP 401 with error = "unauthorized" and message = "Fake error"`, async () => {
        expect.assertions(8);

        expect(fakeGetTokenFromRequest).not.toHaveBeenCalled();
        await jwtMiddleware(req, res, next);

        expect(fakeGetTokenFromRequest).toHaveBeenCalledTimes(1);
        expect(fakeGetTokenFromRequest).toHaveBeenLastCalledWith(req);

        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenLastCalledWith(401);

        expect(res.json).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenLastCalledWith({
          error: "unauthorized",
          message: "Fake error",
        });

        expect(next).not.toHaveBeenCalled();
      });
    });

    describe("When the 'JWT doesn't have a key id", () => {
      beforeEach(() => {
        fakeGetTokenFromRequest.mockReturnValue("JWT");

        decode.mockReturnValue({
          header: {
            alg: "RS256",
          },
          payload: {},
          signature: "fake-signature",
        });
      });

      it(`Does not call next() and returns HTTP 401 with error = "unauthorized" and no message`, async () => {
        expect.assertions(5);

        await jwtMiddleware(req, res, next);

        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenLastCalledWith(401);

        expect(res.json).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenLastCalledWith({
          error: "unauthorized",
        });

        expect(next).not.toHaveBeenCalled();
      });
    });

    describe("When there's no public key with the provided key id", () => {
      beforeEach(() => {
        fakeGetTokenFromRequest.mockReturnValue("JWT");

        decode.mockReturnValue({
          header: {
            alg: "RS256",
            kid: "key1",
          },
          payload: {},
          signature: "fake-signature",
        });

        getSigningKey.mockRejectedValue(new FakeSigningKeyNotFoundError());
      });

      it(`Does not call next() and returns HTTP 401 with error = "unauthorized" and message = "Public key not found"`, async () => {
        expect.assertions(5);

        await jwtMiddleware(req, res, next);

        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenLastCalledWith(401);

        expect(res.json).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenLastCalledWith({
          error: "unauthorized",
          message: "Public key not found",
        });

        expect(next).not.toHaveBeenCalled();
      });
    });

    describe("When the middleware cannot verify the token", () => {
      beforeEach(() => {
        fakeGetTokenFromRequest.mockReturnValue("JWT");

        decode.mockReturnValue({
          header: {
            alg: "RS256",
            kid: "key1",
          },
          payload: {},
          signature: "fake-signature",
        });

        verify.mockImplementation(() => {
          throw new FakeJsonWebTokenError();
        });
      });

      it(`Does not call next() and returns HTTP 401 with error = "unauthorized" and message = "Token is invalid"`, async () => {
        expect.assertions(5);

        await jwtMiddleware(req, res, next);

        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenLastCalledWith(401);

        expect(res.json).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenLastCalledWith({
          error: "unauthorized",
          message: "Token is invalid",
        });

        expect(next).not.toHaveBeenCalled();
      });
    });

    describe("When the token has expired", () => {
      beforeEach(() => {
        fakeGetTokenFromRequest.mockReturnValue("JWT");

        decode.mockReturnValue({
          header: {
            alg: "RS256",
            kid: "key1",
          },
          payload: {},
          signature: "fake-signature",
        });

        verify.mockImplementation(() => {
          throw new FakeTokenExpiredError();
        });
      });

      it(`Does not call next() and returns HTTP 401 with error = "unauthorized" and message = "Token expired"`, async () => {
        expect.assertions(5);

        await jwtMiddleware(req, res, next);

        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenLastCalledWith(401);

        expect(res.json).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenLastCalledWith({
          error: "unauthorized",
          message: "Token expired",
        });

        expect(next).not.toHaveBeenCalled();
      });
    });

    describe("When the payload has no userId", () => {
      beforeEach(() => {
        fakeGetTokenFromRequest.mockReturnValue("JWT");

        decode.mockReturnValue({
          header: {
            alg: "RS256",
            kid: "key1",
          },
          payload: {},
          signature: "fake-signature",
        });

        verify.mockReturnValue({
          header: {
            alg: "RS256",
          },
          signature: "fake-signature",
          payload: {
            brandId: FAKE_BRAND_ID,
            aud: FAKE_APP_ID,
          },
        });
      });

      it(`Does not call next() and returns HTTP 401 with error = "unauthorized" and no message`, async () => {
        expect.assertions(5);

        await jwtMiddleware(req, res, next);

        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenLastCalledWith(401);

        expect(res.json).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenLastCalledWith({
          error: "unauthorized",
        });

        expect(next).not.toHaveBeenCalled();
      });
    });

    describe("When the payload has no brandId", () => {
      beforeEach(() => {
        fakeGetTokenFromRequest.mockReturnValue("JWT");

        decode.mockReturnValue({
          header: {
            alg: "RS256",
            kid: "key1",
          },
          payload: {},
          signature: "fake-signature",
        });

        verify.mockReturnValue({
          header: {
            alg: "RS256",
          },
          signature: "fake-signature",
          payload: {
            userId: FAKE_USER_ID,
            aud: FAKE_APP_ID,
          },
        });
      });

      it(`Does not call next() and returns HTTP 401 with error = "unauthorized" and no message`, async () => {
        expect.assertions(5);

        await jwtMiddleware(req, res, next);

        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenLastCalledWith(401);

        expect(res.json).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenLastCalledWith({
          error: "unauthorized",
        });

        expect(next).not.toHaveBeenCalled();
      });
    });

    describe("When the payload has no aud", () => {
      beforeEach(() => {
        fakeGetTokenFromRequest.mockReturnValue("JWT");

        decode.mockReturnValue({
          header: {
            alg: "RS256",
            kid: "key1",
          },
          payload: {},
          signature: "fake-signature",
        });

        verify.mockReturnValue({
          header: {
            alg: "RS256",
          },
          signature: "fake-signature",
          payload: {
            userId: FAKE_USER_ID,
            brandId: FAKE_BRAND_ID,
          },
        });
      });

      it(`Does not call next() and returns HTTP 401 with error = "unauthorized" and no message`, async () => {
        expect.assertions(5);

        await jwtMiddleware(req, res, next);

        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenLastCalledWith(401);

        expect(res.json).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenLastCalledWith({
          error: "unauthorized",
        });

        expect(next).not.toHaveBeenCalled();
      });
    });

    describe("When the payload is valid", () => {
      beforeEach(() => {
        fakeGetTokenFromRequest.mockReturnValue("JWT");

        decode.mockReturnValue({
          header: {
            alg: "RS256",
            kid: "key1",
          },
          payload: {},
          signature: "fake-signature",
        });

        verify.mockReturnValue({
          header: {
            alg: "RS256",
          },
          signature: "fake-signature",
          payload: {
            userId: FAKE_USER_ID,
            brandId: FAKE_BRAND_ID,
            aud: FAKE_APP_ID,
          },
        });
      });

      it(`Sets the userId, brandId, and aud as appId in request.canva, and calls next()`, async () => {
        expect.assertions(4);

        await jwtMiddleware(req, res, next);

        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();

        expect(req.canva).toEqual({
          userId: FAKE_USER_ID,
          brandId: FAKE_BRAND_ID,
          appId: FAKE_APP_ID,
        });
        expect(next).toHaveBeenCalledTimes(1);
      });
    });
  });
});

describe("getTokenFromHttpHeader", () => {
  let getHeader: jest.MockedFn<(name: string) => string | undefined>;
  let req: Request;
  let getTokenFromHttpHeader: (req: Request) => string;
  let JWTAuthorizationError: typeof Error;

  beforeEach(() => {
    getHeader = jest.fn();
    req = {
      header: (name: string) => getHeader(name),
    } as Request;

    const jwtMiddlewareModule = require("../jwt_middleware");
    getTokenFromHttpHeader = jwtMiddlewareModule.getTokenFromHttpHeader;
    JWTAuthorizationError = jwtMiddlewareModule.JWTAuthorizationError;
  });

  describe("When the 'Authorization' header is missing", () => {
    beforeEach(() => {
      getHeader.mockReturnValue(undefined);
    });

    it(`Throws a JWTAuthorizationError with message = 'Missing the "Authorization" header'`, async () => {
      expect.assertions(3);

      expect(() => getTokenFromHttpHeader(req)).toThrow(
        new JWTAuthorizationError('Missing the "Authorization" header')
      );
      expect(getHeader).toHaveBeenCalledTimes(1);
      expect(getHeader).toHaveBeenLastCalledWith("Authorization");
    });
  });

  describe("When the 'Authorization' header doesn't have a Bearer scheme", () => {
    beforeEach(() => {
      getHeader.mockReturnValue("Beerer FAKE_JWT");
    });

    it(`Throws a JWTAuthorizationError with message = 'Missing a "Bearer" token in the "Authorization" header''`, async () => {
      expect.assertions(3);

      expect(() => getTokenFromHttpHeader(req)).toThrow(
        new JWTAuthorizationError(
          'Missing a "Bearer" token in the "Authorization" header'
        )
      );
      expect(getHeader).toHaveBeenCalledTimes(1);
      expect(getHeader).toHaveBeenLastCalledWith("Authorization");
    });
  });

  describe("When the 'Authorization' Bearer scheme header doesn't have a token", () => {
    beforeEach(() => {
      getHeader.mockReturnValue("Bearer ");
    });

    it(`Throws a JWTAuthorizationError with message = 'Missing a "Bearer" token in the "Authorization" header'`, async () => {
      expect.assertions(3);

      expect(() => getTokenFromHttpHeader(req)).toThrow(
        new JWTAuthorizationError(
          'Missing a "Bearer" token in the "Authorization" header'
        )
      );
      expect(getHeader).toHaveBeenCalledTimes(1);
      expect(getHeader).toHaveBeenLastCalledWith("Authorization");
    });
  });

  describe("When the 'Authorization' Bearer scheme header has a token that does not match the JWT alphabet", () => {
    beforeEach(() => {
      getHeader.mockReturnValue("Bearer a*b%c");
    });

    it(`Throws a JWTAuthorizationError with message = 'Invalid "Bearer" token in the "Authorization" header'`, async () => {
      expect.assertions(3);

      expect(() => getTokenFromHttpHeader(req)).toThrow(
        new JWTAuthorizationError(
          'Invalid "Bearer" token in the "Authorization" header'
        )
      );
      expect(getHeader).toHaveBeenCalledTimes(1);
      expect(getHeader).toHaveBeenLastCalledWith("Authorization");
    });
  });

  describe("When the 'Authorization' Bearer scheme header has a token", () => {
    beforeEach(() => {
      getHeader.mockReturnValue("Bearer JWT");
    });

    it(`Returns the token`, async () => {
      expect.assertions(3);

      expect(getTokenFromHttpHeader(req)).toEqual("JWT");
      expect(getHeader).toHaveBeenCalledTimes(1);
      expect(getHeader).toHaveBeenLastCalledWith("Authorization");
    });
  });
});

describe("getTokenFromQueryString", () => {
  let req: Request;
  let getTokenFromQueryString: (req: Request) => string;
  let JWTAuthorizationError: typeof Error;

  beforeEach(() => {
    req = {
      query: {},
    } as Request;

    const jwtMiddlewareModule = require("../jwt_middleware");
    getTokenFromQueryString = jwtMiddlewareModule.getTokenFromQueryString;
    JWTAuthorizationError = jwtMiddlewareModule.JWTAuthorizationError;
  });

  describe("When the 'canva_user_token' query parameter is missing", () => {
    beforeEach(() => {
      delete req.query.canva_user_token;
    });

    it(`Throws a JWTAuthorizationError with message = 'Missing "canva_user_token" query parameter'`, async () => {
      expect.assertions(1);

      expect(() => getTokenFromQueryString(req)).toThrow(
        new JWTAuthorizationError('Missing "canva_user_token" query parameter')
      );
    });
  });

  describe("When the 'canva_user_token' query parameter is not a string", () => {
    beforeEach(() => {
      req.query.canva_user_token = 10 as unknown as string;
    });

    it(`Throws a JWTAuthorizationError with message = 'Missing "canva_user_token" query parameter'`, async () => {
      expect.assertions(1);

      expect(() => getTokenFromQueryString(req)).toThrow(
        new JWTAuthorizationError('Missing "canva_user_token" query parameter')
      );
    });
  });

  describe("When the 'canva_user_token' query parameter does not match the JWT alphabet", () => {
    beforeEach(() => {
      req.query.canva_user_token = "a*b%c";
    });

    it(`Throws a JWTAuthorizationError with message = 'Invalid "canva_user_token" query parameter'`, async () => {
      expect.assertions(1);

      expect(() => getTokenFromQueryString(req)).toThrow(
        new JWTAuthorizationError('Invalid "canva_user_token" query parameter')
      );
    });
  });

  describe("When the 'canva_user_token' query parameter is a token", () => {
    beforeEach(() => {
      req.query.canva_user_token = "JWT";
    });

    it(`Returns the token`, async () => {
      expect.assertions(1);

      expect(getTokenFromQueryString(req)).toEqual("JWT");
    });
  });
});
