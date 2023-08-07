import { Configuration } from 'webpack';
import TerserPlugin from 'terser-webpack-plugin';
import commonConfig from './webpack.common';

const prodConfig: Configuration = {
  ...commonConfig,
  mode: 'production',
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          format: {
            comments: false,
          },
        },
      }),
    ],
  },
};

export default prodConfig;
