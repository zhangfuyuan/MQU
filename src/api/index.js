import Qs from 'qs';
import axios from 'axios';
import baseURL from './config';

// 创建axios实例
const service = axios.create({
  baseURL, // api的base_url
  timeout: 100*1000, // 请求超时时间100s
  //`transformRequest`选项允许我们在请求发送到服务器之前对请求的数据做出一些改动，其作用是让参数（data）序列化
  //该选项只适用于以下请求方式：`put/post/patch`
  //数组里面的最后一个函数必须返回一个字符串、-一个`ArrayBuffer`或者`Stream`
  // qs.stringify()将对象 序列化成URL的形式，以&进行拼接（需要qs在此转化为formdata，和api开发人员规定）
  transformRequest: [
    function (data) {
      return Qs.stringify(data);
    },
  ],
  //`paramsSerializer`是一个可选的函数，其作用是让参数（params）序列化
  // 该选项只适用于以下请求方式：`get / delete ` 
  paramsSerializer: function(params) {
      return Qs.stringify(params);
  },
  // 是否跨域，当然你也可以使用代理proxy 、nginx、
  // 但是一般公司都不会每次都设置代理，而是使用固定的开发模式，例如直接做一个跨域的设置，一劳永逸
  // 这里设置该属性还需要api开发者支持，设置后台的php程序里的header
  withCredentials: true,
  headers: {
    // 请求头，因为我们要使用formdata形式，所以设置如下
    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    // 如果采用json传递给后台数据，格式如下（默认）
    // 'Content-Type': 'application/json;charset=UTF-8',
    // 如果上传图片、视频等多媒体文件给后台数据，格式如下
    // 'Content-Type': 'multipart/form-data',
  }
});

// request拦截器
service.interceptors.request.use(
  config => {
    let data = config.data;
    
    if (data.contentType === 'json') {
      config.headers['Content-Type'] = 'application/json;charset=UTF-8';
    } else if (data.contentType === 'multipart') {
      config.headers['Content-Type'] = 'multipart/form-data';
    }
    
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// respone拦截器
service.interceptors.response.use(
  response => {
    return Promise.resolve(response.data);
  },
  error => {
    return Promise.reject(error);
  }
);

export default service;
