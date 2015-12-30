var express = require('express');
var path = require('path');
var httpProxy = require('http-proxy');
var http = require('http');
var loginfo = require('debug')('timetrack:info');
var logerror = require('debug')('timetrack:error');
var params = require('./params.js');

var proxy = httpProxy.createProxyServer({
  changeOrigin: true, 
  ws: true,
  target: params.webpack.url
}); 

var app = express();

// switch to server
app.use(express.static(path.resolve(__dirname, 'public')));


var bundle = require('./bundle.js');
bundle();

app.all('/build/*', function (req, res) {
  proxy.web(req, res, {target: params.webpack.url});
});

// app.all('/socket.io*', function (req, res) {
//   proxy.web(req, res, {target: params.webpack.url});
// });

app.all('/sockjs-node/*', function (req, res) {
  proxy.web(req, res, {target: params.webpack.url});
});


app.all('*', function (req, res) {
  proxy.web(req, res, {target: params.server.url});
});

proxy.on('error', function(err) {
  logerror(err);
});

// http service to proxy websocket requests from webpack
var server = http.createServer(app);

// server.on('upgrade', function (req, socket, head) {
//   proxy.ws(req, socket, head);
// });

server.listen(params.proxy.port, params.proxy.host || '0.0.0.0', function (err) {
  if(err)return logerror(err);
  loginfo('proxy server listening on: ' + params.proxy.url);
}); 
