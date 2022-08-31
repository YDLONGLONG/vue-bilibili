module.exports = {
  //构建生产环境的项目入口 生产环境时为/my-project ,否则为/
  publicPath: process.env.NODE_ENV === 'production' ? '/vue-bilibili/' : '/',
  lintOnSave: false,
  devServer: {
    port: 80,
    disableHostCheck: true,
    proxy: {
      '/api': {//这里最好有一个 /
        target: 'http://localhost:3000',// 后台接口域名
        ws: true,//如果要代理 websockets，配置这个参数
        secure: false,// 如果是https接口，需要配置这个参数
        changeOrigin: true, //是否跨域
        pathRewrite: {
          '^/api': ''
        }
      },
      '/sendCode': {
        target: "http://47.98.53.42:18002/send.do",
        changeOrigin: true,
        pathRewrite: {
          '^/sendCode': ''
        }
      }
    }
  },
}
