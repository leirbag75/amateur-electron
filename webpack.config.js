const path = require('path');
const nodeExternals = require('webpack-node-externals');

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
    target: 'node',
    externals: [nodeExternals()],
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
