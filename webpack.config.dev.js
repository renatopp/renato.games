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
          { loader: 'css-loader' },
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: [require('autoprefixer')()]
            }
          },
          { loader: 'less-loader' }
        ]
      }
    ]
  },

  plugins: [
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, 'public/**/*'),
        to: path.resolve(__dirname, 'build/assets/'),
        context: 'public',
        toType: 'dir',
      }
    ]),

    new HtmlWebpackPlugin({
      inject: 'head',
      minify: true,
      template: path.resolve(__dirname, 'src/index.hbs'),
      templateParameters: {
        data: data
      }
    })
  ],

  devServer: {
    contentBase: path.join(__dirname, 'build'),
    compress: true,
    port: 8080
  }
}