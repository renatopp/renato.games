const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const data = require('./src/data.json')


module.exports = {
  mode: 'development',

  entry: [
    './src/index.js',
    './src/index.less'
  ],
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js'
  },

  module: {
    rules: [
      {
        test: /\.hbs$/,
        use: "handlebars-loader"
      },
      {
        test: /\.less$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader', options: { url: false } },
          { loader: 'postcss-loader' },
          { loader: 'less-loader' }
        ]
      },
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      inject: 'head',
      minify: true,
      template: path.resolve(__dirname, 'src/index.hbs'),
      templateParameters: {
        data: data
      }
    }),

    new CopyWebpackPlugin({
      patterns: [
        { from: 'public', to: 'assets'}
      ]
    })
  ],

  devServer: {
    contentBase: path.join(__dirname, 'build'),
    compress: true,
    port: 8080
  }
}