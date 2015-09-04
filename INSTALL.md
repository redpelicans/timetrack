** fetch **

see [fetch](http://mts.io/2015/04/08/webpack-shims-polyfills/)
$  npm i imports-loader exports-loader -S
plugins: [
  new webpack.ProvidePlugin({
    'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch'
  })
]
`fetch` is now global.
