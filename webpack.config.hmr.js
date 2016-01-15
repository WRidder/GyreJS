const path = require("path");

module.exports = {
  entry: path.join(__dirname, "./example/index.js"),
  output: {
    path: __dirname,
    filename: "bundle.js",
    publicPath: "/static/"
  },
  devtool: "source-map",
  module: {
    loaders: [
      { test: /\.js$/, loaders: ["babel-loader"], exclude: /node_modules/ },
      { test: /\.css$/, loader: "style-loader!css-loader" },
      {
        test: /\.scss$/,
        loaders: ["style", "css", "sass"]
      }
    ]
  }
};
