var express = require('express');
var path = require('path');
var httpProxy = require('http-proxy');
var http = require('http');

var proxy = httpProxy.createProxyServer({changeOrigin: true, ws: true}); 
var app = express();

var isProduction = process.env.NODE_ENV === 'production';
var port = isProduction ? process.env.PORT : 6806;

app.use(express.static(path.resolve(__dirname, 'public')));

if (!isProduction) {
  var bundle = require('./bundle.js');
  bundle();

  app.all('/build/*', function (req, res) {
    proxy.web(req, res, {target: 'http://localhost:6808'});
  });

  app.all('/socket.io*', function (req, res) {
    proxy.web(req, res, {target: 'http://localhost:6808'});
  });

  proxy.on('error', function(err) {});

  // http service to proxy websocket requests from webpack
  var server = http.createServer(app);

  server.on('upgrade', function (req, socket, head) {
    proxy.ws(req, socket, head);
  });

  server.listen(port, function () {
    console.log('(dev) running on port ' + port);
  }); 
} else {
  app.listen(port, function () {
    console.log('(prod) running on port ' + port);
  });
}
