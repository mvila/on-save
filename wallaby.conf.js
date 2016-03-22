module.exports = function getWallabyConfiguration() {
  return {
    files: [
      'src/**/*.ts'
    ],
    tests: [
      'test/**/*.spec.ts'
    ],
    env: {
      type: 'node',
      runer: 'node'
    }
  };
};
