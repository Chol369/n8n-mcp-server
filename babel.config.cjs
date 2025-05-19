module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    '@babel/preset-typescript',
  ],
  plugins: [
    ['@babel/plugin-transform-modules-commonjs', { allowTopLevelThis: true }]
  ],
  // Handle MCP SDK and other ESM modules
  overrides: [
    {
      test: [
        './node_modules/@modelcontextprotocol'
      ],
      plugins: [
        '@babel/plugin-transform-modules-commonjs'
      ]
    }
  ]
};
