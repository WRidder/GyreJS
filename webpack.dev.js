const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');
const TypedocWebpackPlugin = require('typedoc-webpack-plugin');

module.exports = merge.smart(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './lib'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          { loader: "ifdef-loader", options: { DEBUG: true } }
        ],
      }
    ]
  },
  plugins: [
    new TypedocWebpackPlugin({
      out: './docs',
      module: 'commonjs',
      target: 'es2015',
      exclude: '**/node_modules/**/*.*',
      experimentalDecorators: true,
      excludeExternals: true,
      name: 'GyreJS'
    }, path.resolve(__dirname, 'src'))
  ],
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'lib'),
    library: "gyrejs-[name[",
    libraryTarget: 'umd',
    umdNamedDefine: true,
    globalObject: 'this'
  }
});
