import type { Configuration } from "webpack";
import { DefinePlugin, optimize } from "webpack";
import * as path from "path";
import * as TerserPlugin from "terser-webpack-plugin";
import { transform } from "@formatjs/ts-transformer";
import * as chalk from "chalk";
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
}: {
  devConfig?: DevConfig;
  appEntry?: string;
  backendHost?: string;
} = {}): Configuration & DevServerConfiguration {
  const mode = devConfig ? "development" : "production";

  if (!backendHost) {
    console.error(
      chalk.redBright.bold("BACKEND_HOST is undefined."),
      `Refer to "Customizing the backend host" in the README.md for more information.`,
    );
    process.exit(-1);
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
    entry: {
      app: appEntry,
    },
    target: "web",
    resolve: {
      alias: {
        assets: path.resolve(process.cwd(), "assets"),
        utils: path.resolve(process.cwd(), "utils"),
        styles: path.resolve(process.cwd(), "styles"),
        src: path.resolve(process.cwd(), "src"),
      },
      extensions: [".ts", ".tsx", ".js", ".css", ".svg", ".woff", ".woff2"],
    },
    infrastructureLogging: {
      level: "none",
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
      // Apps can only submit a single JS file via the developer portal
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

  const { port, enableHmr, appOrigin, appId, enableHttps, certFile, keyFile } =
    options;

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
    host: "localhost",
    historyApiFallback: {
      rewrites: [{ from: /^\/$/, to: "/app.js" }],
    },
    port,
    client: {
      logging: "verbose",
    },
    static: {
      directory: path.resolve(process.cwd(), "assets"),
      publicPath: "/assets",
    },
  };

  if (enableHmr && appOrigin) {
    devServer = {
      ...devServer,
      allowedHosts: new URL(appOrigin).hostname,
      headers: {
        "Access-Control-Allow-Origin": appOrigin,
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Allow-Private-Network": "true",
      },
    };
  } else if (enableHmr && appId) {
    // Deprecated - App ID should not be used to configure HMR in the future and can be safely removed
    // after a few months.

    console.warn(
      "Enabling Hot Module Replacement (HMR) with an App ID is deprecated, please see the README.md on how to update.",
    );

    const appDomain = `app-${appId.toLowerCase().trim()}.canva-apps.com`;
    devServer = {
      ...devServer,
      allowedHosts: appDomain,
      headers: {
        "Access-Control-Allow-Origin": `https://${appDomain}`,
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
