module.exports = function getWallabyConfiguration() {
  return {
    files: [
      'src/**/*.ts',
      'test/**/*.json'
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
