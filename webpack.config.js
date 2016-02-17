var path = require('path');
var webpack = require('webpack');
var params = require('./params.js');
var port = params.proxy.exposedPort || params.proxy.port || 6806;
var host = params.proxy.host || '0.0.0.0';

module.exports = {
  devtool: 'cheap-module-eval-source-map',
  entry: [
    'webpack-dev-server/client?http://' + host + ':' + port,
    'webpack/hot/dev-server',
    path.join(__dirname, 'src/client/index')
  ],
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'bundle.js',
    publicPath: '/build/'
  },
  plugins: [
    new webpack.ProvidePlugin({ 'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch' }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  module: {
    preLoaders: [
      {test: /\.jsx?$/, loaders: ['regenerator'], include: path.join(__dirname, 'src/client')}
    ],
    loaders: [
      {test: /\.jsx?$/, loader: 'react-hot', include: path.join(__dirname, 'src/client')},
      {test: /\.jsx?$/, loader: 'babel', exclude: /node_modules/, include: path.join(__dirname, 'src/client'), stage: 0},
      { test: /\.css$/,  loader: "style-loader!css-loader" },
      { test: /\.less$/, loader: "style-loader!css-loader!less-loader" },
      { test: /\.gif$/, loader: "url-loader?mimetype=image/png" },
      { test: /\.woff(2)?(\?v=[0-9].[0-9].[0-9])?$/, loader: "url-loader?mimetype=application/font-woff" },
      { test: /\.(ttf|eot|svg)(\?v=[0-9].[0-9].[0-9])?$/, loader: "file-loader?name=[name].[ext]" },
    ]
  },
}
