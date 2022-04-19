const path = require('path');

module.exports = [
  {
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
  },
  {
    mode: 'development',
    entry: path.resolve(__dirname, 'test/test.js'),
    output: {
      path: path.resolve(__dirname, 'test'),
      filename: 'bundle.js'
    },
    module: {
      rules : [{
        test: /\.js$/,
        include: [
          path.join(__dirname, 'src'),
          path.join(__dirname, 'test')
        ],
        exclude: /^bundle\.js$/,
        use: {
          loader: 'babel-loader'
        }
      }]
    }
  }
]
