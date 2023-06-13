require("dotenv").config();
const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");
const { DefinePlugin } = require("webpack");
const chalk = require("chalk");

/**
 *
 * @param {Object} [options]
 * @param {string} [options.appEntry=./src/index.tsx]
 * @param {string} [options.backendHost]
 * @param {Object} [options.devConfig]
 * @param {string} options.devConfig.port
 * @param {boolean} [options.devConfig.enableHmr]
 * @param {boolean} [options.devConfig.enableHttps]
 * @param {string} [options.devConfig.appId]
 * @returns {Object}
 */
function buildConfig({
  devConfig,
  appEntry = path.join(__dirname, "src", "index.tsx"),
  backendHost = process.env.CANVA_BACKEND_HOST,
} = {}) {
  const mode = devConfig ? "development" : "production";

  if (!backendHost) {
    console.error(
      chalk.redBright.bold("BACKEND_HOST is undefined."),
      `Refer to "Customizing the backend host" in the README.md for more information.`
    );
    process.exit(-1);
  } else if (backendHost.includes("localhost") && mode === "production") {
    console.error(
      chalk.redBright.bold(
        "BACKEND_HOST should not be set to localhost for production builds!"
      ),
      `Refer to "Customizing the backend host" in the README.md for more information.`
    );
  }

  return {
    mode,
    context: path.resolve(__dirname, "./"),
    entry: {
      app: appEntry,
    },
    target: "web",
    resolve: {
      alias: {
        assets: path.resolve(__dirname, "assets"),
        components: path.resolve(__dirname, "components"),
        utils: path.resolve(__dirname, "utils"),
        styles: path.resolve(__dirname, "styles"),
        src: path.resolve(__dirname, "src"),
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
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  plugins: [
                    require('cssnano')({ preset: 'default' }),
                  ]
                }
              }
            }
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
          include: path.resolve(__dirname, "assets", "icons"),
          use: [
            {
              loader: "@svgr/webpack",
              options: {
                icon: true,
                template: createIconTemplate,
              },
            },
          ],
        },
        {
          test: /\.svg$/,
          exclude: path.resolve(__dirname, "assets", "icons"),
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
        })
      ],
    },
    output: {
      filename: `[name].js`,
      path: path.resolve(__dirname, "dist"),
      clean: true,
    },
    plugins: [
      new DefinePlugin({
        BACKEND_HOST: JSON.stringify(backendHost),
      }),
    ],
    ...buildDevConfig(devConfig),
  };
}

/**
 * Defines the template that @svgr/webpack uses to generate React
 * components for the starter kit's icons.
 *
 * Learn more: https://react-svgr.com/docs/options/#template
 */
function createIconTemplate(variables, { tpl }) {
  return tpl`
${variables.imports};
${variables.interfaces};

const SIZES_PX = {
  tiny: 12,
  small: 16,
  medium: 24,
  large: 32,
}

const DEFAULT_SIZE = "medium";

const ${variables.componentName} = (${variables.props}) => {
  const size = SIZES_PX[props.size] || SIZES_PX[DEFAULT_SIZE];
  return React.cloneElement(${variables.jsx}, { ...props, width: size, height: size });
};
 
${variables.exports};
`;
}

/**
 *
 * @param {Object} [options]
 * @param {string} options.port
 * @param {boolean} [options.enableHmr]
 * @param {boolean} [options.enableHttps]
 * @param {string} [options.appId]
 * @returns {Object|null}
 */
function buildDevConfig(options) {
  if (!options) {
    return null;
  }

  const { port, enableHmr, appId, enableHttps } = options;

  let devServer = {
    server: enableHttps ? "https" : "http",
    historyApiFallback: {
      rewrites: [{ from: /^\/$/, to: "/app.js" }],
    },
    port,
    client: {
      logging: "verbose",
    },
    static: {
      directory: path.resolve(__dirname, "assets"),
      publicPath: "/assets",
    },
  };

  if (enableHmr && appId) {
    const appDomain = `app-${appId}.canva-apps.com`;
    devServer = {
      ...devServer,
      host: "localhost",
      allowedHosts: appDomain,
      headers: {
        "Access-Control-Allow-Origin": `https://${appDomain}`,
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Allow-Private-Network": "true",
      },
    };
  } else {
    if (enableHmr && !appId) {
      console.warn(
        "Attempted to enable HMR without supplying an App ID... Disabling HMR."
      );
    }
    devServer.webSocketServer = false;
  }

  return {
    devtool: "source-map",
    devServer,
  };
}

module.exports = () => buildConfig();

module.exports.buildConfig = buildConfig;
