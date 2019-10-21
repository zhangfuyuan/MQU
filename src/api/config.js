//根据不同的环境更改不同的baseUrl
let baseURL = '';

if (process.env.NODE_ENV === 'development') {
  baseURL = '/api';
} else if (process.env.NODE_ENV === 'production') {
  baseURL = '/commServer';
}

export default baseURL;
