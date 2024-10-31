const path = require('path');
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  entry: {
    main: './src/scripts/main.js',
    report: './src/scripts/report.js',
  },
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
    filename: "scripts/[name].[contenthash:8].js",
  },
  plugins: [new HtmlWebpackPlugin({
    template: "src/index.html",
    chunks:['main'],
    inject: false
  }),new HtmlWebpackPlugin({
    filename: "report.html",
    template: "src/report.html",
    chunks:['report'],
    inject: false
  }), new MiniCssExtractPlugin({
    filename: "style/[name].[contenthash:8].css",
    chunkFilename: "style/[name].[contenthash:8].chunk.css"
  })],
  module:{
    rules: [{
      test: /\.css$/,
      use: [MiniCssExtractPlugin.loader, 'css-loader']
    }]
  },
  optimization: {
    minimizer: [
      `...`,
      new CssMinimizerPlugin()
    ],
  },
  devServer: {
    compress: true,
    historyApiFallback: true,
    open: true,
    compress: true,
    port: 9000,
  }
};