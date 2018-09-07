const path = require('path')

const webpack = require('webpack')

const {VueLoaderPlugin} = require('vue-loader')

const HTMLPlugin = require('html-webpack-plugin')

const ExtractPlugin = require('extract-text-webpack-plugin')// 分离css文件

const isDev = process.env.NODE_ENV === 'development'

const config = {
  mode: process.env.NODE_ENV || 'production',
  target:'web',
  entry: path.resolve(__dirname,'src/index.js'),
  output: {
    filename:'bundle.[hash:8].js',
    path: path.resolve(__dirname,'dist')
  },
  module: {
    rules: [
      {
        test:/\.vue$/,
        loader: 'vue-loader'
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
        test: /\.(jpg|png|svg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options:{
              limit: 1024,
              name: '[name]-aa.[ext]'
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(), // make sure vue-loader can response
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: isDev? '"development"' : '"production"'
      }
    }),
    new HTMLPlugin()
  ]
}
if (isDev) {
  config.module.rules.push({
    test: /\.styl$/,
    use: [
      'style-loader',
      'css-loader',
      {
        loader: 'postcss-loader', // css兼容性前缀
        options: {
          sourceMap: true //scourmap开发代码与实际运行代码不一致时帮助我们debug到原始开发代码的技术 使用前面已经生成的sourceMap提高效率
        }
      },
      'stylus-loader'
    ]
})
  config,devtool = '#cheap-module-eval-source-map' // 调试工具
  config.devServer = {
    port: 8066,
    host: '0.0.0.0',
    overlay: {
      errors:true
    },
    // open: true,
    // hot: true
  }
  config.plugins.push(
    new webpack.HotModuleReplacementPlugin()
    // new webpack.NoEmitOnErrorsPlugin()
  )
} else {
  config.entry = {
    // app业务单独打包
    app:path.join(__dirname, 'src/index.js'),
    // 对不经常更改的第三方模块进行单独打包
    // vendor: ['vue','vue-loader']//依赖的第三方库，不会经常变更
  }
  config.output.filename = '[name].[chunkhash:8].js'
  config.module.rules.push({
    test:/\.styl$/,
    use:ExtractPlugin.extract({
      fallback: 'style-loader',// 如果正常执行出错则执行fallback
      use: [
        'css-loader',
        {
          loader: 'postcss-loader', // css兼容性前缀
          options: {
            sourceMap: true //scourmap开发代码与实际运行代码不一致时帮助我们debug到原始开发代码的技术
          }
        },
        'stylus-loader'
      ]
    })
  })
  config.optimization = {
    splitChunks: {
      chunks: 'all'
    },
    runtimeChunk: true
  }
  config.plugins.push(
    new ExtractPlugin('styles.[chunkhash:8].css')
    // new webpack.optimize.CommonsChunkPlugin({
    //   // 对vendor文件进行单独打包
    //   name: 'vendor'
    // }),
    // new webpack.optimize.CommonsChunkPlugin({
    //   // 取一个不存在的名字，为了一面添加模块时，不至于错乱已经存在的模块的顺序
    //   name: 'runtime'
    // })
  )
}

module.exports = config
