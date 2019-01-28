const webpack = require('webpack');
const merge = require('webpack-merge');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const common = require('./webpack.common.js');
const path = require('path');

const cfg = merge(common, {
  mode: 'production',
  devtool: 'source-map',
  plugins: [
    new UglifyJSPlugin({
      sourceMap: true
    }),
    //new CleanWebpackPlugin(['dist']),
    new webpack.DefinePlugin({'process.env.NODE_ENV': JSON.stringify('production')}),
  ],
  output: {
    filename: '[name].min.js',
    path: path.resolve(__dirname, 'lib'),
    library: "gyrejs-[name]",
    libraryTarget: 'umd',
    umdNamedDefine: true,
    globalObject: 'this'
  }
});

const cfgTracing = merge.smart(cfg, {
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          { loader: "ifdef-loader", options: { TRACING: true } }
        ],
      }
    ]
  },
  output: {
    filename: 'tracing/[name].min.js',
  }
});

module.exports = [cfg, cfgTracing];
