//根据不同的环境更改不同的baseUrl
let baseURL = '';

if (process.env.NODE_ENV === 'development') {
  baseURL = '/vote-api';
} else if (process.env.NODE_ENV === 'production') {
  baseURL = '/voteServer';
}

export default baseURL;
