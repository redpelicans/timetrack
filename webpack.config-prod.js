var path = require('path');
var webpack = require('webpack');
var node_modules = path.resolve(__dirname, 'node_modules');
var pathToReact = path.resolve(node_modules, 'react/dist/react.min.js');


module.exports = {
  devtool: '#eval-source-map',
  entry: [
    path.join(__dirname, 'app', 'index')
  ],
  resolve:{
    alias: {
      'react': pathToReact
    },
  },
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'bundle.js',
    publicPath: '/build/'
  },
  plugins: [
    new webpack.ProvidePlugin({ 'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch' }),
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
      {test: /\.jsx?$/, loader: 'babel', exclude: /node_modules/, include: path.join(__dirname, 'app'), stage: 0},
      {test: /\.css$/, loader: 'style!css!autoprefixer-loader?browsers=last 2 versions'},
      {test: /\.less$/, loader: 'style!css!autoprefixer-loader?browsers=last 2 versions!less'},
      {test: /\.gif$/, loader: "url-loader?mimetype=image/png"},
      { test: /\.woff(2)?(\?v=[0-9].[0-9].[0-9])?$/, loader: "url-loader?mimetype=application/font-woff" },
      { test: /\.(ttf|eot|svg)(\?v=[0-9].[0-9].[0-9])?$/, loader: "file-loader?name=[name].[ext]" },
    ],
    noParse: [pathToReact],
  },
}
