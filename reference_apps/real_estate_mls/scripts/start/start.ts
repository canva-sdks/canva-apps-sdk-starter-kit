#!/usr/bin/env node
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { AppRunner } from "./app_runner";
import { Context } from "./context";

const appRunner = new AppRunner();

yargs(hideBin(process.argv))
  .version(false)
  .help()
  .option("ngrok", {
    description: "Run backend server via ngrok.",
    type: "boolean",
    // npm swallows command line args instead of forwarding to the script
    default:
      process.env.npm_config_ngrok?.toLocaleLowerCase().trim() === "true",
  })
  .option("use-https", {
    description: "Start local development server on HTTPS.",
    type: "boolean",
    // npm swallows commands line args instead of forwarding to the script
    default:
      process.env.npm_config_use_https?.toLocaleLowerCase().trim() === "true",
  })
  .option("override-frontend-port", {
    description:
      "Port to run the local development server on. Overrides the frontend port set in the .env file.",
    type: "number",
    alias: "p",
  })
  .option("preview", {
    description: "Open the app in Canva.",
    type: "boolean",
    default: false,
  })
  .command(
    "$0",
    "Starts local development",
    () => {},
    (args) => {
      const ctx = new Context(process.env, args);
      appRunner.run(ctx);
    },
  )
  .parse();
