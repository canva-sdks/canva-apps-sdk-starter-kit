import type { Configuration } from "webpack";
import { DefinePlugin, optimize } from "webpack";
import path from "path";
import TerserPlugin from "terser-webpack-plugin";
import { transform } from "@formatjs/ts-transformer";
import chalk from "chalk";
import { config } from "dotenv";
import { Configuration as DevServerConfiguration } from "webpack-dev-server";

config();

type DevConfig = {
  port: number;
  enableHmr: boolean;
  enableHttps: boolean;
  appOrigin?: string;
  appId?: string; // Deprecated in favour of appOrigin
  certFile?: string;
  keyFile?: string;
};

export function buildConfig({
  devConfig,
  appEntry = path.join(process.cwd(), "src", "index.tsx"),
  backendHost = process.env.CANVA_BACKEND_HOST,
  // For IN_HARNESS, refer to the following docs for more information: https://www.canva.dev/docs/apps/test-harness/
  inHarness = process.env.IN_HARNESS?.toLowerCase() === "true",
}: {
  devConfig?: DevConfig;
  appEntry?: string;
  backendHost?: string;
  inHarness?: boolean;
} = {}): Configuration & DevServerConfiguration {
  const mode = devConfig ? "development" : "production";

  if (!backendHost) {
    console.warn(
      chalk.yellow.bold("BACKEND_HOST is undefined."),
      `If your app requires a backend, refer to "Customizing the backend host" in the README.md for more information.`,
    );
  } else if (backendHost.includes("localhost") && mode === "production") {
    console.error(
      chalk.redBright.bold(
        "BACKEND_HOST should not be set to localhost for production builds!",
      ),
      `Refer to "Customizing the backend host" in the README.md for more information.`,
    );
  }

  return {
    mode,
    context: path.resolve(process.cwd(), "./"),
    entry: inHarness
      ? {
          harness: path.join(process.cwd(), "harness", "harness.tsx"),
          init: path.join(process.cwd(), "harness", "init.ts"),
        }
      : {
          app: appEntry,
        },
    target: "web",
    resolve: {
      alias: {
        styles: path.resolve(process.cwd(), "styles"),
        src: path.resolve(process.cwd(), "src"),
      },
      extensions: [".ts", ".tsx", ".js", ".css", ".svg", ".woff", ".woff2"],
    },
    infrastructureLogging: {
      level: inHarness ? "info" : "none",
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: [
            {
              loader: "ts-loader",
              options: {
                transpileOnly: true,
                getCustomTransformers() {
                  return {
                    before: [
                      transform({
                        overrideIdFn: "[sha512:contenthash:base64:6]",
                      }),
                    ],
                  };
                },
              },
            },
          ],
        },
        {
          test: /\.css$/,
          exclude: /node_modules/,
          use: [
            "style-loader",
            {
              loader: "css-loader",
              options: {
                modules: true,
              },
            },
            {
              loader: "postcss-loader",
              options: {
                postcssOptions: {
                  plugins: [require("cssnano")({ preset: "default" })],
                },
              },
            },
          ],
        },
        {
          test: /\.(png|jpg|jpeg)$/i,
          type: "asset/inline",
        },
        {
          test: /\.(woff|woff2)$/,
          type: "asset/inline",
        },
        {
          test: /\.svg$/,
          oneOf: [
            {
              issuer: /\.[jt]sx?$/,
              resourceQuery: /react/, // *.svg?react
              use: ["@svgr/webpack", "url-loader"],
            },
            {
              type: "asset/resource",
              parser: {
                dataUrlCondition: {
                  maxSize: 200,
                },
              },
            },
          ],
        },
        {
          test: /\.css$/,
          include: /node_modules/,
          use: [
            "style-loader",
            "css-loader",
            {
              loader: "postcss-loader",
              options: {
                postcssOptions: {
                  plugins: [require("cssnano")({ preset: "default" })],
                },
              },
            },
          ],
        },
      ],
    },
    optimization: {
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            format: {
              // Turned on because emoji and regex is not minified properly using default
              // https://github.com/facebook/create-react-app/issues/2488
              ascii_only: true,
            },
          },
        }),
      ],
    },
    output: {
      filename: `[name].js`,
      path: path.resolve(process.cwd(), "dist"),
      clean: true,
    },
    plugins: [
      new DefinePlugin({
        BACKEND_HOST: JSON.stringify(backendHost),
      }),
      // Apps can only submit a single JS file via the Developer Portal
      new optimize.LimitChunkCountPlugin({ maxChunks: 1 }),
    ].filter(Boolean),
    ...buildDevConfig(devConfig),
  };
}

function buildDevConfig(options?: DevConfig): {
  devtool?: string;
  devServer?: DevServerConfiguration;
} {
  if (!options) {
    return {};
  }

  const { port, enableHmr, appOrigin, enableHttps, certFile, keyFile } =
    options;
  const host = "localhost";

  let devServer: DevServerConfiguration = {
    server: enableHttps
      ? {
          type: "https",
          options: {
            cert: certFile,
            key: keyFile,
          },
        }
      : "http",
    host,
    allowedHosts: [host],
    historyApiFallback: {
      rewrites: [{ from: /^\/$/, to: "/app.js" }],
    },
    port,
    client: {
      logging: "verbose",
    },
  };

  if (enableHmr && appOrigin) {
    devServer = {
      ...devServer,
      allowedHosts: [host, new URL(appOrigin).hostname],
      headers: {
        "Access-Control-Allow-Origin": appOrigin,
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Allow-Private-Network": "true",
      },
    };
  } else {
    if (enableHmr && !appOrigin) {
      console.warn(
        "Attempted to enable Hot Module Replacement (HMR) without configuring App Origin... Disabling HMR.",
      );
    }
    devServer.webSocketServer = false;
  }

  return {
    devtool: "source-map",
    devServer,
  };
}

export default buildConfig;
