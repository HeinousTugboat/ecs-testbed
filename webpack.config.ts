import * as path from 'path';
import { Configuration, optimize } from 'webpack';
import { unlinkSync as unlink } from 'fs';

const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const rxPaths = require('rxjs/_esm5/path-mapping');

const config: Configuration = {
  context: path.resolve(__dirname, 'src'),
  entry: {
    index: './index.ts',
    pages: './pages.ts'
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
            configFile: path.resolve(__dirname, 'tsconfig.json')
          }
        }]
      }, {
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
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    modules: [path.resolve('./src'), 'node_modules'],
    alias: rxPaths()
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
