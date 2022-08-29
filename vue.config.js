const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave:false,
  //    devServer:{
  //   host: '0.0.0.0',
  //   port:3000,
  //   client: {
  //     webSocketURL: 'ws://0.0.0.0:3000/ws',
  //   },
  //   headers: {
  //     'Access-Control-Allow-Origin': '*',
  //   }
  // }
  devServer: {
    proxy: {
      '/chat': {
        target: 'http://localhost:3030', // 后台接口
        changeOrigin: true //是否跨域
        // pathRewrite: {
        //   '^/admin': ''
        // }
      }
    }
  }
  
})
