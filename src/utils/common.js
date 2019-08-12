export function param2Obj(url) {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse('{"' + decodeURIComponent(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}')
}

/**
 *  时间戳格式化
 * */
export function formatDate(date,fmt){
  if(/(y+)/.test(fmt)){
    fmt = fmt.replace(RegExp.$1, (date.getFullYear()+'').substr(4-RegExp.$1.length));
  }
  let o = {
    'M+': date.getMonth()+1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  }
  for(let k in o){
    let str = o[k]+'';
    if(new RegExp(`(${k})`).test(fmt)){
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length===1)?str:padLeftZero(str));
    }
  }
  return fmt;
}

function padLeftZero(str){
  return ('00'+str).substr(str.length);
}

/**
 *  图片自适应处理函数（基于JQ的DOM操作）
 *
 * */
export function imgHistoryScreenCapture(src, o){
  updateImgRatio(src, function(imgWidth, imgHeight, o){
    //对象
    var obj =  o;
    var p = obj.parent();
    //父宽高
    var pw = p.width();
    var ph = p.height();
    //img对父比例
    var pws = pw/imgWidth;
    var phs = ph/imgHeight;
    var tw,th,tt,tl;

    if(pws > phs){
      //横
      tw = imgWidth*phs;
      th = imgHeight*phs;
      tt = 0;
      tl = (pw - tw)/2;

    }else{
      //竖
      tw = imgWidth*pws;
      th = imgHeight*pws;
      tl = 0;
      tt = (ph - th)/2;
    }
    obj.css("margin-top", tt+'px');
    obj.css("margin-left", tl+'px');
    obj.animate({width:tw+'px', height:th+'px'});
  },o);
}
