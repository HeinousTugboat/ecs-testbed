import express, { Request, Response } from 'express';
import * as path from 'path';
import webpack from 'webpack';
import webpackConfig from './webpack-server.config';
const app = express();

// const pug = require('pug');
const sass = require('node-sass-middleware');
const bodyParser = require('body-parser');
const webpackDev = require('webpack-dev-middleware');
const webpackHMR = require('webpack-hot-middleware');

const compiler = webpack(webpackConfig);

app.set('view engine', 'pug');

app.use(webpackDev(compiler, {
  noInfo: true,
  publicPath: webpackConfig!.output!.publicPath // tslint:disable-line no-non-null-assertion
}));

app.use(webpackHMR(compiler));

app.use('/css', sass({
  src: path.join(__dirname, 'scss'),
  dest: path.join(__dirname, 'public/css'),
  // debug: true,
  outputStyle: 'nested'
}));

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static('public'));

app.get('/', (req: Request, res: Response) => res.render('index'));
app.listen(3000, () => console.log('Testbed backend started on port 3000.'));
