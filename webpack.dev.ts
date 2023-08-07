import 'webpack-dev-server';
import { Configuration } from 'webpack';
import commonConfig from './webpack.common';

const devConfig: Configuration = {
  ...commonConfig,
  mode: 'development',
  devtool: 'source-map',
  devServer: {
    historyApiFallback: true,
    hot: true,
    setupExitSignals: true,
  },
};

export default devConfig;
