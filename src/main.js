import Vue from 'vue';
import App from './App';
import { router } from './router';

import 'amfe-flexible';
import i18n from './lang';

Vue.prototype.$baseUrl = process.env.BASE_URL;

new Vue({
  router,
  el: '#app',
	i18n,
  render: h => h(App)
});
