//根据不同的环境更改不同的baseUrl
let baseURL = '';

if (process.env.NODE_ENV === 'development') {
  baseURL = '/api';
} else if (process.env.NODE_ENV === 'production') {
  baseURL = 'http://119.23.61.139/prm-web'; // TODO 生产环境地址
}

export default baseURL;
