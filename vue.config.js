const autoprefixer = require('autoprefixer');
const pxtorem = require('postcss-pxtorem');

module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/MQU/' : '/',
  css: {
    loaderOptions: {
      postcss: {
        plugins: [
          autoprefixer(),
          pxtorem({
            rootValue: 75,
            propList: ['*'],
            // 该项仅在使用 Circle 组件时需要
            // 原因参见 https://github.com/youzan/vant/issues/1948
            selectorBlackList: ['van-circle__layer']
          })
        ]
      }
    }
  },
  devServer: {
    port: '8126',
    host: '192.168.14.153',
    open: true,
    proxy: {
      '/api': {
        target: 'http://mq.lango-tech.com:11000/commServer',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      },
      '/vote-api': {
        target: 'http://192.168.14.53:8081/voteServer',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/vote-api': ''
        }
      }
    }
  }
};
