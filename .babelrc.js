module.exports = api => {
  return {
    presets: [
      '@vue/app',
      ['@babel/env', {modules: api.env('test') ? 'commonjs' : false}]
    ],
    plugins: [
      [
        '@babel/transform-runtime',
        {
          regenerator: true
        }
      ]
    ]
  }
}
