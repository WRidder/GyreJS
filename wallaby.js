module.exports = function () {
  return {
    files: ['tsconfig.json', 'src/**/*.ts'],

    tests: ['tests/*.ts'],

    env: {
      type: 'node',
      runner: 'node'
    },

    testFramework: 'jest'
  };
};
