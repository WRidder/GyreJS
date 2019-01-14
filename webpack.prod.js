const webpack = require('webpack');
const merge = require('webpack-merge');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const common = require('./webpack.common.js');
const path = require('path');

module.exports = merge(common, {
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
