const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CleanTerminalPlugin = require("clean-terminal-webpack-plugin");
const EsLingWebpackPlugin = require("eslint-webpack-plugin");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const DotEnv = require("dotenv-webpack");
const path = require("path");
const WebpackBar = require("webpackbar");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const { NormalModuleReplacementPlugin } = require("webpack");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

function getEnvFileName(env) {
  if (!env) return ".env.development";

  switch (true) {
    case !!env.test:
      return ".env.test";
    case !!env.local:
      return ".env.local";
    case !!env.development:
      return ".env.development";
    case !!env.staging:
      return ".env.staging";
    case !!env.production:
      return ".env.production";
    default:
      return ".env.production";
  }
}

let target = "web";

const plugins = (env, mode) => {
  const basePlugins = [
    new HTMLWebpackPlugin({
      title: "Retail Hub",
      template: "./src/index.ejs",
      favicon: "./src/assets/images/logo.ico",
      minify: {
        collapseWhitespace: true,
        removeComments: true,
        useShortDoctype: true,
      },
    }),
    new MiniCssExtractPlugin(),
    new DotEnv({
      path: path.resolve(__dirname, getEnvFileName(env)),
    }),
    new EsLingWebpackPlugin({
      context: "./src",
    }),
    new NormalModuleReplacementPlugin(/^pdfjs-dist$/, (resource) => {
      resource.request = path.join(
        __dirname,
        "./node_modules/pdfjs-dist/webpack"
      );
    }),
    new NodePolyfillPlugin(),
    new CopyPlugin({ patterns: [{ from: "robots.txt", to: "robots.txt" }] }),
  ];

  if (mode === "development" && !env.production) {
    return [
      ...basePlugins,
      new WebpackBar({
        name: "Retail Hub",
        profile: true,
      }),
      new CleanTerminalPlugin(),
      new BundleAnalyzerPlugin({
        openAnalyzer: false,
      }),
    ];
  }

  if (mode === "production" || env.production)
    basePlugins.push(new CleanWebpackPlugin());

  return basePlugins;
};

const jsLoaders = () => {
  return [
    {
      loader: "babel-loader",
    },
  ];
};

const defaultDevServer = {
  contentBase: "./dist",
  hot: true,
  port: 3000,
  open: true,
  overlay: true,
  compress: true,
  historyApiFallback: true,
  progress: true,
  clientLogLevel: "warning",
};

const https = {
  key: "localhost-key.pem",
  cert: "localhost.pem",
};

module.exports = (env, options) => {
  if (!!env.production) target = "browserslist";

  const devServer = options.https
    ? { ...defaultDevServer, https }
    : defaultDevServer;

  return {
    mode: options.mode || "production",
    cache: {
      type: "filesystem",
    },
    target,
    devtool:
      options.mode === "production" || !!env.production ? false : "source-map",
    entry: "./src/index.js",
    output: {
      filename: "bundle.[contenthash].js",
      chunkFilename: "[contenthash].js",
      path: path.resolve(__dirname, "build"),
      assetModuleFilename: "images/[hash][ext][query]",
      publicPath: "/",
    },
    module: {
      rules: [
        {
          test: /\.(png|jpe?g|gif|svg|webp|pdf)$/i,
          type: "asset/resource",
        },
        {
          test: /\.ico$/,
          loader: "file-loader",
        },
        {
          test: /\.(s[ac]|c)ss$/i,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: { publicPath: "" },
            },
            "css-loader",
            "sass-loader",
          ],
        },

        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: jsLoaders(env),
        },
        {
          test: /\.(woff|woff2|ttf|otf|eot)$/,
          type: "asset/resource",
          generator: {
            filename: "fonts/[name]-[hash][ext]",
          },
        },
        {
          test: /\.mp4$/,
          use: "file-loader?name=videos/[name].[ext]",
        },
      ],
    },
    optimization: {
      minimize: !!env.production || options.mode === "production",
      splitChunks: {
        chunks: "async",
        minRemainingSize: 0,
        maxSize: 60000,
        minChunks: 1,
        maxAsyncRequests: 30,
        maxInitialRequests: 30,
        enforceSizeThreshold: 50000,
        cacheGroups: {
          defaultVendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
            reuseExistingChunk: true,
          },
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
        },
      },
    },
    performance: {
      maxEntrypointSize: 1024000,
      maxAssetSize: 1024000,
    },
    plugins: plugins(env, options.mode),
    devServer,
    resolve: {
      extensions: [".js", ".jsx"],
      alias: {
        "@assets": path.resolve(__dirname, "src/assets"),
        "@components": path.resolve(__dirname, "src/components/"),
        "@constants": path.resolve(__dirname, "src/constants/"),
        "@colors": path.resolve(__dirname, "src/constants/colors"),
        "@ducks": path.resolve(__dirname, "src/ducks"),
        "@routes": path.resolve(__dirname, "src/constants/routes"),
        "@icons": path.resolve(__dirname, "src/icons/icons"),
        "@utils": path.resolve(__dirname, "src/utils/"),
        "@api": path.resolve(__dirname, "src/api/"),
      },
    },
    stats: "minimal",
  };
};
