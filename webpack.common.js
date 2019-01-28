const path = require('path');
const webpack = require('webpack');

// define preprocessor variables
const ifDefOpts = {
  "ifdef-verbose": false,       // add this for verbose output
  "ifdef-triple-slash": false  // add this to use double slash comment instead of default triple slash
};

module.exports = {
  entry: {
    main: './src/index.ts'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          { loader: 'ts-loader'},
          { loader: "ifdef-loader", options: { TRACING: false } }
        ],
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      VERSION: JSON.stringify(require("./package.json").version)
    })
  ],
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
    modules: [path.resolve(__dirname, "src"), "node_modules"]
  }
};
