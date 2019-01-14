const path = require('path');


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
          { loader: "ifdef-loader", options: opts }
        ],
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
    modules: [path.resolve(__dirname, "src"), "node_modules"]
  }
};
