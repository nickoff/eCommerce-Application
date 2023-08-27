import path from 'path';
import MiniCssPlugin from 'mini-css-extract-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ESLintPlugin from 'eslint-webpack-plugin';
import ForkTsCheckerPlugin from 'fork-ts-checker-webpack-plugin';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
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
        test: /\.module.s?css$/i,
        use: [
          MiniCssPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: {
                exportLocalsConvention: 'camelCaseOnly',
                localIdentName: '[local]_[hash:base64:10]',
                namedExport: true,
              },
            },
          },
          {
            loader: 'sass-loader',
            options: {
              additionalData: '@import "@sass-helpers";',
            },
          },
        ],
      },
      {
        test: /\.s?css$/i,
        exclude: /\.module.s?css$/i,
        use: [
          MiniCssPlugin.loader,
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              additionalData: '@import "@sass-helpers";',
            },
          },
        ],
      },
      {
        test: /\.(png|jpe?g|svg|gif)$/i,
        exclude: /\.element.svg$/i,
        type: 'asset/resource',
      },
      {
        test: /\.element.svg$/i,
        use: 'svg-loader-js',
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [{ from: 'static' }],
    }),
    new MiniCssPlugin({
      filename: isDev ? '[name].css' : '[name].[contenthash].css',
      chunkFilename: isDev ? '[id].css' : '[id].[contenthash].css',
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      favicon: './src/favicon.png',
      minify: !isDev,
    }),
    new ForkTsCheckerPlugin(),
    new ESLintPlugin({
      extensions: ['.tsx', '.ts', '.js'],
      context: 'src',
    }),
  ],
  resolve: {
    plugins: [new TsconfigPathsPlugin()],
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      '@sass-helpers': path.resolve(__dirname, './src/styles/helpers'),
    },
  },
};

export default commonConfig;
