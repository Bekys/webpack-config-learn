module.exports = (isDev)=> {
  return {
    preserveWhitepace: true, // vue中的空格
    extractCSS: !isDev, // 对vue中的css文件单独打包
    cssModules: {
      localIndentName: '[path]-[name]-[hash:base64:5]',//生成独一无二的名字
      camelCase:true//对用横杠链接的内容编译成驼峰形式
    },
    // hotReload:false, vue文件的热重载
    loaders: {
      // 'docs': vue自定义模块
    },
    preLoader: {

    },
    postLoader: {

    }
  }
}
