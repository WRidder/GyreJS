const path = require('path');

module.exports = {
  entry: {
    main: './src/index.ts',
    ecworker: './src/index_ecworker.ts',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
    modules: [path.resolve(__dirname, "src"), "node_modules"]
  }
};
