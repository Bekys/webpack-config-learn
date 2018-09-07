const path = require('path')

const creatVueLoaderOptions = require('./vue-loader.config')

const isDev = process.env.NODE_ENV === 'development'

const config = {
  mode: process.env.NODE_ENV || 'production',
  target:'web',
  entry: path.resolve(__dirname,'../src/index.js'),
  output: {
    filename:'bundle.[hash:8].js',
    path: path.resolve(__dirname,'../dist')
  },
  module: {
    rules: [
      {
        test:/\.(vue|js|jsx)$/,
        loader: 'eslint-loader',
        exclude: /node_modules/,
        enforce: 'pre'//在下面任务之前检测，检测不通过则不继续进行
      },
      {
        test:/\.vue$/,
        loader: 'vue-loader',
        options: creatVueLoaderOptions(isDev)
      },
      {
        test:/\.jsx$/,
        loader: 'babel-loader'
      },
      // {
      //   test: /\.css$/,
      //   use: [
      //     'style-loader',// 将解析好的文件插入到html文件中
      //     'css-loader'// 解析css文件
      //   ]
      // },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(jpg|png|svg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options:{
              limit: 1024,
              name: 'resources/[path][name].[hash:8].[ext]' // 生成到相对应的文件中
            }
          }
        ]
      }
    ]
  }
}

module.exports = config

