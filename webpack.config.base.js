module.exports = {
  module: {
    loaders: [
      { test: /\.js$/, loaders: ["babel-loader"], exclude: /node_modules/ }
    ]
  },
  output: {
    library: "GyreJS",
    libraryTarget: "umd"
  },
  resolve: {
    extensions: ["", ".js"]
  },
  externals: {
    immutable: "Immutable",
    react: "React"
  }
};
