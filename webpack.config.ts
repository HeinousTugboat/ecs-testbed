import * as path from 'path';
import { Configuration, Entry, RuleSetRule } from 'webpack';
import { unlink } from 'fs';

const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

import baseConfig from './webpack-base.config';

const config: Configuration = {
  ...baseConfig,
  entry: {
    ...baseConfig.entry as Entry,
    pages: './pages.ts'
  },
  mode: 'production',
  module: {
    rules: [
      ...baseConfig.module.rules as RuleSetRule[],
      {
        test: /\.pug$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].html',
            }
          },
          'pug-html-loader'
        ]
      }, {
        test: /\.scss$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].css'
            }
          },
          'extract-loader',
          'css-loader',
          'sass-loader'
        ]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new CopyWebpackPlugin([{from: '../assets'}]),
    { // Removes the bundle that results from compiling pug.
      apply: (compiler) => {
        compiler.hooks.done.tap('AfterEmitPlugin', (stats) => {
          const dest = path.resolve(__dirname, './dist/pages.bundle.js');
          unlink(dest, err => console.log(err ? err : 'Build: ' + dest + ' unlinked!'));
        });
      }
    },
  ],
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/'
  }
};

export default config;
