var path = require('path');
var webpack = require('webpack');
var params = require('./params.js');
var port = params.proxy.port || 6806;
var host = params.proxy.host || '0.0.0.0';

module.exports = {
  devtool: '#eval-source-map',
  entry: [
    'webpack-dev-server/client?http://' + host + ':' + port,
    'webpack/hot/dev-server',
    path.join(__dirname, 'app', 'index')
  ],
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'bundle.js',
    publicPath: '/build/'
  },
  plugins: [
    new webpack.ProvidePlugin({ 'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch' }),
    new webpack.HotModuleReplacementPlugin(),
    //new webpack.NoErrorsPlugin()
  ],
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  module: {
    preLoaders: [
      {test: /\.jsx?$/, loaders: ['regenerator'], include: path.join(__dirname, 'app')}
    ],
    loaders: [
      {test: /\.jsx?$/, loader: 'react-hot', include: path.join(__dirname, 'app')},
      {test: /\.jsx?$/, loader: 'babel', exclude: /node_modules/, include: path.join(__dirname, 'app'), stage: 0},
      {test: /\.css$/, loader: 'style!css!autoprefixer-loader?browsers=last 2 versions'},
      {test: /\.less$/, loader: 'style!css!autoprefixer-loader?browsers=last 2 versions!less'},
      {test: /\.gif$/, loader: "url-loader?mimetype=image/png"},
      { test: /\.woff(2)?(\?v=[0-9].[0-9].[0-9])?$/, loader: "url-loader?mimetype=application/font-woff" },
      { test: /\.(ttf|eot|svg)(\?v=[0-9].[0-9].[0-9])?$/, loader: "file-loader?name=[name].[ext]" },
    ]
  },
}
