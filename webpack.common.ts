import path from 'path';
import MiniCssPlugin from 'mini-css-extract-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ESLintPlugin from 'eslint-webpack-plugin';
import ForkTsCheckerPlugin from 'fork-ts-checker-webpack-plugin';
import { resolveTsAliases } from 'resolve-ts-aliases';
import { Configuration } from 'webpack';

const isDev = process.env.NODE_ENV !== 'production';

const commonConfig: Configuration = {
  entry: './src/index.ts',
  output: {
    filename: isDev ? '[name].js' : '[name].[contenthash].js',
    assetModuleFilename: 'public/[name].[contenthash][ext][query]',
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/i,
        use: 'ts-loader',
      },
      {
        test: /\.s?css$/i,
        use: [
          MiniCssPlugin.loader,
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              additionalData: `@import "./src/styles/helpers";`,
            },
          },
        ],
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.svg$/i,
        use: 'svg-loader-js',
      },
    ],
  },
  plugins: [
    new MiniCssPlugin({
      filename: isDev ? '[name].css' : '[name].[contenthash].css',
      chunkFilename: isDev ? '[id].css' : '[id].[contenthash].css',
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      minify: !isDev,
    }),
    new ForkTsCheckerPlugin(),
    new ESLintPlugin({
      extensions: ['.tsx', '.ts', '.js'],
      context: 'src',
    }),
  ],
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: resolveTsAliases(path.resolve(__dirname, 'tsconfig.json')),
  },
};

export default commonConfig;
