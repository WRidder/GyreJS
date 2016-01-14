const path = require("path");

module.exports = {
  entry: path.join(__dirname, "./example/index.js"),
  output: {
    path: __dirname,
    filename: "bundle.js",
    publicPath: "/static/"
  },
  module: {
    loaders: [
      { test: /\.js$/, loaders: ["babel-loader"], exclude: /node_modules/ }
    ]
  }
};
