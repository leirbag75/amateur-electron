const path = require('path');

module.exports = {
  mode: 'development',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [{
      test: /\.js$/,
      include: [
        path.join(__dirname, 'src')
      ],
      use: {
        loader: 'babel-loader'
      }
    }]
  }
}
