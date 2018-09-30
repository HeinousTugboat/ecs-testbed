import * as path from 'path';
import { Configuration, optimize, HotModuleReplacementPlugin, NoEmitOnErrorsPlugin } from 'webpack';

const rxPaths = require('rxjs/_esm5/path-mapping');

const config: Configuration = {
  context: path.resolve(__dirname, 'src'),
  entry: {
    index: './index.ts',
  },
  devtool: 'inline-source-map',
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [{
          loader: 'ts-loader',
          options: {
            configFile: path.resolve(__dirname, 'src/tsconfig.json')
          }
        }]
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    modules: [path.resolve('./src'), 'node_modules'],
    alias: rxPaths()
  },
  plugins: [
    new optimize.ModuleConcatenationPlugin(),
    new HotModuleReplacementPlugin(),
    new NoEmitOnErrorsPlugin()
  ],
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'public'),
    publicPath: '/'
  }
};

export default config;
