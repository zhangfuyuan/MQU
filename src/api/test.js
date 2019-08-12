import request from './index';

/**
 *  GET请求  数据放在 params 属性内
 *  POST请求 数据放在 data   属性内
 * */
 
/** 1.获取当前IP设置  /prm-web/a/login  method=get|post
 *  username  用户名
 *  password  密码
 * */
export function test(info) {
	let data = {
		username: info.username
	};
	
	if (info['password']) data.password = info['password'];
	
  return request({
    url: '/login',
    method: 'post',
		data
  });
}
