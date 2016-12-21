const package = require('../package.json');

module.exports = {
  module: {
    loaders: [
      {
        test: /\.js$/, 
        loader: 'babel-loader',
        exclude: /node_modules/, 
        query: package.babel,
      },
    ]
  }
};


