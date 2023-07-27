#!/usr/bin/env node
require("dotenv").config();
const chalk = require("chalk");
const { buildConfig } = require("../webpack.config");
const fs = require("fs");
const ngrok = require("ngrok");
const nodemon = require("nodemon");
const path = require("path");
const Table = require("cli-table3");
const webpack = require("webpack");
const WebpackDevServer = require("webpack-dev-server");
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const { argv } = yargs(hideBin(process.argv))
  .option("ngrok", {
    description: "Run backend server via ngrok.",
    type: "boolean",
  })
  .option("use-https", {
    description: "Start local development server on HTTPS.",
    type: "boolean",
  });
const { maybeCreateCertificates } = require("./ssl");

const ROOT_DIR = path.join(__dirname, "..");
const SRC_DIR = path.join(ROOT_DIR, "src");
const EXAMPLES_DIR = path.join(ROOT_DIR, "examples");

const {
  CANVA_FRONTEND_PORT,
  CANVA_BACKEND_PORT,
  CANVA_BACKEND_HOST,
  CANVA_APP_ID,
  CANVA_HMR_ENABLED,
} = process.env;

const getFrontendUrl = (protocol) =>
  `${protocol}://localhost:${CANVA_FRONTEND_PORT}`;

if (!fs.existsSync(EXAMPLES_DIR)) {
  throw new Error(`Directory does not exist: ${EXAMPLES_DIR}`);
}

if (!CANVA_FRONTEND_PORT) {
  throw new Error("CANVA_FRONTEND_PORT environment variable is not defined");
}

if (!CANVA_BACKEND_PORT) {
  throw new Error("CANVA_BACKEND_PORT environment variable is not defined");
}

const [example] = argv._;

const SHOULD_RUN_NGROK = argv.ngrok || process.env.npm_config_ngrok;
const SHOULD_ENABLE_HTTPS = argv.useHttps || process.env.npm_config_use_https;
const HMR_ENABLED = CANVA_HMR_ENABLED?.toLowerCase().trim() === "true";
const APP_ID = CANVA_APP_ID?.toLowerCase().trim() ?? "";

const BACKEND_URL = `http${
  SHOULD_ENABLE_HTTPS ? "s" : ""
}://localhost:${CANVA_BACKEND_PORT}`;

if (HMR_ENABLED && APP_ID.length === 0) {
  throw new Error(
    "CANVA_HMR_ENABLED environment variable is TRUE, but CANVA_APP_ID is not set. Refer to the instructions in the README.md on configuring HMR."
  );
}

const ENTRY_DIR = example ? path.join(EXAMPLES_DIR, example) : SRC_DIR;

async function start() {
  if (!fs.existsSync(ENTRY_DIR)) {
    throw new Error(`Directory does not exist: ${ENTRY_DIR}`);
  }

  console.log(
    `Starting development server for`,
    chalk.greenBright.bold(ENTRY_DIR)
  );
  console.log("");

  if (!HMR_ENABLED) {
    console.log(
      "HMR not enabled. To enable it, please refer to the instructions in the",
      chalk.greenBright.bold("README.md")
    );
    console.log("");
  }

  const table = new Table();

  const frontendEntry = path.join(ENTRY_DIR, "index.tsx");

  if (!fs.existsSync(frontendEntry)) {
    throw new Error(
      `Entry point for frontend does not exist: ${frontendEntry}`
    );
  }

  let backendHost = CANVA_BACKEND_HOST;
  if (!backendHost || backendHost.trim() === "") {
    backendHost = BACKEND_URL;
  }

  let certs;
  if (SHOULD_ENABLE_HTTPS) {
    console.log("Generating SSL Certificates...");
    certs = await maybeCreateCertificates();
    console.log("HTTPS will be enabled. Certificates generated.");
  }

  const runtimeWebpackConfig = buildConfig({
    appEntry: frontendEntry,
    backendHost,
    devConfig: {
      port: CANVA_FRONTEND_PORT,
      enableHmr: HMR_ENABLED,
      appId: APP_ID,
      enableHttps: SHOULD_ENABLE_HTTPS,
      ...certs,
    },
  });

  const developerBackendEntry = path.join(ENTRY_DIR, "backend", "server.ts");
  if (fs.existsSync(developerBackendEntry)) {
    if (!CANVA_APP_ID) {
      throw new Error(
        `'CANVA_APP_ID' environment variable is undefined. Refer to the instructions in the README.md on starting a backend example.`
      );
    }

    await new Promise((resolve) => {
      nodemon({
        script: developerBackendEntry,
        ext: "ts",
        env: {
          SHOULD_ENABLE_HTTPS,
          HTTPS_CERT_FILE: certs?.certFile,
          HTTPS_KEY_FILE: certs?.keyFile,
        },
      });

      nodemon.on("start", resolve);

      nodemon.on("crash", async () => {
        console.log();
        console.log("Shutting down local server.");
        console.log();

        await server.stop();
        process.exit(1);
      });
    });

    let url;
    try {
      url = SHOULD_RUN_NGROK
        ? await ngrok.connect(CANVA_BACKEND_PORT)
        : BACKEND_URL;
      table.push(["Base URL (Backend)", chalk.cyan(url)]);
    } catch (error) {
      console.log(chalk.bold.bgRed("Error:"), "Unable to start ngrok server.");
    }
  }

  const compiler = webpack(runtimeWebpackConfig);
  const server = new WebpackDevServer(runtimeWebpackConfig.devServer, compiler);
  await server.start();

  table.push([
    "Development URL (Frontend)",
    chalk.cyan(getFrontendUrl(runtimeWebpackConfig.devServer.server.type)),
  ]);

  console.log(table.toString());
  console.log("");

  if (SHOULD_RUN_NGROK) {
    console.log(
      chalk.bold.bgYellow("Warning:"),
      `ngrok exposes a local port via a public URL. Be mindful of what's exposed and shut down the server when it's not in use.`
    );
    console.log("");
  }

  console.log(
    `${chalk.blue.bold(
      "Note:"
    )} For instructions on how to set up the app via the Developer Portal, see ${chalk.bold(
      path.join(ROOT_DIR, "README.md")
    )}.`
  );

  console.log("");
}

start();
