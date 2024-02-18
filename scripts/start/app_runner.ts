import { Context } from "./context";
import * as chalk from "chalk";
import { buildConfig } from "../../webpack.config";
import * as ngrok from "ngrok";
import * as nodemon from "nodemon";
import * as Table from "cli-table3";
import * as webpack from "webpack";
import * as WebpackDevServer from "webpack-dev-server";
import { createOrRetrieveCertificate, Certificate } from "../ssl/ssl";

export class AppRunner {
  async run(ctx: Context) {
    console.log(
      `Starting development server for ${chalk.greenBright.bold(
        ctx.entryDir
      )}\n`
    );

    if (!ctx.hmrEnabled) {
      console.log(
        `HMR not enabled. To enable it, please refer to the instructions in the ${chalk.greenBright.bold(
          "README.md"
        )}\n`
      );
    }

    let cert: Certificate | undefined;
    if (ctx.httpsEnabled) {
      try {
        cert = await createOrRetrieveCertificate();
      } catch (error) {
        console.log(
          chalk.bold.bgRed("Error:"),
          "Unable to generate SSL certificate."
        );
        throw error;
      }
    }

    const table = new Table();

    const server = await this.runWebpackDevServer(ctx, table, cert);

    await this.maybeRunBackendServer(ctx, table, cert, server);

    console.log(table.toString(), "\n");

    console.log(
      `${chalk.blue.bold(
        "Note:"
      )} For instructions on how to set up the app via the Developer Portal, see the ${chalk.greenBright.bold(
        "README.md"
      )}.\n`
    );
  }

  private readonly maybeRunBackendServer = async (
    ctx: Context,
    table: Table.Table,
    cert: Certificate | undefined,
    server: WebpackDevServer
  ) => {
    if (!ctx.developerBackendEntryPath) {
      return;
    }

    // App ID must be set when running a server
    if (!ctx.appId) {
      throw new Error(
        `'CANVA_APP_ID' environment variable is undefined. Refer to the instructions in the README.md on starting a backend example.`
      );
    }

    await new Promise((resolve) => {
      nodemon({
        script: ctx.developerBackendEntryPath,
        ext: "ts",
        env: {
          SHOULD_ENABLE_HTTPS: ctx.httpsEnabled,
          HTTPS_CERT_FILE: cert?.certFile || "",
          HTTPS_KEY_FILE: cert?.keyFile || "",
        },
      });

      nodemon.on("start", resolve);

      nodemon.on("crash", async () => {
        console.log(chalk.bold.bgRed("Shutting down local server.\n"));

        await server.stop();
        process.exit(1);
      });
    });

    if (ctx.ngrokEnabled) {
      console.log(
        chalk.bold.bgYellow("Warning:"),
        `ngrok exposes a local port via a public URL. Be mindful of what's exposed and shut down the server when it's not in use.\n`
      );
    }

    let url = ctx.backendUrl;
    if (ctx.ngrokEnabled) {
      try {
        url = await ngrok.connect(ctx.backendPort);
      } catch (error) {
        console.log(
          chalk.bold.bgRed("Error:"),
          "Unable to start ngrok server."
        );
      }
    }

    table.push(["Base URL (Backend)", chalk.cyan(url)]);
  };

  private readonly runWebpackDevServer = async (
    ctx: Context,
    table: Table.Table,
    cert: Certificate | undefined
  ): Promise<WebpackDevServer> => {
    const runtimeWebpackConfig = buildConfig({
      appEntry: ctx.frontendEntryPath,
      backendHost: ctx.backendHost,
      devConfig: {
        port: ctx.frontendPort,
        enableHmr: ctx.hmrEnabled,
        appId: ctx.appId,
        enableHttps: ctx.httpsEnabled,
        ...cert,
      },
    });

    const compiler = webpack(runtimeWebpackConfig);
    const server = new WebpackDevServer(
      runtimeWebpackConfig.devServer,
      compiler
    );
    await server.start();

    table.push(["Development URL (Frontend)", chalk.cyan(ctx.frontendUrl)]);

    return server;
  };
}
