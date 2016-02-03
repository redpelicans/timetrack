var webpack = require('webpack');
var webpackConfig = require('./webpack.config');
var WebpackDevServer = require('webpack-dev-server');
var logerror = require('debug')('timetrack:error');
var loginfo = require('debug')('timetrack:info');
var params = require('./params.js');
var port = params.webpack.port || 6808;
var host = params.webpack.host || '0.0.0.0';

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

  server.listen(port, host, function (err, result) {
    if (err) logerror(err);
    loginfo('webpack server listening on: ' + params.webpack.url);
  });
}
