export function param2Obj(url) {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse('{"' + decodeURIComponent(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') +
    '"}');
}

/**
 *  时间戳格式化
 * */
export function formatDate(date, fmt) {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  }
  for (let k in o) {
    let str = o[k] + '';
    if (new RegExp(`(${k})`).test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
    }
  }
  return fmt;
}

function padLeftZero(str) {
  return ('00' + str).substr(str.length);
}

/**
 *  图片自适应处理函数（基于JQ的DOM操作）
 *
 * */
export function imgHistoryScreenCapture(src, o) {
  window.updateImgRatio(src, function(imgWidth, imgHeight, o) {
    //对象
    var obj = o;
    var p = obj.parent();
    //父宽高
    var pw = p.width();
    var ph = p.height();
    //img对父比例
    var pws = pw / imgWidth;
    var phs = ph / imgHeight;
    var tw, th, tt, tl;

    if (pws > phs) {
      //横
      tw = imgWidth * phs;
      th = imgHeight * phs;
      tt = 0;
      tl = (pw - tw) / 2;

    } else {
      //竖
      tw = imgWidth * pws;
      th = imgHeight * pws;
      tl = 0;
      tt = (ph - th) / 2;
    }
    obj.css("margin-top", tt + 'px');
    obj.css("margin-left", tl + 'px');
    obj.animate({
      width: tw + 'px',
      height: th + 'px'
    });
  }, o);
}

/**
 * 获取设备信息的工具类
 * */
export var detectUtils = {
  // 设备的用户代理信息
  userAgent: window.navigator.userAgent,

  // 判断手机型号和系统（依赖插件 mobile-detect.js）
  detectMobile: function(ua) {
    var res = {
      os: 'Unknown',
      brand: 'Unknown',
      model: 'Unknown'
    };

    if (!window.MobileDetect) return res;

    var user_agent = ua || this.userAgent;
    var md = new window.MobileDetect(user_agent); // 初始化mobile-detect
    var os = md.os(); // 获取系统
    var brand = md.mobile(); // 厂商（品牌）
    var model = md.mobile(); // 设备型号

    if (os === 'iOS') {
      // iOS系统的处理
      os += md.version('iPhone');
    } else if (os === 'AndroidOS') {
      //Android系统的处理
      var sss = user_agent.split(';');
      // 判断数组中是否包含某字符串（安卓机型获取用到）
      Array.prototype.myContains = function(needle) {
        for (var i in this) {
          if ((typeof(this[i]) === 'string' || Array.isArray(this[i])) && this[i].indexOf(needle) >= 0)
            return i;
        }
        return -1;
      }
      var index = sss.myContains('Build/'); //判断UA里边有没有Build信息，通过这个拿到安卓的具体机型
      os += md.version('Android');

      if (index > -1) {
        model = sss[index].substring(0, sss[index].indexOf('Build/'));

        if (brand.indexOf('Unknown') > -1) {
          var brandReg =
            /(iPhone)|(Samsung)|(GT-)|(SM-)|(SCH-)|(HM)|(RedMi)|(MIUI)|(MI-)|(Huawei)|(Honor)|(OPPO)|(vivo)|(Coolpad)|(HTC)|(Lenovo)|(Meitu)|(UIMI)|(ZTE)|(SONY)|(Nokia)|(ZUK)/ig;
          var samsung_brandReg = /(Samsung)|(GT-)|(SM-)|(SCH-)/ig;
          var mi_brandReg = /(MIUI)|(MI-)/ig;
          var matchBrand = sss[index].match(brandReg);

          if (matchBrand && matchBrand.length > 0) {
            matchBrand = matchBrand[0];

            if (samsung_brandReg.test(matchBrand)) {
              brand = 'Samsung';
            } else if (mi_brandReg.test(matchBrand)) {
              brand = 'MI';
            } else {
              brand = matchBrand;
            }
          }
        }
      } else {
        model = 'Android';
      }
    } else {
      // 其它系统的处理
      model = this.detectOS(user_agent);
    }

    if (os) res.os = os;
    if (brand) res.brand = brand.replace('Tablet', '');
    if (model) res.model = model;

    return res;
  },

  // 判断设备的操作系统
  detectOS: function(ua) {
    var user_agent = ua || this.userAgent;
    var platform = window.navigator.platform;
    var isWin = (platform == 'Win32') || (platform == 'Windows');
    var isMac = (platform == 'Mac68K') || (platform == 'MacPPC') ||
      (platform == 'Macintosh') || (platform == 'MacIntel');
    if (isMac) return 'Mac';
    var isUnix = (platform == 'X11') && !isWin && !isMac;
    if (isUnix) return 'Unix';
    var isLinux = (String(platform).indexOf('Linux') > -1);
    if (isLinux) return 'Linux';
    if (isWin) {
      var isWin2K = user_agent.indexOf('Windows NT 5.0') > -1 || user_agent.indexOf('Windows 2000') > -1;
      if (isWin2K) return 'Windows 2000';
      var isWinXP = user_agent.indexOf('Windows NT 5.1') > -1 || user_agent.indexOf('Windows XP') > -1;
      if (isWinXP) return 'Windows XP';
      var isWin2003 = user_agent.indexOf('Windows NT 5.2') > -1 || user_agent.indexOf('Windows 2003') > -1;
      if (isWin2003) return 'Windows 2003';
      var isWinVista = user_agent.indexOf('Windows NT 6.0') > -1 || user_agent.indexOf('Windows Vista') > -1;
      if (isWinVista) return 'Windows Vista';
      var isWin7 = user_agent.indexOf('Windows NT 6.1') > -1 || user_agent.indexOf('Windows 7') > -1;
      if (isWin7) return 'Windows 7';
      var isWin10 = user_agent.indexOf('Windows NT 10') != -1;
      if (isWin10) return 'Windows 10';
    }
    return 'Unknown';
  }
};
