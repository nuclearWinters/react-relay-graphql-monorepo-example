const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { VanillaExtractPlugin } = require("@vanilla-extract/webpack-plugin");

const isDevelopment = process.env.NODE_ENV !== "production";

module.exports = {
  mode: isDevelopment ? "development" : "production",
  entry: "./src/index.tsx",
  output: {
    path: path.resolve(__dirname, "./build"),
    filename: "bundle.js",
    publicPath: "/",
  },
  module: {
    rules: [
      {
        test: /\.(js|ts)x?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
          },
        ],
      },
      {
        test: /\.vanilla\.css$/i,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: require.resolve("css-loader"),
            options: {
              url: false, // Required as image imports should be handled via JS/TS import statements
            },
          },
        ],
      },
      {
        test: /\.png/,
        type: "asset/resource",
      },
    ],
  },
  resolve: {
    modules: [path.resolve(__dirname, "src"), "node_modules"],
    extensions: [".tsx", ".ts", ".jsx", ".js"],
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      API_GATEWAY: null,
      REALTIME_GATEWAY: null,
    }),
    new MiniCssExtractPlugin({ filename: "styles.css" }),
    new VanillaExtractPlugin(),
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: path.resolve(__dirname, "public", "index.html"),
    }),
    new BundleAnalyzerPlugin(),
  ],
  devServer: {
    port: 8000,
    host: "0.0.0.0",
    historyApiFallback: true,
    hot: true,
  },
};
