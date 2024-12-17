/* eslint-disable no-console */
import type { Context } from "./context";
import * as chalk from "chalk";
import { buildConfig } from "../../webpack.config.cjs";
import * as ngrok from "@ngrok/ngrok";
import * as nodemon from "nodemon";
import * as Table from "cli-table3";
import * as webpack from "webpack";
import * as WebpackDevServer from "webpack-dev-server";
import * as open from "open";
import { generatePreviewUrl } from "@canva/cli";
import type { Certificate } from "../ssl/ssl";
import { createOrRetrieveCertificate } from "../ssl/ssl";

export const infoChalk = chalk.blue.bold;
export const warnChalk = chalk.bgYellow.bold;
export const errorChalk = chalk.bgRed.bold;
export const highlightChalk = chalk.greenBright.bold;
export const linkChalk = chalk.cyan;

export class AppRunner {
  async run(ctx: Context) {
    console.log(
      infoChalk("Info:"),
      `Starting development server for ${highlightChalk(ctx.entryDir)}\n`,
    );

    if (!ctx.hmrEnabled) {
      console.log(
        `${infoChalk(
          "Note:",
        )} Hot Module Replacement (HMR) not enabled. To enable it, please refer to the instructions in the ${highlightChalk(
          "README.md",
        )}\n`,
      );
    }

    let cert: Certificate | undefined;
    if (ctx.httpsEnabled) {
      try {
        cert = await createOrRetrieveCertificate();
      } catch (err) {
        console.log(
          errorChalk("Error:"),
          "Unable to generate SSL certificate.",
        );
        throw err;
      }
    }

    const table = new Table({
      colWidths: [30, 80],
      wordWrap: true,
      wrapOnWordBoundary: true,
    });

    const server = await this.runWebpackDevServer(ctx, table, cert);

    await this.maybeRunBackendServer(ctx, table, cert, server);

    await this.generateAndOpenPreviewUrl(table);

    console.log(table.toString(), "\n");

    console.log(
      `${infoChalk(
        "Note:",
      )} For instructions on how to set up the app via the Developer Portal, see the ${highlightChalk(
        "README.md",
      )}.\n`,
    );
  }

  private readonly maybeRunBackendServer = async (
    ctx: Context,
    table: Table.Table,
    cert: Certificate | undefined,
    webpackDevServer: WebpackDevServer,
  ) => {
    if (!ctx.developerBackendEntryPath) {
      return;
    }

    // App ID must be set when running a backend example
    if (!ctx.appId) {
      console.log(
        errorChalk("Error:"),
        `'CANVA_APP_ID' environment variable is undefined. Refer to the instructions in the ${highlightChalk(
          "README.md",
        )} on starting a backend example.`,
      );
      throw new Error("'CANVA_APP_ID' env variable not set.");
    }

    await new Promise((resolve) => {
      const nodemonServer = nodemon({
        script: ctx.developerBackendEntryPath,
        ext: "ts",
        env: {
          SHOULD_ENABLE_HTTPS: ctx.httpsEnabled,
          HTTPS_CERT_FILE: cert?.certFile || "",
          HTTPS_KEY_FILE: cert?.keyFile || "",
        },
      });

      nodemonServer.on("start", resolve);

      nodemonServer.on("crash", async () => {
        console.log(errorChalk("Shutting down local server.\n"));

        await webpackDevServer.stop();
        process.exit(1);
      });
    });

    if (ctx.ngrokEnabled) {
      console.log(
        warnChalk("Warning:"),
        `ngrok exposes a local port via a public URL. Be mindful of what's exposed and shut down the server when it's not in use.\n`,
      );
    }

    let url = ctx.backendUrl;
    if (ctx.ngrokEnabled) {
      try {
        const ngrokListener = await ngrok.forward({
          addr: ctx.backendPort,
          // requires an `NGROK_AUTHTOKEN` env var to be set
          authtoken_from_env: true,
        });
        url = ngrokListener.url() ?? url;
      } catch (err) {
        console.log(
          errorChalk("Error:"),
          `Unable to start ngrok server: ${err}`,
        );
      }
    }

    table.push(["Base URL (Backend)", linkChalk(url)]);
  };

  private readonly runWebpackDevServer = async (
    ctx: Context,
    table: Table.Table,
    cert: Certificate | undefined,
  ): Promise<WebpackDevServer> => {
    const runtimeWebpackConfig = buildConfig({
      appEntry: ctx.frontendEntryPath,
      backendHost: ctx.backendHost,
      devConfig: {
        port: ctx.frontendPort,
        enableHmr: ctx.hmrEnabled,
        appId: ctx.appId,
        appOrigin: ctx.appOrigin,
        enableHttps: ctx.httpsEnabled,
        ...cert,
      },
    });

    const compiler = webpack(runtimeWebpackConfig);
    const server = new WebpackDevServer(
      runtimeWebpackConfig.devServer,
      compiler,
    );
    await server.start();

    table.push(["Development URL (Frontend)", linkChalk(ctx.frontendUrl)]);

    return server;
  };

  /**
   * Calls the Canva CLI to generate a preview URL for the app
   */
  private readonly generateAndOpenPreviewUrl = async (table: Table.Table) => {
    const previewCellHeader = { content: "Preview your app in Canva" };

    const generatePreviewResult = await generatePreviewUrl();

    if (!generatePreviewResult.success) {
      table.push([
        previewCellHeader,
        { content: warnChalk(generatePreviewResult.message) },
      ]);
      return;
    }

    table.push([
      previewCellHeader,
      { content: "Preview URL", href: generatePreviewResult.data },
    ]);

    open(generatePreviewResult.data);
  };
}
