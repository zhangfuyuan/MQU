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
		host: '192.168.1.83',
		open: true,
		proxy: {
			'/api': {
				target: 'http://119.23.61.139/prm-web/a',
				ws: true,
				changeOrigin: true,
				pathRewrite:{
					'^/api': ''
				}
			}
		}
	}
};
