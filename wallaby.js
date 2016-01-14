module.exports = function() {
  return {
    files: [
      // PhantomJs Function.bind polyfill
      {pattern: "node_modules/phantomjs-polyfill/bind-polyfill.js", instrument: false},
      {pattern: "node_modules/chai/chai.js", instrument: false},
      {pattern: "src/**/*.js*"}
    ],

    tests: [
      {pattern: "tests/integration/*.js"}
    ],

    env: {
      type: "node"
    },

    preprocessors: {
      "**/*.js": file => require("babel-core").transform(file.content, {sourceMap: true, presets: ["es2015"]})
    },

    testFramework: "mocha"
  };
};
