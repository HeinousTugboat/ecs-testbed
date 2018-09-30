import * as path from 'path';
import { Configuration, optimize, Entry, RuleSetRule } from 'webpack';
import { unlinkSync as unlink } from 'fs';

const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

import baseConfig from './webpack-server.config';

const config: Configuration = {
  ...baseConfig,
  entry: {
    ...baseConfig.entry as Entry,
    pages: './pages.ts'
  },
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
    new optimize.ModuleConcatenationPlugin(),
    {
      apply: (compiler) => {
        compiler.hooks.done.tap('AfterEmitPlugin', (stats) => {
          const dest = path.resolve(__dirname, './dist/pages.bundle.js');
          unlink(dest);
          console.log('build: ' + dest + ' unlinked!');
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
