const path = require('path')

const webpack = require('webpack')

const merge = require('webpack-merge')

const {VueLoaderPlugin} = require('vue-loader')

const HTMLPlugin = require('html-webpack-plugin')


const ExtractPlugin = require('extract-text-webpack-plugin')// 分离css文件

const baseConfig = require('./webpack.config.base')

const isDev = process.env.NODE_ENV === 'development'
const defaultPlugins = [
  new VueLoaderPlugin(), // make sure vue-loader can response
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: isDev? '"development"' : '"production"'
    }
  }),
  new HTMLPlugin()
]
const devServer = {
  port: 8066,
  host: '0.0.0.0',
  overlay: {
    errors:true
  },
  hot:true
}
var config

if (isDev) {
  config = merge(baseConfig, {
    devtool: '#cheap-module-eval-source-map',
    module: {
      rules: [{
          test: /\.styl(us)?$/,
          use: [
            'vue-style-loader',
            'css-loader',
            {
              loader: 'postcss-loader', // css兼容性前缀
              options: {
                sourceMap: true //scourmap开发代码与实际运行代码不一致时帮助我们debug到原始开发代码的技术 使用前面已经生成的sourceMap提高效率
              }
            },
            'stylus-loader'
          ]
        }
      ]
    },
    devServer,
    plugins: defaultPlugins.concat([
          new webpack.HotModuleReplacementPlugin()
        ])
  })
} else {
  config = merge(baseConfig,{
    entry:{
      app:path.join(__dirname, '../src/index.js')
      // 对不经常更改的第三方模块进行单独打包
      // vendor: ['vue','vue-loader']//依赖的第三方库，不会经常变更
    },
    output: {
      filename: '[name].[chunkhash:8].js'
    },
    module:{
      rules : [{
          test:/\.styl(us)?$/,
          use:ExtractPlugin.extract({
            fallback: 'vue-style-loader',// 如果正常执行出错则执行fallback
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
        }
      ]
    },
    optimization : {
      splitChunks: {
        chunks: 'all'
      },
      runtimeChunk: true
    },
    plugins: defaultPlugins.concat([
      new ExtractPlugin('styles.[chunkhash:8].css')
      // new webpack.optimize.CommonsChunkPlugin({
      //   // 对vendor文件进行单独打包
      //   name: 'vendor'
      // }),
      // new webpack.optimize.CommonsChunkPlugin({
      //   // 取一个不存在的名字，为了一面添加模块时，不至于错乱已经存在的模块的顺序
      //   name: 'runtime'
      // })
    ])
  })
}

module.exports = config
