(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-05f935e1"],{"0889":function(t,e,n){"use strict";var i=n("2af3"),s=n.n(i);s.a},"2af3":function(t,e,n){},"4d48":function(t,e,n){"use strict";n("68ef"),n("bf60")},6511:function(t,e,n){"use strict";n.r(e);var i,s=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"home"},[n("van-row",{staticClass:"home-row",attrs:{type:"flex",justify:"center"}},[n("van-col",{attrs:{span:"20"}},[n("van-button",{staticClass:"home-btn",attrs:{round:"",type:"primary",size:"large",to:"/multimedia"}},[t._v(t._s(t.$t("multimedia.title")))])],1)],1),n("van-row",{attrs:{type:"flex",justify:"center"}},[n("van-col",{attrs:{span:"20"}},[n("van-button",{staticClass:"home-btn",attrs:{round:"",type:"info",size:"large",to:"/quickUpload"}},[t._v(t._s(t.$t("quickUpload.title")))])],1)],1)],1)},a=[],r=n("bd86"),o=(n("66b9"),n("b650")),u=(n("81e6"),n("9ffb")),c=(n("4d48"),n("d1e1")),f={name:"home",mixins:[],components:(i={},Object(r["a"])(i,c["a"].name,c["a"]),Object(r["a"])(i,u["a"].name,u["a"]),Object(r["a"])(i,o["a"].name,o["a"]),i),props:{},data:function(){return{}},computed:{},watch:{},created:function(){},mounted:function(){},destroyed:function(){},methods:{}},l=f,d=(n("0889"),n("2877")),p=Object(d["a"])(l,s,a,!1,null,null,null);e["default"]=p.exports},"7b0a":function(t,e,n){},"81e6":function(t,e,n){"use strict";n("68ef"),n("7b0a")},"9ffb":function(t,e,n){"use strict";var i=n("d282"),s=Object(i["a"])("col"),a=s[0],r=s[1];e["a"]=a({props:{span:[Number,String],offset:[Number,String],tag:{type:String,default:"div"}},computed:{gutter:function(){return this.$parent&&Number(this.$parent.gutter)||0},style:function(){var t=this.gutter/2+"px";return this.gutter?{paddingLeft:t,paddingRight:t}:{}}},methods:{onClick:function(t){this.$emit("click",t)}},render:function(){var t,e=arguments[0],n=this.span,i=this.offset;return e(this.tag,{style:this.style,class:r((t={},t[n]=n,t["offset-"+i]=i,t)),on:{click:this.onClick}},[this.slots()])}})},bf60:function(t,e,n){},d1e1:function(t,e,n){"use strict";var i=n("d282"),s=Object(i["a"])("row"),a=s[0],r=s[1];e["a"]=a({props:{type:String,align:String,justify:String,tag:{type:String,default:"div"},gutter:{type:[Number,String],default:0}},methods:{onClick:function(t){this.$emit("click",t)}},render:function(){var t,e=arguments[0],n=this.align,i=this.justify,s="flex"===this.type,a="-"+Number(this.gutter)/2+"px",o=this.gutter?{marginLeft:a,marginRight:a}:{};return e(this.tag,{style:o,class:r((t={flex:s},t["align-"+n]=s&&n,t["justify-"+i]=s&&i,t)),on:{click:this.onClick}},[this.slots()])}})}}]);
//# sourceMappingURL=chunk-05f935e1.399add99.js.map