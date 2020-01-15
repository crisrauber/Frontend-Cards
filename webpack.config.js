const  path = require('path');
const Dotenv = require('dotenv-webpack')

module.exports = {
  entry: ['@babel/polyfill',path.resolve(__dirname, 'src', 'index.js')],
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'bundle.js',
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'public'),
  },
  plugins:[
    new Dotenv({
      path: path.resolve(__dirname, '.env')
      // safe: false // load .env.example (defaults to "false" which does not use dotenv-safe)
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          { loader: 'babel-loader' }
        ]
      }
    ]
  }
}
