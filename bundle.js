var webpack = require('webpack');
var webpackConfig = require('./webpack.config');
var WebpackDevServer = require('webpack-dev-server');

module.exports = function() {
  var compiler = webpack(webpackConfig);

  var serverConfig = {
    publicPath: '/build/',
    inline: true,
    hot: true,
    quiet: false,
    noInfo: true,
    stats: {colors: true},
  };

  var server = new WebpackDevServer(compiler, serverConfig);

  server.listen(6808, '127.0.0.1', function (err, result) {
    if (err) console.log(err);
  });
}
