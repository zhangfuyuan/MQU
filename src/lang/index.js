import Vue from 'vue';
import VueI18n from 'vue-i18n';
import { Locale } from 'vant';
import zhCN from 'vant/lib/locale/lang/zh-CN';
import zhTW from 'vant/lib/locale/lang/zh-TW';
import enUS from 'vant/lib/locale/lang/en-US';

const langMap = {
	'zh-CN': {
		key: 'zh-CN',
		lib: zhCN
	},
	'zh-TW': {
		key: 'zh-TW',
		lib: zhTW
	},
	'zh-HK': {
		key: 'zh-TW',
		lib: zhTW
	},
	'en-US': {
		key: 'en-US',
		lib: enUS
	},
};
const messages = {
  'zh-CN': require('./zh-CN'),
  'zh-TW': require('./zh-TW'),
	'en-US': require('./en-US'),
};
const navLang = navigator.language || navigator.userLanguage || navigator.browserLanguage;
const langKey = langMap[navLang] ? langMap[navLang].key : 'en-US';
const vantMsg = langMap[navLang] ? langMap[navLang].lib : enUS;

Vue.use(VueI18n);
Locale.use(langKey, vantMsg);

const i18n =  new VueI18n({
    locale : langKey,
    messages
});

export default i18n;
