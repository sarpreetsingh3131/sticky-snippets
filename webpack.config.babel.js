import path from 'path'
import webpack from 'webpack'
import Dotenv from 'dotenv-webpack'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import fs from 'fs'


const CLIENT_CONFIG = {
  entry: path.join(__dirname, 'client/app.jsx'),
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, 'public')
  },
  devtool: 'source-map',
  devServer: {
    contentBase: path.join(__dirname, 'public'),
    port: 4000,
    public: 'localhost:4000'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      },
      {
        test: /\.(png|svg|jpg|gif|woff2|woff|ttf)$/,
        use: ['file-loader']
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development')
      }
    }),
    new CopyWebpackPlugin([
      {
        from: 'node_modules/monaco-editor/min/vs',
        to: 'vs'
      }
    ]),
    new Dotenv({
      path: './.env',
      safe: false
    })
  ]
}


var nodeModules = {}

fs.readdirSync('node_modules')
  .filter(x => { return ['.bin'].indexOf(x) === -1 })
  .forEach(mod => { nodeModules[mod] = 'commonjs ' + mod })


const SERVER_CONFIG = {
  entry: path.join(__dirname, 'server/app.js'),
  target: 'node',
  output: {
    filename: 'snippets.js',
    path: path.join(__dirname, 'dist/server')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      }
    ]
  },
  devtool: 'source-map',
  externals: nodeModules,
  node: {
    __dirname: false
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development')
      }
    }),
    new Dotenv({
      path: './.env',
      safe: false
    })
  ]
}


module.exports = process.env.NODE_ENV === 'production' ? [CLIENT_CONFIG, SERVER_CONFIG] : [CLIENT_CONFIG]