import Vue from 'vue';
import App from './App';
import { router } from './router';

import 'amfe-flexible';
import i18n from './lang';
import VConsole from 'vconsole';

Vue.prototype.$baseUrl = process.env.BASE_URL;

if (process.env.NODE_ENV!=='production' || /vc=1/i.test(window.location.href)) {
  new VConsole();
}

new Vue({
  router,
  el: '#app',
  i18n,
  render: h => h(App)
});
