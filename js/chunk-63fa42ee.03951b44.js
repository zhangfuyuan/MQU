(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-63fa42ee"],{"28a5":function(e,t,i){"use strict";var n=i("aae3"),s=i("cb7c"),o=i("ebd6"),a=i("0390"),r=i("9def"),d=i("5f1b"),u=i("520a"),l=i("79e5"),c=Math.min,m=[].push,f="split",p="length",g="lastIndex",h=4294967295,v=!l((function(){RegExp(h,"y")}));i("214f")("split",2,(function(e,t,i,l){var w;return w="c"=="abbc"[f](/(b)*/)[1]||4!="test"[f](/(?:)/,-1)[p]||2!="ab"[f](/(?:ab)*/)[p]||4!="."[f](/(.?)(.?)/)[p]||"."[f](/()()/)[p]>1||""[f](/.?/)[p]?function(e,t){var s=String(this);if(void 0===e&&0===t)return[];if(!n(e))return i.call(s,e,t);var o,a,r,d=[],l=(e.ignoreCase?"i":"")+(e.multiline?"m":"")+(e.unicode?"u":"")+(e.sticky?"y":""),c=0,f=void 0===t?h:t>>>0,v=new RegExp(e.source,l+"g");while(o=u.call(v,s)){if(a=v[g],a>c&&(d.push(s.slice(c,o.index)),o[p]>1&&o.index<s[p]&&m.apply(d,o.slice(1)),r=o[0][p],c=a,d[p]>=f))break;v[g]===o.index&&v[g]++}return c===s[p]?!r&&v.test("")||d.push(""):d.push(s.slice(c)),d[p]>f?d.slice(0,f):d}:"0"[f](void 0,0)[p]?function(e,t){return void 0===e&&0===t?[]:i.call(this,e,t)}:i,[function(i,n){var s=e(this),o=void 0==i?void 0:i[t];return void 0!==o?o.call(i,s,n):w.call(String(s),i,n)},function(e,t){var n=l(w,e,this,t,w!==i);if(n.done)return n.value;var u=s(e),m=String(this),f=o(u,RegExp),p=u.unicode,g=(u.ignoreCase?"i":"")+(u.multiline?"m":"")+(u.unicode?"u":"")+(v?"y":"g"),b=new f(v?u:"^(?:"+u.source+")",g),S=void 0===t?h:t>>>0;if(0===S)return[];if(0===m.length)return null===d(b,m)?[m]:[];var x=0,P=0,k=[];while(P<m.length){b.lastIndex=v?P:0;var O,y=d(b,v?m:m.slice(P));if(null===y||(O=c(r(b.lastIndex+(v?0:P)),m.length))===x)P=a(m,P,p);else{if(k.push(m.slice(x,P)),k.length===S)return k;for(var C=1;C<=y.length-1;C++)if(k.push(y[C]),k.length===S)return k;P=x=O}}return k.push(m.slice(x)),k}]}))},"3b2b":function(e,t,i){var n=i("7726"),s=i("5dbc"),o=i("86cc").f,a=i("9093").f,r=i("aae3"),d=i("0bfb"),u=n.RegExp,l=u,c=u.prototype,m=/a/g,f=/a/g,p=new u(m)!==m;if(i("9e1e")&&(!p||i("79e5")((function(){return f[i("2b4c")("match")]=!1,u(m)!=m||u(f)==f||"/a/i"!=u(m,"i")})))){u=function(e,t){var i=this instanceof u,n=r(e),o=void 0===t;return!i&&n&&e.constructor===u&&o?e:s(p?new l(n&&!o?e.source:e,t):l((n=e instanceof u)?e.source:e,n&&o?d.call(e):t),i?this:c,u)};for(var g=function(e){e in u||o(u,e,{configurable:!0,get:function(){return l[e]},set:function(t){l[e]=t}})},h=a(l),v=0;h.length>v;)g(h[v++]);c.constructor=u,u.prototype=c,i("2aba")(n,"RegExp",u)}i("7a56")("RegExp")},4917:function(e,t,i){"use strict";var n=i("cb7c"),s=i("9def"),o=i("0390"),a=i("5f1b");i("214f")("match",1,(function(e,t,i,r){return[function(i){var n=e(this),s=void 0==i?void 0:i[t];return void 0!==s?s.call(i,n):new RegExp(i)[t](String(n))},function(e){var t=r(i,e,this);if(t.done)return t.value;var d=n(e),u=String(this);if(!d.global)return a(d,u);var l=d.unicode;d.lastIndex=0;var c,m=[],f=0;while(null!==(c=a(d,u))){var p=String(c[0]);m[f]=p,""===p&&(d.lastIndex=o(u,s(d.lastIndex),l)),f++}return 0===f?null:m}]}))},6492:function(e,t,i){},aae3:function(e,t,i){var n=i("d3f4"),s=i("2d95"),o=i("2b4c")("match");e.exports=function(e){var t;return n(e)&&(void 0!==(t=e[o])?!!t:"RegExp"==s(e))}},dc9a:function(e,t,i){"use strict";var n=i("6492"),s=i.n(n);s.a},fd9e:function(e,t,i){"use strict";i.r(t);var n=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{class:["qu",{"is-ios":e.isIOS,"is-landscape":e.isLandscape}]},[n("div",{staticClass:"top"},[n("div",{staticClass:"title"},[e._v("\n      "+e._s(e.$t("quickUpload.title"))+"\n      "),n("span",{class:["send",{"can-send":e.canSend}],on:{click:e.send}},[e._v(e._s(e.$t("common.send")))])])]),n("div",{staticClass:"field"},[n("div",{staticClass:"length"},[e._v(e._s(e.txtContent.length)+"/"+e._s(e.txtLengthLimit))]),n("van-field",{ref:"editField",staticClass:"qu-field",attrs:{type:"textarea",maxlength:e.txtLengthLimit,placeholder:e.$t("quickUpload.inputContent")},model:{value:e.txtContent,callback:function(t){e.txtContent=t},expression:"txtContent"}})],1),n("div",{staticClass:"upload"},[n("van-uploader",{class:["qu-uploader",{"is-reading":e.isReading}],attrs:{name:"imgUploader",accept:"image/*","preview-full-image":!1,multiple:"","max-count":e.imgCountLimit,"before-read":e.imgBeforeRead,"after-read":e.imgAfterRead},model:{value:e.imgList,callback:function(t){e.imgList=t},expression:"imgList"}}),n("ul",{directives:[{name:"show",rawName:"v-show",value:e.isReading,expression:"isReading"}],staticClass:"mask-wrap"},e._l(e.imgProgressList,(function(t,i){return n("li",{key:i,staticClass:"mask-box"},[1===t?n("div",{class:["mask-box-progress",e.progressAnimation()]},[n("div",{staticClass:"progress-txt"},[e._v(e._s(e.$t("quickUpload.uploading")))])]):2===t?n("div",{staticClass:"mask-box-add"}):e._e()])})),0)],1),n("van-popup",{staticClass:"multi-submit mqu-popup",style:{minHeight:"100%",width:"100%"},attrs:{duration:0,position:"right","close-on-click-overlay":!1},model:{value:e.showSendingPopup,callback:function(t){e.showSendingPopup=t},expression:"showSendingPopup"}},[e.submittedSize>=e.totalSize&&e.submitProgress>=100&&!e.pauseSend?[n("div",{staticClass:"end"},[n("div",{staticClass:"end-img"},[n("img",{attrs:{src:i("f0fc"),alt:"icon",width:"100%",height:"100%"}})]),n("van-button",{staticClass:"end-return",attrs:{round:""},on:{click:e.reset}},[e._v(e._s(e.$t("multimedia.returnHome")))])],1)]:[n("div",{staticClass:"submit"},[n("div",{staticClass:"submit-tips"},[n("div",[e._v(e._s(e.$t("multimedia.beSending")))]),n("div",[e._v(e._s(e.$t("multimedia.pleaseNotClosePage")))])]),n("div",{staticClass:"submit-progress"},[n("div",{staticClass:"submit-progress-txt"},[e._v(e._s(e.submitProgress)+"%")]),n("van-progress",{staticClass:"submit-progress-cont qu-progress",attrs:{percentage:e.submitProgress,"show-pivot":!1,color:"#008fff"}})],1),n("van-button",{staticClass:"submit-cancel",attrs:{round:""},on:{click:e.undoSend}},[e._v(e._s(e.$t("multimedia.undoSend")))])],1)]],2)],1)},s=[],o=(i("e17f"),i("2241")),a=(i("c5f6"),i("a481"),i("bd86")),r=(i("8a58"),i("e41f")),d=(i("be7f"),i("565f")),u=(i("1075"),i("f600")),l=(i("e930"),i("8f80")),c=(i("66b9"),i("b650")),m=(i("e7e5"),i("d399")),f=i("da71"),p=i("365c");function g(e){var t={teid:e.teid};return Object(p["a"])({url:"/common/getTerminalState",method:"post",data:t})}function h(e){var t={name:e.name,type:e.type,teid:e.teid,userSystem:e.userSystem};return e.overtime&&(t.overtime=e.overtime),e.content&&(t.content=e.content),Object(p["a"])({url:"/task/createTask",method:"post",data:t})}function v(e){var t={id:e.id};return Object(p["a"])({url:"/task/deleteTask",method:"post",data:t})}function w(e){var t={id:e.id};return e.content&&(t.content=e.content),Object(p["a"])({url:"/task/performTask",method:"post",data:t})}function b(e){var t={kind:e.kind,taskId:e.taskId,content:e.content,index:e.index};return e.name&&(t.name=e.name),Object(p["a"])({url:"/resource/uploadNonFile",method:"post",data:t})}i("4917"),i("3b2b"),i("28a5");var S,x={userAgent:window.navigator.userAgent,detectMobile:function(e){var t={os:"Unknown",brand:"Unknown",model:"Unknown"};if(!window.MobileDetect)return t;var i=e||this.userAgent,n=new window.MobileDetect(i),s=n.os(),o=n.mobile(),a=n.mobile();if("iOS"===s)s+=n.version("iPhone");else if("AndroidOS"===s){var r=i.split(";");Array.prototype.myContains=function(e){for(var t in this)if(("string"===typeof this[t]||Array.isArray(this[t]))&&this[t].indexOf(e)>=0)return t;return-1};var d=r.myContains("Build/");if(s+=n.version("Android"),d>-1){if(a=r[d].substring(0,r[d].indexOf("Build/")),o.indexOf("Unknown")>-1){var u=/(iPhone)|(Samsung)|(GT-)|(SM-)|(SCH-)|(HM)|(RedMi)|(MIUI)|(MI-)|(Huawei)|(Honor)|(OPPO)|(vivo)|(Coolpad)|(HTC)|(Lenovo)|(Meitu)|(UIMI)|(ZTE)|(SONY)|(Nokia)|(ZUK)/gi,l=/(Samsung)|(GT-)|(SM-)|(SCH-)/gi,c=/(MIUI)|(MI-)/gi,m=r[d].match(u);m&&m.length>0&&(m=m[0],o=l.test(m)?"Samsung":c.test(m)?"MI":m)}}else a="Android"}else a=this.detectOS(i);return s&&(t.os=s),o&&(t.brand=o.replace("Tablet","")),a&&(t.model=a),t},detectOS:function(e){var t=e||this.userAgent,i=window.navigator.platform,n="Win32"==i||"Windows"==i,s="Mac68K"==i||"MacPPC"==i||"Macintosh"==i||"MacIntel"==i;if(s)return"Mac";var o="X11"==i&&!n&&!s;if(o)return"Unix";var a=String(i).indexOf("Linux")>-1;if(a)return"Linux";if(n){var r=t.indexOf("Windows NT 5.0")>-1||t.indexOf("Windows 2000")>-1;if(r)return"Windows 2000";var d=t.indexOf("Windows NT 5.1")>-1||t.indexOf("Windows XP")>-1;if(d)return"Windows XP";var u=t.indexOf("Windows NT 5.2")>-1||t.indexOf("Windows 2003")>-1;if(u)return"Windows 2003";var l=t.indexOf("Windows NT 6.0")>-1||t.indexOf("Windows Vista")>-1;if(l)return"Windows Vista";var c=t.indexOf("Windows NT 6.1")>-1||t.indexOf("Windows 7")>-1;if(c)return"Windows 7";var m=-1!=t.indexOf("Windows NT 10");if(m)return"Windows 10"}return"Unknown"}};m["a"].setDefaultOptions({className:"mqu-toast"});var P={name:"quickUpload",mixins:[],components:(S={},Object(a["a"])(S,c["a"].name,c["a"]),Object(a["a"])(S,l["a"].name,l["a"]),Object(a["a"])(S,u["a"].name,u["a"]),Object(a["a"])(S,d["a"].name,d["a"]),Object(a["a"])(S,r["a"].name,r["a"]),S),props:{},data:function(){return{baseURL:f["a"],isIOS:/(\(i[^;]+;( U;)? CPU.+Mac OS X)|(iPhone)|(iPad)|(iPod)/i.test(navigator.userAgent),isLandscape:90==window.orientation||-90==window.orientation,txtContent:"",txtLengthLimit:240,isPageExpired:!1,uploader:null,showSendingPopup:!1,imgList:[],imgCountLimit:9,imgAcceptReg:["image/png","image/jpg","image/jpeg","image/gif"],imgProgressList:[0,1,1,1,1,1,1,1,2],isReading:!1,submittedSize:0,submitProgress:0,pauseSend:!1,serverTaskId:""}},computed:{canSend:function(){return(this.txtContent.length||this.imgList.length)&&!this.isReading},totalSize:function(){var e=0;return this.txtContent.length>0&&(e+=1024),this.imgList.length>0&&this.imgList.map((function(t){e+=t.file.size})),e}},watch:{},created:function(){document.title=this.$t(document.title)},mounted:function(){var e=this;window.$(window).on("orientationchange.orientationchange",(function(){e.isLandscape=90==window.orientation||-90==window.orientation})),window.setTimeout((function(){e.isPageExpired=!0,"/error"!==e.$route.path&&e.$router.replace({path:"/error",query:{type:"pageExpired"}})}),216e5),this.getTerminalStateFn()},destroyed:function(){window.$(window).off(".orientationchange"),this.wuDestroy()},beforeRouteEnter:function(e,t,i){try{var n=new Date(Number(e.query.timestamp)).getTime(),s=Date.now();s-n>6e5?i({path:"/error",query:{type:"qrExpired"}}):i()}catch(o){i(),Object(m["a"])(o)}},beforeRouteLeave:function(e,t,i){if(this.isPageExpired)i();else{var n=window.confirm("Do you really want to leave?");n?i():i(!1)}},methods:{reset:function(){this.txtContent="",this.showSendingPopup=!1,this.imgList=[],this.imgProgressList=[0,0,0,0,0,0,0,0,0],this.isReading=!1,this.submittedSize=0,this.submitProgress=0,this.pauseSend=!1,this.serverTaskId="",this.wuDestroy(),document.title=this.$t("quickUpload.title")},getTerminalStateFn:function(e){var t=this;return new Promise((function(i){var n=e||t.$route.query.teid;n?g({teid:n}).then((function(e){0==e.errcode&&e.data&&"0"==e.data.state?(i("offline"),t.isPageExpired=!0,t.$router.replace({path:"/error",query:{type:"qrExpired"}})):i()})).catch((function(){i()})):i()}))},send:function(){var e=this;if(this.canSend){this.showSendingPopup=!0;var t=this.$route.query.teid;if(!t)return Object(m["a"])(this.$t("multimedia.failedToSend")),this.resetSend(),!1;this.getTerminalStateFn(t).then((function(i){if("offline"!==i){e.showSendingPopup=!0,document.title=e.$t("multimedia.beSending");var n="";try{n=x.detectMobile(),n=/Unknown/i.test(n.brand)?n.model:n.brand}catch(s){window.console.log(s)}h({name:"QuickUpload Task",type:"2",teid:t,userSystem:n}).then((function(t){if(!e.showSendingPopup)return!1;if(0==t.errcode){var i=t.data.id;e.serverTaskId=i,e.txtContent.length>0?b({kind:"4",taskId:i,content:JSON.stringify({index:1,kind:"4",color:"#333333",bold:"0",shadow:"0",text:e.txtContent}),index:1}).then((function(t){if(!e.showSendingPopup)return!1;if("success"===t.msg){e.submittedSize+=1024;var i=Math.floor(e.submittedSize/e.totalSize*100);e.submitProgress=i>100?100:e.submitProgress>i?e.submitProgress:i,e.imgList.length>0?e.wuInit():e.verdictSendComplete()}else window.console.log(t.msg),Object(m["a"])(e.$t("multimedia.failedToSend")),e.resetSend()})).catch((function(t){if(window.console.log(t),!e.showSendingPopup)return!1;Object(m["a"])(e.$t("multimedia.failedToSend")),e.resetSend()})):e.imgList.length>0&&e.wuInit()}else Object(m["a"])(e.$t("multimedia.failedToSend")),e.resetSend()})).catch((function(t){if(window.console.log(t),!e.showSendingPopup)return!1;Object(m["a"])(e.$t("multimedia.failedToSend")),e.resetSend()}))}}))}},imgBeforeRead:function(e){var t=this;return new Promise((function(i,n){if(Array.isArray(e)&&e.length>0){var s=e.length,o=e.filter((function(e){return window.console.log(e.type),t.imgAcceptReg.indexOf(e.type)>-1})).length;o===s?(t.showAddImgProgress(o),i()):0===o?(Object(m["a"])(t.$t("quickUpload.addImgFormatTips")),n()):(t.showAddImgProgress(o),Object(m["a"])(t.$t("quickUpload.addImgFormatTips")),i())}else window.console.log(e.type),t.imgAcceptReg.indexOf(e.type)>-1?(t.showAddImgProgress(1),i()):(Object(m["a"])(t.$t("quickUpload.addImgFormatTips")),n())}))},showAddImgProgress:function(e){var t=this.imgList.length,i=e+t;this.isReading=!0,this.imgProgressList=this.imgProgressList.map((function(e,n){var s=0;return s=n>=t&&n<i?1:n===i?2:0,s}))},progressAnimation:function(){return"animation-"+parseInt(5*Math.random())},imgAfterRead:function(){this.imgProgressList=[0,0,0,0,0,0,0,0,0],this.isReading=!1},undoSend:function(){var e=this;this.pauseSend=!0,o["a"].confirm({message:this.$t("multimedia.undoSendTips"),className:"mqu-dialog",cancelButtonText:this.$t("multimedia.waitAMoment"),confirmButtonText:this.$t("multimedia.undoSend")}).then((function(){v({id:e.serverTaskId}).then((function(){})).catch((function(e){window.console.log(e)})),e.resetSend()})).catch((function(){e.pauseSend=!1,e.verdictSendComplete()}))},resetSend:function(){this.showSendingPopup=!1,this.wuDestroy(),this.submitProgress=0,this.submittedSize=0,this.serverTaskId="",this.pauseSend=!1,o["a"].close(),document.title=this.$t("quickUpload.title")},verdictSendComplete:function(){var e=this;if(!this.showSendingPopup)return!1;this.submittedSize>=this.totalSize&&this.submitProgress>=100&&!this.pauseSend&&w({id:this.serverTaskId}).then((function(t){if(!e.showSendingPopup)return!1;0==t.errcode?(document.title=e.$t("multimedia.sentSuccessfully"),o["a"].close()):(Object(m["a"])(e.$t("multimedia.failedToSend")),e.resetSend())})).catch((function(t){if(window.console.log(t),!e.showUploadingPopup)return!1;Object(m["a"])(e.$t("multimedia.failedToSend")),e.resetSend()}))},wuInit:function(){var e=this;if(!this.showSendingPopup)return!1;this.uploader&&this.wuDestroy(),this.uploader=window.WebUploader.create({swf:this.$baseUrl+"lib/webuploader/Uploader.swf",server:this.baseURL+"/resource/upload",thumb:!1,compress:!1,prepareNextFile:!0,chunked:!0}),this.imgList.map((function(t,i){var n=new window.WebUploader.Lib.File(window.WebUploader.guid("rt_"),t.file),s=new window.WebUploader.File(n);s.extraIndex=i+(e.txtContent.length>0?2:1),e.uploader.addFiles(s),n=null,s=null})),this.wuUpload()},wuUpload:function(){var e=this;if(!this.uploader)return!1;this.uploader.on("uploadStart",(function(t){t.extraKind="2",t.extraTaskId=e.serverTaskId})),this.uploader.on("uploadBeforeSend",(function(e,t){t.md5=e.file.extraMd5,t.kind=e.file.extraKind,t.taskId=e.file.extraTaskId,t.index=e.file.extraIndex})),this.uploader.on("uploadProgress",(function(t,i){var n=Math.floor((e.submittedSize+(t.size||0)*i)/e.totalSize*100);e.submitProgress=n>100?100:e.submitProgress>n?e.submitProgress:n})),this.uploader.on("uploadError",(function(t,i){window.console.log("".concat(t.name," uploadError reason："),i),Object(m["a"])(e.$t("multimedia.failedToSend")),e.resetSend()})),this.uploader.on("uploadSuccess",(function(t,i){if("success"===i.msg){e.submittedSize+=t.size||0;var n=Math.floor((e.submittedSize+(t.size||0))/e.totalSize*100);e.submitProgress=n>100?100:e.submitProgress>n?e.submitProgress:n,e.verdictSendComplete()}else"upload_chunk"===i.msg||(Object(m["a"])(e.$t("multimedia.failedToSend")),e.resetSend())})),this.uploader.on("error",(function(t){window.console.log("errorType：",t),Object(m["a"])(e.$t("multimedia.failedToSend")),e.resetSend()})),this.uploader.upload()},wuDestroy:function(){if(!this.uploader)return!1;this.uploader.destroy(),this.uploader=null}}},k=P,O=(i("dc9a"),i("2877")),y=Object(O["a"])(k,n,s,!1,null,"3bf2188f",null);t["default"]=y.exports}}]);
//# sourceMappingURL=chunk-63fa42ee.03951b44.js.map