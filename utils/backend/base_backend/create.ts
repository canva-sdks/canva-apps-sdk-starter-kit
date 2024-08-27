/* eslint-disable no-console */
import * as express from "express";
import * as http from "http";
import * as https from "https";
import * as fs from "fs";
import type { Request, Response, NextFunction } from "express";
import debug from "debug";

const serverDebug = debug("server");

interface BaseServer {
  app: express.Express;

  /**
   * Starts the server on the address or port provided
   * @param address port number or string address or if left undefined express defaults to port 3000
   */
  start: (address: number | string | undefined) => void;
}

/**
 * createBaseServer instantiates a customised express server with:
 * - json body handling
 * - health check endpoint
 * - catchall endpoint
 * - error handler catch route
 * - process termination handling
 * - debug logging - prefix starting your server with `DEBUG=server npm run XXX`
 *
 * @returns BaseServer object containing the express app and a start function
 */
export function createBaseServer(router: express.Router): BaseServer {
  const SHOULD_ENABLE_HTTPS = process.env?.SHOULD_ENABLE_HTTPS === "true";
  const HTTPS_CERT_FILE = process.env?.HTTPS_CERT_FILE;
  const HTTPS_KEY_FILE = process.env?.HTTPS_KEY_FILE;

  const app = express();
  app.use(express.json());

  // It can help to provide an extra layer of obsecurity to reduce server fingerprinting.
  app.disable("x-powered-by");

  // Health check endpoint
  app.get("/healthz", (req, res: Response) => {
    res.sendStatus(200);
  });

  // logging middleware
  app.use((req: Request, res: Response, next: NextFunction) => {
    serverDebug(`${new Date().toISOString()}: ${req.method} ${req.url}`);
    next();
  });

  // Custom routes router
  app.use(router);

  // catch all router
  app.all("*", (req, res) => {
    res.status(404).send({
      error: `unhandled '${req.method}' on '${req.url}'`,
    });
  });

  // default error handler
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({
      error: "something went wrong",
    });
  });

  let server;
  if (SHOULD_ENABLE_HTTPS) {
    if (!HTTPS_CERT_FILE || !HTTPS_KEY_FILE) {
      throw new Error(
        "Looks like you're running the example with --use-https flag, but SSL certificates haven't been generated. Please remove the .ssl/ folder and re-run the command again.",
      );
    }

    server = https.createServer(
      {
        key: fs.readFileSync(HTTPS_KEY_FILE),
        cert: fs.readFileSync(HTTPS_CERT_FILE),
      },
      app,
    );
  } else {
    server = http.createServer(app);
  }

  return {
    app,
    start: (address: number | string | undefined) => {
      console.log(`Listening on '${address}'`);
      server.listen(address);
      process.on("SIGTERM", () => {
        serverDebug("SIGTERM signal received: closing HTTP server");
        server.close(() => {
          serverDebug("HTTP server closed");
        });
      });
    },
  };
}
