module.exports = (api) => {
  // Check if running in test environment (NODE_ENV is set to 'test' by run-tests.js)
  const isTest = api.env('test');

  const presets = [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    '@babel/preset-typescript',
  ];

  const plugins = []; // Keep only one declaration

  // Only add the CJS transform plugin if NOT in test environment
  if (!isTest) {
    plugins.push(['@babel/plugin-transform-modules-commonjs']);
  }

  // For Jest (test environment), ensure node_modules are not completely ignored
  // if needed, but rely on transformIgnorePatterns in jest.config.cjs primarily.
  // This is more of a fallback if transformIgnorePatterns isn't sufficient.
  const ignore = isTest ? [] : [/node_modules/]; 

  return {
    presets,
    plugins,
    ignore, // Add ignore configuration back
  };
};
