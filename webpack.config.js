const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const devMode = process.env.NODE_ENV !== 'production'

module.exports = {
  mode: 'development',
  entry: {
    libs: './src/assets/js/libs.js',
    indexViewModel: './src/assets/js/indexScript.js',
    secondViewModel: './src/assets/js/secondScript.js'

  },
  devServer: {
    compress: false,
    port: 8080,
    hot: false,
    hotOnly: false,
  },
  optimization: {
    minimize: true,
    minimizer: [
      new OptimizeCSSAssetsPlugin({})
    ],
    runtimeChunk: {
        name: 'vendor'
    },
    splitChunks: {
        cacheGroups: {
            default: false,
            commons: {
                test: /node_modules/,
                name: "vendor",
                chunks: "initial",
                minSize: 1
            }
        }
    }
  },

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
  },
  module: {
    rules: [{
        test: /\.js$/,
        exclude: [
          /(node_modules)/,
          'src/libs/js/*.js'
        ],
        use: [{
          loader: 'babel-loader',
          options: {
            "presets": [
              "env"
            ],
            "plugins": ["transform-class-properties", "transform-object-rest-spread", "transform-es2015-function-name"]
          }
        }]
      },
      {
        test: /\.s?[ac]ss$/,
        use: [
          devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.html$/,
        use: ['html-loader']
      },
      {
        test: /\.(png|jpe?g|gif)$/,
        loader: 'url-loader',
        options: {
          limit: 1000,
          context: './src',
          name: '[path][name].[ext]'
        }
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          mimetype: 'application/font-woff'
        }
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader'
      }
    ],
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: 'src/static' }
    ]),
    new MiniCssExtractPlugin({
      filename: devMode ? '[name].css' : '[name].[hash].css',
      chunkFilename: devMode ? '[id].css' : '[id].[hash].css',
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/html/index.html',
      chunksSortMode: 'manual',
      chunks: ['vendor','libs', 'indexViewModel']
    }),
    new HtmlWebpackPlugin({
      filename: 'second.html',
      template: 'src/html/second.html',
      chunksSortMode: 'manual',
      chunks: ['vendor','libs', 'userManagement']
    }),
    new CleanWebpackPlugin(['dist'])
  ]
};
