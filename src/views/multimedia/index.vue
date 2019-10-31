<template>
  <div :class="['multimedia', { 'is-ios': isIOS, 'is-landscape': isLandscape  }]">
    <div class="multi-top">
      <div class="top">
        <!-- 顶部标题 -->
        <div class="title">{{$t('multimedia.title')}}</div>
        
        <!-- 添加提示 -->
        <div class="add-tips">{{$t('multimedia.addContentTips')}}</div>
      </div>
      
      <van-row class="options">
        <!-- 添加图片/视频 -->
        <van-col class="option-box" span="8" @click.native="addImgOrVideo">
          <van-uploader 
            name="imgOrVideoUploader"
            accept="/*"
            :preview-image="false"
            multiple
            :before-read="imgOrVideoBeforeRead"
            :after-read="imgOrVideoAfterRead"
            :max-size="(maxUploadTotal-curUploadTotal)*1024*1024"
            :max-count="(mediaLimitMap['img']+mediaLimitMap['video']-curMediaNumMap['img']-curMediaNumMap['video']) || 18"
            @oversize="imgOrVideoOversize"
          >
            <div class="option-uploader">
              <img class="option-img" src="../../assets/img/icon_picture_video.png" alt="icon_picture_video" />
              <span class="option-txt">{{$t('multimedia.imgOrVideo')}}</span>
            </div>
          </van-uploader>
        </van-col>
        
        <!-- 添加跑马灯 -->
        <van-col class="option-box" span="8" @click.native="addRunningLantern">
          <img class="option-img" src="../../assets/img/icon_horse_lantern_notice.png" alt="icon_horse_lantern_notice" />
          <span class="option-txt">{{$t('multimedia.runningLanternNotice')}}</span>
        </van-col>
        
        <!-- 添加文本 -->
        <van-col class="option-box" span="8" @click.native="addTextMessage">
          <img class="option-img" src="../../assets/img/icon_text_information.png" alt="icon_text_information" />
          <span class="option-txt">{{$t('multimedia.textMessage')}}</span>
        </van-col>
      </van-row>
    </div>
    
    <!-- 多媒体详情 -->
    <div class="multi-cont">
      <template v-if="curMediaList.length>0 || isReading">
        <!-- 多媒体内容 -->
        <div class="content">
          <!-- 读取图片/视频时 -->
          <template v-if="isReading">
            <img src="../../assets/img/image_occupancy_map.png" alt="image_occupancy_map" width="100%" height="100%" />
            
            <div class="reading-mask"></div>
            
            <div class="reading-progress">
              <van-progress
                class="reading-progress-cont"
                :percentage="readingProgress"
                :show-pivot="false"
                color="#008fff"
              />
            </div>
          </template>
          
          <template v-else-if="curMediaList.length>0 && curMediaIndex>-1">
            <!-- 图片内容 -->
            <template v-if="curMediaList[curMediaIndex].type==='img'">
              <van-image
                width="100%"
                height="100%"
                fit="contain"
                :src="curMediaList[curMediaIndex].data.content"
              />
            </template>
            
            <!-- 视频内容 -->
            <template v-else-if="curMediaList[curMediaIndex].type==='video'">
              <img src="../../assets/img/image_occupancy_map.png" alt="image_occupancy_map" width="100%" height="100%" />
            </template>
            
            <!-- 跑马灯内容 -->
            <template v-else-if="curMediaList[curMediaIndex].type === 'run'">
              <van-field
                class="mqu-field"
                v-model="curMediaList[curMediaIndex].data.content"
                type="textarea"
                :placeholder="$t('multimedia.clickInput')"
                readonly
                :style="{ 
                  color: curMediaList[curMediaIndex].data.content ? convertRGBA(curMediaList[curMediaIndex].data.color, curMediaList[curMediaIndex].data.content ? curMediaList[curMediaIndex].data.opacity : '1') : '#333333',
                  /*opacity: curMediaList[curMediaIndex].data.content ? curMediaList[curMediaIndex].data.opacity : '1',*/
                  fontWeight: curMediaList[curMediaIndex].data.content ? curMediaList[curMediaIndex].data.weight : 'normal',
                  textShadow: curMediaList[curMediaIndex].data.content ? curMediaList[curMediaIndex].data.shadow : '0 0 0',
                }"
                @click="editRunningLantern"
              />
            </template>
            
            <!-- 文本内容 -->
            <template v-else-if="curMediaList[curMediaIndex].type === 'txt'">
              <van-field
                class="mqu-field"
                v-model="curMediaList[curMediaIndex].data.content"
                type="textarea"
                :placeholder="$t('multimedia.clickInput')"
                readonly
                :style="{ 
                  color: curMediaList[curMediaIndex].data.content ? curMediaList[curMediaIndex].data.color : '#333333',
                  fontWeight: curMediaList[curMediaIndex].data.content ? curMediaList[curMediaIndex].data.weight : 'normal',
                  textShadow: curMediaList[curMediaIndex].data.content ? curMediaList[curMediaIndex].data.shadow : '0 0 0',
                }"
                @click="editTextMessage"
              />
            </template>
          </template>
        </div>
        
        <div class="subjoin" v-if="curMediaList.length>0 && curMediaIndex>-1 || isReading">
          <!-- 多媒体左下角信息 -->
          <div class="info">
            <!-- 正在读取 -->
            <template v-if="isReading">
              <span>{{$t('multimedia.waitMoment')}}</span>
            </template>
            
            <!-- 图片/视频信息 -->
            <template v-else-if="curMediaList[curMediaIndex].type==='img' || curMediaList[curMediaIndex].type==='video'">
              <div class="van-ellipsis info-name">{{curMediaList[curMediaIndex].data.file.name}}</div>
              <div>{{curMediaList[curMediaIndex].data.file.size | formatSize}} MB</div>
            </template>
            
            <!-- 跑马灯信息 -->
            <template v-else-if="curMediaList[curMediaIndex].type === 'run'">
              <marquee 
                class="info-run"
                direction="left"
                scrollamount="2"
              >{{$t('multimedia.runningLanternNotice')}}</marquee>
            </template>
            
            <!-- 文本信息 -->
            <template v-else-if="curMediaList[curMediaIndex].type === 'txt'">
              <div>{{$t('multimedia.textMessage')}}</div>
            </template>
          </div>
          
          <!-- 右下角操作 -->
          <div class="action">
            <!-- 取消读取 -->
            <!-- <template v-if="isReading">
              <span class="action-cancel" @click="cancelReading">{{$t('common.cancel')}}</span>
            </template> -->
            
            <!-- 删除内容 -->
            <template v-if="!isReading">
              <span class="action-remove" @click="removeMedia">{{$t('common.remove')}}</span>
            </template>
          </div>
        </div>
        
        <!-- 索引栏 -->
        <div class="bar" v-if="curMediaList.length>0 && curMediaIndex>-1">
          <span :class="['bar-left', { 'disable': curMediaIndex===0 }]" @click="--curMediaIndex;">
            <van-icon name="arrow-left" />
          </span>
          
          <span class="bar-cont">{{curMediaIndex+1}}/{{curMediaList.length}}</span>
          
          <span :class="['bar-right', { 'disable': curMediaIndex+1===curMediaList.length }]" @click="++curMediaIndex;">
            <van-icon name="arrow" />
          </span>
        </div>
      </template>
    </div>

    <!-- 底部上传 -->
    <div class="multi-bottom">
      <div class="bottom-box">
        <div class="upload-total">{{curUploadTotal}}/{{maxUploadTotal}} MB</div>
        
        <van-button 
          class="upload-btn" 
          size="large"
          :disabled="!canUpload" 
          @click="startUpload"
        >{{$t('multimedia.send')}}</van-button>
      </div>
    </div>
    
    <!-- 编辑跑马灯/文本信息 -->
    <van-popup
      class="multi-edit mqu-popup"
      v-model="showTextEditPopup"
      :duration="0"
      position="right"
      :style="{ minHeight: '100%', width: '100%' }"
      :close-on-click-overlay="false"
    >
      <!-- 顶部取消、完成操作 -->
      <div class="top">
        <div>
          <span class="top-cancel" @click="cancelEdit">{{$t('common.cancel')}}</span>
          <span class="top-length">{{tempTextEditData.content.length}}/{{curMediaList.length>0&&curMediaIndex>-1&&curMediaList[curMediaIndex].type==='run' ? runLengthLimit : txtLengthLimit}}</span>
          <span class="top-done" @click="textEditDone">{{$t('common.done')}}</span>
        </div>
      </div>
      
      <!-- 输入文本框 -->
      <div 
        v-if="curMediaList.length>0 && curMediaIndex>-1" 
        class="field" 
      >
        <van-field
          ref="editField"
          class="mqu-field mqu-field-fill"
          v-model="tempTextEditData.content"
          type="textarea"
          :maxlength="curMediaList[curMediaIndex].type==='run' ? runLengthLimit : txtLengthLimit"
          :placeholder="$t('multimedia.clickInput')"
          :style="{ 
            color: tempTextEditData.content ? convertRGBA(tempTextEditData.color, curMediaList[curMediaIndex].type==='run'&&tempTextEditData.content ? tempTextEditData.opacity : '1') : '#333333',
            /*opacity: curMediaList[curMediaIndex].type==='run'&&tempTextEditData.content ? tempTextEditData.opacity : '1',*/
            fontWeight: tempTextEditData.content ? tempTextEditData.weight : 'normal',
            textShadow: tempTextEditData.content ? tempTextEditData.shadow : '0 0 0',
          }"
          @focus="isShowTabStyle = false;"
          @blur="isShowTabStyle = true;"
        />
      </div>
      
      <!-- 切换栏 -->
      <div 
        v-if="curMediaList.length>0 && curMediaIndex>-1" 
        class="bar" 
        :style="{ marginBottom: (isMiuiBrowser&&!isShowTabStyle ? 50 : 0) + 'px' }" 
      >
        <van-row class="bar-tab" type="flex" justify="center">
          <van-col span="12" :class="['bar-tab-keyboard', { 'active': isShowTabStyle===false }]" @click.native="$refs['editField'].focus();">
            <img v-show="isShowTabStyle" src="../../assets/img/icon_keyboard_normal.png" alt="icon_keyboard_normal" />
            <img v-show="!isShowTabStyle" src="../../assets/img/icon_keyboard_selected.png" alt="icon_keyboard_selected" />
            <span>{{$t('multimedia.keyboard')}}</span>
          </van-col>
          
          <van-col span="12" :class="['bar-tab-style', { 'active': isShowTabStyle===true }]" @click.native="isShowTabStyle = true;">
            <img v-show="isShowTabStyle" src="../../assets/img/icon_style_selected.png" alt="icon_style_selected" />
            <img v-show="!isShowTabStyle" src="../../assets/img/icon_style_normal.png" alt="icon_style_normal" />
            <span>{{$t('multimedia.style')}}</span>
          </van-col>
        </van-row>
        
        <!-- 样式栏 -->
        <div class="bar-cont" :style="{ height: (editBarContHeight/75) + 'rem' }">
          <template v-if="isShowTabStyle">
            <!-- 颜色 -->
            <div class="style-color">
              <div class="style-label">
                <span 
                  class="style-color-txt" 
                  :style="{ background: styleColorList[styleColorSlider] }"></span>
              </div>
                
              <van-slider 
                class="style-color-cont"
                v-model="styleColorSlider" 
                :min="0" 
                :max="24" 
                :step="1"
                :bar-height="(25/75) + 'rem'"
                active-color="rgba(0, 0, 0, 0)"
                @input="tempTextEditData.color = styleColorList[styleColorSlider];"
                @drag-start="styleColorDragStart()"
                @drag-end="styleColorDragEnd()"
              >
                <div 
                  slot="button" 
                  class="style-color-button"
                  :style="{ background: styleColorList[styleColorSlider] }"
                >
                  <span id="styleColorButton" class="title" :style="{ background: styleColorList[styleColorSlider] }"></span>
                </div>
              </van-slider>
            </div>
            
            <!-- 透明度 -->
            <div 
              class="style-opacity" 
              v-show="curMediaList[curMediaIndex].type === 'run'">
              <div class="style-label">
                <span class="style-opacity-txt">{{parseInt(styleOpacitySlider)}}%</span>
              </div>
              
              <van-slider 
                class="style-opacity-cont mqu-slider"
                v-model="styleOpacitySlider" 
                :bar-height="(20/75) + 'rem'"
                active-color="#008fff"
                inactive-color="#eeeff0"
                @input="tempTextEditData.opacity = styleOpacitySlider/100;"
                />
            </div>
            
            <!-- 粗体 -->
            <div class="style-weight">
              <div class="style-label">
                <span class="style-weight-txt">{{$t('multimedia.bold')}}</span>
              </div>
              
              <van-switch 
                class="style-weight-cont"
                v-model="styleWeightChecked" 
                :size="(50/75) + 'rem'"
                active-color="#008fff"
                inactive-color="#999"
                @change="tempTextEditData.weight = (styleWeightChecked ? 'bold' : 'normal')" />
            </div>
            
            <!-- 阴影 -->
            <div class="style-shadow">
              <div class="style-label">
                <span class="style-shadow-txt">{{$t('multimedia.shadow')}}</span>
              </div>
              
              <van-switch 
                class="style-shadow-cont"
                v-model="styleShadowChecked" 
                :size="(50/75) + 'rem'"
                active-color="#008fff"
                inactive-color="#999"
                @change="tempTextEditData.shadow = (styleShadowChecked ? '0 2px 3px' : '0 0 0')" />
            </div>
          </template>	
        </div>
      </div>
    </van-popup>
    
    <!-- 提交后台 -->
    <van-popup
      class="multi-submit mqu-popup"
      v-model="showUploadingPopup"
      :duration="0"
      position="right"
      :style="{ minHeight: '100%', width: '100%' }"
      :close-on-click-overlay="false"
    >
      <!-- 上传完成 -->
      <template v-if="submittedNum===curMediaList.length && submitProgress===100 && !stopUpload">
        <div class="end">
          <div class="end-img">
            <img src="../../assets/img/icon.png" alt="icon" width="100%" height="100%" />
          </div>
          
          <van-button 
            class="end-return" 
            round 
            @click="reset"
          >{{$t('multimedia.returnHome')}}</van-button>
        </div>
      </template>
      
      <!-- 等待中 -->
      <template v-else>
        <div class="submit">
          <div class="submit-tips">
            <div>{{$t('multimedia.beSending')}}</div>
            <div>{{$t('multimedia.pleaseNotClosePage')}}</div>
          </div>
          
          <div class="submit-progress">
            <div class="submit-progress-txt">{{submittedNum}}/{{curMediaList.length}}</div>
            
            <van-progress
              class="submit-progress-cont"
              :percentage="submitProgress"
              :show-pivot="false"
              color="#008fff"
            />
          </div>
          
          <van-button 
            class="submit-cancel" 
            round 
            @click="undoSend"
          >{{$t('multimedia.undoSend')}}</van-button>
        </div>
      </template>
    </van-popup>
  </div>
</template>

<script>
import { Row, Col, Button, Toast, Uploader, Image, Progress, Icon, Dialog, Field, Popup, Slider, Switch } from 'vant';
import baseURL from '@/api/config';
import { createTask, deleteTask, performTask, uploadNonFile } from '@/api/multimedia';
import { myMixin } from '@/utils/mixins';

Toast.setDefaultOptions({
  className: 'mqu-toast',
});
    
export default {
  name: 'multimedia',

  mixins: [ myMixin ],

  components: {
    [Row.name]: Row,
    [Col.name]: Col,
    [Button.name]: Button,
    [Uploader.name]: Uploader,
    [Image.name]: Image,
    [Progress.name]: Progress,
    [Icon.name]: Icon,
    [Field.name]: Field,
    [Popup.name]: Popup,
    [Slider.name]: Slider,
    [Switch.name]: Switch,
  },

  props: {},

  data() {
    return {
      baseURL, // 根据环境设置的全局请求路径
      curUploadTotal: 0, // 当前已上传容量（动态）
      maxUploadTotal: 128, // 最大可上传容量
      curMediaIndex: -1, // 当前显示哪个多媒体素材（动态）
      curMediaList: [], // 当前各种多媒体素材已添加集合（动态）
      mediaLimitMap: {
        img: 9,
        video: 9,
        run: 1,
        txt: 1,
      }, // 各种多媒体素材最多上传数量限制图
      isReading: false, // 当前是否正在读取图片/视频数据（动态）
      readingProgress: 0, // 正在读取图片/视频数据显示进度（动态）
      imgOrVideoAccept: "image/*, video/*", // 图片/视频文件支持的格式
      imgAcceptReg: /image\/*/i, // 图片文件支持的格式正则表达式
      videoAcceptReg: /(video\/*)/i, // 视频文件支持的格式正则表达式
      imgOrVideoAcceptReg: /(image\/*)|(video\/*)/i, // 图片/视频文件支持的格式正则表达式
      curReadingImgOrVideoNum: 0, // 当次读取的图片/视频文件的总数量，用于取消操作（动态）
      tempBeforeReadImgOrVideoTotal: 0, // 在当次读取的图片/视频文件前的已用容量，用于取消操作（动态）
      showTextEditPopup: false, // 是否显示跑马灯/文本信息编辑界面（动态）
      showUploadingPopup: false, // 是否显示上传等待界面（动态）
      tempTextEditData: {
        content: '',
        color: '#333333',
        opacity: '1', // 文本信息没有此属性
        weight: 'normal', // ON 为 bold
        shadow: '0 0 0', // ON 为 0 2px 3px
      }, // 缓存编辑跑马灯/文本的信息，未点击“完成”不进行更新（动态）
      isIOS: /(\(i[^;]+;( U;)? CPU.+Mac OS X)|(iPhone)|(iPad)|(iPod)/i.test(navigator.userAgent), // 判断是否iOS系统
      isMiuiBrowser: /MiuiBrowser/i.test(navigator.userAgent), // 判断是否小米浏览器
      oIsLandscape: (window.orientation==90 || window.orientation==-90), // 初始化时设备是否为横屏
      isLandscape: (window.orientation==90 || window.orientation==-90), // 是否横屏
      isShowTabStyle: false, // 编辑文本界面是否激活 “样式” Tab（动态）
      styleColorList: ['#ffffff','#9a9791','#6a6663','#34302f','#333333','#2d2824','#191814','#a86e35','#7e0e14','#c20e17','#e51b27','#e4451f','#ea7527','#f1c03c','#b4da4b','#7eb63e','#33862e','#88d9f3','#0994f5','#1064d4','#1b1c6f','#381a6c','#76128d','#e43b86','#f1cdd5'],
      styleColorSlider: 4, // 颜色条索引（动态）
      styleOpacitySlider: 100, // 透明度（动态）
      styleWeightChecked: false, // 是否加粗（动态）
      styleShadowChecked: false, // 是否阴影（动态）
      submitProgress: 0, // 当前提交后台的上传进度（动态）
      submittedNum: 0, // 当前已提交后台的内容数量（动态）
      uploader: null, // WebUploader 实例对象（动态）
      serverTaskId: '', // 后台任务ID（动态）
      stopUpload: false, // 是否暂停上传（动态）
      isPageExpired: false, // 网页是否过期
      runLengthLimit: 80, // 跑马灯输入文字长度限制
      txtLengthLimit: 240, // 跑马灯输入文字长度限制
    }
  },

  computed: {
    // 当前是否可点击底部的 “上传” 按钮
    canUpload() {
      return this.curMediaList.length>0 && !this.isReading;
    },
    
    // 当前各种多媒体素材已添加数量图
    curMediaNumMap() {
      let _map = {
        img: 0,
        video: 0,
        run: 0,
        txt: 0,
      };
      
      this.curMediaList.map((item) => item.type && ++_map[item.type] || 0);
      
      // window.console.log('更新已添加多媒体：', _map);
      return _map;
    },
    
    // 编辑页面样式内容高度
    editBarContHeight() {
      const _scrollHeight = document.body.scrollHeight || document.documentElement.scrollHeight;
      const _scrollWidth = document.body.scrollWidth || document.documentElement.scrollWidth;
      let _height = 0;
      
      if (this.isIOS) {
        _height = (!this.oIsLandscape&&this.isLandscape ? _scrollWidth : _scrollHeight) - (this.isLandscape ? -80 : (screen.height==812&&screen.width==375 ? -20 : 30));
      } else {
        _height = this.isShowTabStyle ? (this.isLandscape ? 315 : 415) : 3;
      }
      
      return _height;
    }
  },

  filters: {
    // 格式化文件大小，不足1MB算1MB，向上取整
    formatSize(size) {
      return size<1024*1024 ? 1 : Math.ceil(size/(1024*1024));
    }
  },

  watch: {},

  created() {
    document.title = this.$t('multimedia.title');
  },
  
  mounted() {
    // 屏幕旋转
    window.$(window).on('orientationchange.orientationchange', () => {
      this.isLandscape = (window.orientation==90 || window.orientation==-90);
    });
    
    // 网页访问6小时后过期
    window.setTimeout(() => {
      this.isPageExpired = true;
      
      this.$router.replace({
        path: '/error',
        query: {
          type: 'pageExpired'
        }
      });
    }, 6*60*60000);
  },
  
  destroyed() {
    window.$(window).off('.orientationchange');
    this.wuDestroy();
  },
  
  beforeRouteEnter (to, from, next) {
    try {
      const qrTimestamp = new Date(Number(to.query.timestamp)).getTime();
      const nowTimestamp = Date.now();
      
      if (nowTimestamp-qrTimestamp > 10*60000) {
        // 二维码生成10分钟后过期
        next({
            path: '/error',
            query: {
              type: 'qrExpired'
            }
        });
      } else {
        next();
      }
    } catch (err) {
      next();
      Toast(err);
    }
  },
  
  beforeRouteLeave (to, from , next) {
    if (this.isPageExpired) {
      next();
    } else {
      const answer = window.confirm('Do you really want to leave?');
      
      if (answer) {
        next();
      } else {
        next(false);
      }
    }
  },
  
  methods: {
    // 重置 data 变量
    reset() {
      this.curUploadTotal = 0;
      this.curMediaIndex = -1;
      this.curMediaList = [];
      this.isReading = false;
      this.readingProgress = 0;
      this.curReadingImgOrVideoNum = 0;
      this.tempBeforeReadImgOrVideoTotal = 0;
      this.showTextEditPopup = false;
      this.showUploadingPopup = false;
      this.tempTextEditData =  {
        content: '',
        color: '#333333',
        opacity: '1',
        weight: 'normal',
        shadow: '0 0 0',
      };
      this.isShowTabStyle = false;
      this.styleColorSlider = 4;
      this.styleOpacitySlider = 100;
      this.styleWeightChecked = false;
      this.styleShadowChecked = false;
      this.submitProgress = 0;
      this.submittedNum = 0;
      this.wuDestroy();
      this.serverTaskId = '';
      this.stopUpload = false;
      document.title = this.$t('multimedia.title');
    },
    
    // 添加 “图片/视频”
    addImgOrVideo($event) {
      if (this.curUploadTotal >= this.maxUploadTotal) { 
        // 文件大小超过上限
        Toast(this.$t('multimedia.addImgOrVideoOversizeTips', { num: this.maxUploadTotal }));
        $event.preventDefault();
        $event.stopPropagation();
        return false;
      } else if (this.curMediaNumMap['img']+this.curMediaNumMap['video'] >= this.mediaLimitMap['img']+this.mediaLimitMap['video']) { 
        // 图片/视频超上限
        Toast(this.$t('multimedia.addImgOrVideoLimitTips', { num: this.mediaLimitMap['img'] }));
        $event.preventDefault();
        $event.stopPropagation();
        return false;
      } else if (this.curMediaNumMap['img'] >= this.mediaLimitMap['img']) { 
        // 图片超上限
        Toast(this.$t('multimedia.addImgLimitTips', { num: this.mediaLimitMap['img'] }));
      } else if (this.curMediaNumMap['video'] >= this.mediaLimitMap['video']) { 
        // 视频超上限
        Toast(this.$t('multimedia.addVideoLimitTips', { num: this.mediaLimitMap['video'] }));
      }
    },
    
    // 添加 “图片/视频” - 文件读取前的回调函数，返回false可终止文件读取，支持返回Promise
    imgOrVideoBeforeRead(file/*, detail*/) {
      return new Promise((resolve, reject) => {
        if (Array.isArray(file) && file.length>0) { 
          // 多选文件
          const totalNum = file.length;
          const validNum = file.filter(item => this.imgOrVideoAcceptReg.test(item.type)).length;
          
          if (validNum === totalNum) { 
            // 均为合法格式文件
            this.showAddImgOrVideoProgress();
            resolve();
          } else if (validNum === 0) { 
            // 均为非法格式文件
            Toast(this.$t('multimedia.addImgOrVideoFormatTips'));
            reject();
          } else { 
            // 含非法格式文件
            this.showAddImgOrVideoProgress();
            Toast(this.$t('multimedia.addImgOrVideoFormatTips'));
            resolve();
          }
        } else { 
          // 单选文件
          if (this.imgOrVideoAcceptReg.test(file.type)) {
            this.showAddImgOrVideoProgress();
            resolve();
          } else {
            Toast(this.$t('multimedia.addImgOrVideoFormatTips'));
            reject();
          }
        }
      });
    },
    
    // 添加 “图片/视频” - 文件读取完成后的回调函数
    imgOrVideoAfterRead(file/*, detail*/) {
      let _curMediaNumMap = {
        img: this.curMediaNumMap['img'],
        video: this.curMediaNumMap['video'],
      };
      
      // 重置当次读取数量、缓存旧容量
      this.curReadingImgOrVideoNum = 0;
      this.tempBeforeReadImgOrVideoTotal = this.curUploadTotal;
      
      if (Array.isArray(file) && file.length>0) { 
        // 多选文件
        file.map(item => {
          let _type = this.imgAcceptReg.test(item.file.type) ? 'img' : 'video';
          
          if (this.curUploadTotal*1024*1024+item.file.size >= this.maxUploadTotal*1024*1024) { 
            // 添加此文件导致超出大小上限
            Toast(this.$t('multimedia.addImgOrVideoOversizeTips', { num: this.maxUploadTotal }));
          } else if (_curMediaNumMap[_type] >= this.mediaLimitMap[_type]) { 
            // 添加此文件导致超出数量上限
            Toast(this.$t(_type==='img'?'multimedia.addImgLimitTips':'multimedia.addVideoLimitTips', { num: this.mediaLimitMap[_type] }));
          } else if (this.isReading) {
            // 没有取消操作才继续读取
            this.curMediaIndex = [this.curMediaList.length-1];
            this.curMediaList.push({
              type: _type,
              data: item,
            });
            _curMediaNumMap[_type]++;
            this.curMediaIndex++;
            this.curUploadTotal += (item.file.size<1024*1024 ? 1 : Math.ceil(item.file.size/(1024*1024)));
            this.curReadingImgOrVideoNum++;
          }
        });
      } else {
        let _type = this.imgAcceptReg.test(file.file.type) ? 'img' : 'video';
        
        if (this.curUploadTotal*1024*1024+file.file.size >= this.maxUploadTotal*1024*1024) { 
          // 添加此文件导致超出大小上限
          Toast(this.$t('multimedia.addImgOrVideoOversizeTips', { num: this.maxUploadTotal }));
        } else if (_curMediaNumMap[_type] >= this.mediaLimitMap[_type]) { 
          // 添加此文件导致超出数量上限
          Toast(this.$t(_type==='img'?'multimedia.addImgLimitTips':'multimedia.addVideoLimitTips', { num: this.mediaLimitMap[_type] }));
        } else if (this.isReading) {
          // 没有取消操作才继续读取
          this.curMediaIndex = [this.curMediaList.length-1];
          this.curMediaList.push({
            type: _type,
            data: file,
          });
          this.curMediaIndex++;
          this.curUploadTotal += (file.file.size<1024*1024 ? 1 : Math.ceil(file.file.size/(1024*1024)));
          this.curReadingImgOrVideoNum++;
        }
      }
      
      this.readingProgress = 95;
      window.setTimeout(() => {
        Dialog.close();
        this.readingProgress = 100;
        this.isReading = false;
      }, 888);
    },
    
    // 添加 “图片/视频” - 文件大小超过限制时触发
    imgOrVideoOversize() {
      Toast(this.$t('multimedia.addImgOrVideoOversizeTips', { num: this.maxUploadTotal }));
      this.isReading = false;
      this.readingProgress = 0;
    },
    
    // 添加 “图片/视频” - 显示进度
    showAddImgOrVideoProgress() {
      if (this.isReading) { 
        // 正在读取数据时再次添加素材
        this.readingProgress = 0;
        window.setTimeout(() => {
          this.readingProgress = 50;
        }, 333);
      } else {
        this.isReading = true;
        this.readingProgress = 50;
      }
    },
    
    // 取消读取图片/视频
    cancelReading() {
      Dialog.confirm({
        message: this.$t('multimedia.readingCancelUploadTips'),
        className: 'mqu-dialog',
        cancelButtonText: this.$t('multimedia.waitAMoment'),
        confirmButtonText: this.$t('multimedia.cancelUpload'),
      }).then(() => { 
        // 右侧按钮（执行）
        if (this.isReading) {
          // 取消读取
          if (this.curReadingImgOrVideoNum > 0) {
            // 有至少一个读取成功
            let _num = this.curReadingImgOrVideoNum;
            let _oldLen = this.curMediaList.length;
            
            this.curUploadTotal = this.tempBeforeReadImgOrVideoTotal;
            this.curMediaIndex = [_oldLen-1];
            this.curMediaIndex -= _num;
            this.curMediaList.splice(_oldLen-_num, _num);
            this.curReadingImgOrVideoNum = 0;
            
            if (this.curMediaIndex===-1 && this.curMediaList.length>0) this.curMediaIndex = 0;
          }
          
          this.isReading = false;
          this.readingProgress = 0;
        }
      }).catch(() => {
        // 左侧按钮（不执行）
      });
    },
    
    // 添加 “跑马灯”
    addRunningLantern() {
      const _index = this.curMediaList.findIndex(item => item.type === 'run');
      
      if (_index > -1) {
        this.curMediaIndex = _index;
        Toast(this.$t('multimedia.addRunLimitTips'));
        return false;
      }
      
      this.curMediaList.push({
        type: 'run',
        data: {
          content: '',
          color: '#333333',
          opacity: '1',
          weight: 'normal',
          shadow: '0 0 0',
        },
      });
      this.curMediaIndex = this.curMediaList.length - 1;
      this.styleColorSlider = 4;
      this.styleOpacitySlider = 100;
      this.styleWeightChecked = false;
      this.styleShadowChecked = false;
    },
    
    // 编辑 “跑马灯”
    editRunningLantern() {
      this.isShowTabStyle = false;
      this.showTextEditPopup = true;
      this.tempTextEditData.content = this.curMediaList[this.curMediaIndex].data.content;
      this.tempTextEditData.color = this.curMediaList[this.curMediaIndex].data.color;
      this.tempTextEditData.opacity = this.curMediaList[this.curMediaIndex].data.opacity;
      this.tempTextEditData.weight = this.curMediaList[this.curMediaIndex].data.weight;
      this.tempTextEditData.shadow = this.curMediaList[this.curMediaIndex].data.shadow;
      this.styleColorSlider = this.styleColorList.indexOf(this.tempTextEditData.color);
      this.styleOpacitySlider = this.tempTextEditData.opacity * 100;
      this.styleWeightChecked = this.tempTextEditData.weight === 'bold';
      this.styleShadowChecked = this.tempTextEditData.shadow === '0 2px 3px';
      document.title = this.$t('multimedia.edit');
      
      this.$nextTick(() => {
        if (this.isIOS) {
          this.$refs['editField'].focus();
        } else {
          setTimeout(() => {
            this.$refs['editField'].focus();
          }, 300);
        }
      });
    },
    
    // 添加 “文本信息”
    addTextMessage() {
      const _index = this.curMediaList.findIndex(item => item.type === 'txt');
      
      if (_index > -1) {
        this.curMediaIndex = _index;
        Toast(this.$t('multimedia.addTxtLimitTips'));
        return false;
      }
      
      this.curMediaList.push({
        type: 'txt',
        data: {
          content: '',
          color: '#333333',
          weight: 'normal',
          shadow: '0 0 0',
        },
      });
      this.curMediaIndex = this.curMediaList.length - 1;
      this.styleColorSlider = 4;
      this.styleWeightChecked = false;
      this.styleShadowChecked = false;
    },
    
    // 编辑 “文本信息”
    editTextMessage() {
      this.isShowTabStyle = false;
      this.showTextEditPopup = true;
      this.tempTextEditData.content = this.curMediaList[this.curMediaIndex].data.content;
      this.tempTextEditData.color = this.curMediaList[this.curMediaIndex].data.color;
      this.tempTextEditData.weight = this.curMediaList[this.curMediaIndex].data.weight;
      this.tempTextEditData.shadow = this.curMediaList[this.curMediaIndex].data.shadow;
      this.styleColorSlider = this.styleColorList.indexOf(this.tempTextEditData.color);
      this.styleWeightChecked = this.tempTextEditData.weight === 'bold';
      this.styleShadowChecked = this.tempTextEditData.shadow === '0 2px 3px';
      document.title = this.$t('multimedia.edit');
      
      this.$nextTick(() => {
        if (this.isIOS) {
          this.$refs['editField'].focus();
        } else {
          setTimeout(() => {
            this.$refs['editField'].focus();
          }, 300);
        }
      });
    },
    
    // 取消跑马灯/文本编辑
    cancelEdit() {
      this.showTextEditPopup = false;
      document.title = this.$t('multimedia.title');
    },
    
    // 完成跑马灯/文本编辑
    textEditDone() {
      this.curMediaList[this.curMediaIndex].data.content = this.tempTextEditData.content;
      this.curMediaList[this.curMediaIndex].data.color = this.tempTextEditData.color;
      if (this.curMediaList[this.curMediaIndex].type === 'run') 
        this.curMediaList[this.curMediaIndex].data.opacity = this.tempTextEditData.opacity;
      this.curMediaList[this.curMediaIndex].data.weight = this.tempTextEditData.weight;
      this.curMediaList[this.curMediaIndex].data.shadow = this.tempTextEditData.shadow;
      this.showTextEditPopup = false;
      document.title = this.$t('multimedia.title');
    },
    
    // 删除多媒体
    removeMedia() {
      Dialog.confirm({
        message: this.$t('multimedia.removeContentTips'),
        className: 'mqu-dialog',
        cancelButtonText: this.$t('common.cancel'),
        confirmButtonText: this.$t('common.remove'),
      }).then(() => { 
        // 右侧按钮（执行）
        if (!this.isReading) {
          // 删除单个文件
          let _index = this.curMediaIndex;
          let _type = this.curMediaList[_index].type;
          
          if (_type==='img' || _type==='video') {
            let _size = this.curMediaList[_index].data.file.size;
            
            this.curUploadTotal -= (_size<1024*1024 ? 1 : Math.ceil(_size/(1024*1024)));
          }
          
          this.curMediaList.splice(_index, 1);
          
          if (_index==0 && this.curMediaList.length>0) {
            this.curMediaIndex = 0;
          } else {
            this.curMediaIndex--;
          }
        }
      }).catch(() => {
        // 左侧按钮（不执行）
      });
    },
    
    // 开始拖动颜色块时触发
    styleColorDragStart() {
      window.$('#styleColorButton').css('opacity', '1');
    },
    
    // 	结束拖动颜色块时触发
    styleColorDragEnd() {
      window.$('#styleColorButton').css('opacity', '0');
    },
    
    // 转换透明度为十六进制（暂不用）
    convertOpacity(val) {
      let opacity = parseFloat(val) || 0;
      
      if (opacity > 100) {
        opacity = 1;
      } else if (1<opacity && opacity<100) {
        opacity = parseInt(opacity)/100;
      } else if (0 > opacity) {
        opacity = 0;
      }
      
      let num = Math.floor((Math.floor(opacity*100)/100)*255);
      let num_change = num.toString(16);
      
      if (num_change.length == 1){
        num_change = "0" + num_change;
      }
      
      return num_change.toUpperCase();
    },
    
    // 十六进制颜色值和透明度数值转rgba
    convertRGBA(color, opacity) {
      let _color = color.charAt(0)=='#' ? color.substring(1, 7) : color;
      let _opacity = parseFloat(opacity) || 0;
      let _colorLen = _color.length;
      
      if (_colorLen!=3 && _colorLen!=6) {
        return 'rgba(0,0,0,1)';
      } else if (_colorLen == 3) {
        _color = _color.substring(0, 1) + _color.substring(0, 1) + _color.substring(1, 2) + _color.substring(1, 2) + _color.substring(2) + _color.substring(2);
      }
      
      if (_opacity > 100) {
        _opacity = 1;
      } else if (1<_opacity && _opacity<100) {
        _opacity = parseInt(_opacity)/100;
      } else if (0 > _opacity) {
        _opacity = 0;
      }
      
      return 'rgba(' + 
        (parseInt(_color.substring(0, 2), 16)||0) + ',' +
        (parseInt(_color.substring(2, 4), 16)||0) + ',' +
        (parseInt(_color.substring(4, 6), 16)||0) + ',' +
        _opacity +
        ')';
    },
    
    // 点击底部的 “上传” 触发
    startUpload() {
      const _runIndex = this.curMediaList.findIndex(item => item.type === 'run');
      const _txtIndex = this.curMediaList.findIndex(item => item.type === 'txt');
      
      if (this.curUploadTotal > this.maxUploadTotal) {
        Toast(this.$t('multimedia.addImgOrVideoOversizeTips', { num: this.maxUploadTotal }));
        return false;
      }
      
      if (_runIndex>-1 && this.curMediaList[_runIndex].data.content.length===0) {
        Toast(this.$t('multimedia.pleaseFillRunningLanternNotice'));
        return false;
      }
      
      if (_txtIndex>-1 && this.curMediaList[_txtIndex].data.content.length===0) {
        Toast(this.$t('multimedia.pleaseFillTextMessage'));
        return false;
      }
      
      const _teid = this.$route.query.teid;
      // window.console.log(`终端ID：${_teid}`);
      
      if (!_teid) {
        Toast(this.$t('multimedia.failedToSend'));
        this.resetUpload();
        return false;
      }
      
      this.showUploadingPopup = true;
      document.title = this.$t('multimedia.beSending');
      
      // 创建任务
      createTask({
        name: '多媒体任务',
        type: '1',
        teid: _teid,
      }).then(res => {
        // window.console.log(res);
        
        if (!this.showUploadingPopup) return false;
        
        if (res.errcode == 0) {
          let _taskId = res.data.id;
          
          this.serverTaskId = _taskId;
          
          if (_runIndex>-1 || _txtIndex>-1) {
            // 有跑马灯则上传跑马灯；没跑马灯，马上返回一个resolved状态的 Promise 对象
            const p1 = _runIndex>-1 ? this.uploadRunOrTxt({
              kind: '3',
              taskId: _taskId,
              content: JSON.stringify({
                "index": _runIndex + 1,
                "kind": "3",
                "transparency": parseInt(this.curMediaList[_runIndex].data.opacity*100),
                "color": this.curMediaList[_runIndex].data.color,
                "bold": this.curMediaList[_runIndex].data.weight==='normal' ? "0" : "1",
                "shadow": this.curMediaList[_runIndex].data.shadow==='0 0 0' ? "0" : "1",
                "text": this.curMediaList[_runIndex].data.content,
              }),
              index: _runIndex + 1,
            }) : Promise.resolve();
            // 有文本信息则上传文本信息；没文本信息，马上返回一个resolved状态的 Promise 对象
            const p2 = _txtIndex>-1 ? this.uploadRunOrTxt({
              kind: '4',
              taskId: _taskId,
              content: JSON.stringify({
                "index": _txtIndex + 1,
                "kind": "4",
                "color": this.curMediaList[_txtIndex].data.color,
                "bold": this.curMediaList[_txtIndex].data.weight==='normal' ? "0" : "1",
                "shadow": this.curMediaList[_txtIndex].data.shadow==='0 0 0' ? "0" : "1",
                "text": this.curMediaList[_txtIndex].data.content,
              }),
              index: _txtIndex +1 ,
            }) : Promise.resolve();
            
            Promise.all([p1, p2]).then(() => {
              if (!this.showUploadingPopup) return false;
              
              this.submitProgress = Math.floor((_runIndex>-1&&_txtIndex>-1 ? 2 : 1)/this.curMediaList.length*100);
              this.submittedNum = _runIndex>-1&&_txtIndex>-1 ? 2 : 1;
              
              if (this.curMediaNumMap['img']+this.curMediaNumMap['video'] > 0) {
                // 1、上传资源中含跑马灯/文本信息，还含图片/视频
                this.wuInit();
              } else {
                // 2、上传资源中仅含跑马灯/文本信息，不含图片/视频
                this.verdictUploadComplete();
              }
            }).catch(er => {
              window.console.log(er);
              
              if (!this.showUploadingPopup) return false;
              Toast(this.$t('multimedia.failedToSend'));
              this.resetUpload();
            });
          } else if (this.curMediaNumMap['img']+this.curMediaNumMap['video'] > 0) {
            // 3、上传资源中不含跑马灯/文本信息，仅含图片/视频
            this.wuInit();
          }
        } else {
          Toast(this.$t('multimedia.failedToSend'));
          this.resetUpload();
        }
      }).catch(err => {
        window.console.log(err);
        
        if (!this.showUploadingPopup) return false;
        Toast(this.$t('multimedia.failedToSend'));
        this.resetUpload();
      });
    },
    
    // 取消发送
    undoSend() {
      this.stopUpload = true;
      
      Dialog.confirm({
        message: this.$t('multimedia.undoSendTips'),
        className: 'mqu-dialog',
        cancelButtonText: this.$t('multimedia.waitAMoment'),
        confirmButtonText: this.$t('multimedia.undoSend'),
      }).then(() => {
        deleteTask({
          id: this.serverTaskId
        }).then((/*res*/) => {
          // window.console.log(res);
        }).catch(err => {
          window.console.log(err);
        });
        
        this.resetUpload();
      }).catch(() => {
        // 左侧按钮，继续上传
        this.stopUpload = false;
        this.verdictUploadComplete();
      });
    },
    
    // 取消发送，恢复上传数据为默认值
    resetUpload() {
      this.showUploadingPopup = false;
      this.wuDestroy();
      this.submitProgress = 0;
      this.submittedNum = 0;
      this.serverTaskId = '';
      this.stopUpload = false;
      Dialog.close();
      document.title = this.$t('multimedia.title');
    },
    
    // 判断当前是否全部上传完成
    verdictUploadComplete() {
      if (!this.showUploadingPopup) return false;
      
      if (this.submittedNum>=this.curMediaList.length && this.submitProgress>=100 && !this.stopUpload) {
        performTask({
          id: this.serverTaskId
        }).then(res => {
          // window.console.log(res);
          
          if (!this.showUploadingPopup) return false;
          
          if (res.errcode == 0) {
            // 最终完成！
            document.title = this.$t('multimedia.sentSuccessfully');
            Dialog.close();
          } else {
            Toast(this.$t('multimedia.failedToSend'));
            this.resetUpload();
          }
        }).catch(err => {
          window.console.log(err);
          
          if (!this.showUploadingPopup) return false;
          Toast(this.$t('multimedia.failedToSend'));
          this.resetUpload();
        });
      }
    },
    
    // 上传跑马灯/文本信息资源
    uploadRunOrTxt(options) {
      return new Promise((resolve, reject) => {
        uploadNonFile(options).then(res => {
          // window.console.log(res);
          
          if (res.msg === 'success') {
            resolve();
          } else {
            reject(res.msg);
          }
        }).catch(err => {
          reject(err);
        });
      });
    },
    
    /******************************* WebUploader API START *******************************/
    // 初始化 WebUploader 实例对象
    wuInit() {
      if (!this.showUploadingPopup) return false;
      
      if (this.uploader) this.wuDestroy();
      
      this.uploader = window.WebUploader.create({
        swf: this.$baseUrl + 'lib/webuploader/Uploader.swf', // 请根据实际项目部署路径配置swf文件路径
        server: this.baseURL + '/resource/upload', // 文件接收服务端
        thumb: false, // 不生成缩略图
        compress: false, // 如果此选项为false, 则图片在上传前不进行压缩
        prepareNextFile: true, // 是否允许在文件传输时提前把下一个文件准备好
        chunked: true, // 分片上传
      });
      
      this.curMediaList.map((item, index) => {
        if (item.type==='img' || item.type==='video') {
          let wuFile = new window.WebUploader.Lib.File(window.WebUploader.guid('rt_'), item.data.file);
          let newfile = new window.WebUploader.File(wuFile);
          newfile.extraIndex = index + 1;
          
          this.uploader.addFiles(newfile);
          wuFile = null;
          newfile = null;
        }
      });
      
      let uFiles = this.uploader.getFiles();
      
      if (uFiles && uFiles.length>0) {
        this.wuUpload();
      }
      
      // window.console.log('curMediaList：', this.curMediaList);
      // window.console.log('swfURL：', this.$baseUrl + 'lib/webuploader/Uploader.swf');
      // window.console.log('uploader：', this.uploader);
      // window.console.log('uFiles：', uFiles);
    },
    
    // 触发 WebUploader 上传图片/视频资源
    wuUpload() {
      if (!this.uploader) return false;
      
      this.uploader.on('uploadStart', (file) => {
        // window.console.log(`${file.name} uploadStart !`);
        
        file.extraKind = this.imgAcceptReg.test(file.type) ? '2' : '1'; // 分片额外传资源类型参数（资源类型 1:视频 2:图片）
        file.extraTaskId = this.serverTaskId; // 分片额外传任务ID参数
      });
      
      this.uploader.on('uploadBeforeSend', (block, data) => {
        // window.console.log(`${block.file.name} uploadBeforeSend !`);
        
        data.md5 = block.file.extraMd5; // 分片额外传md5参数
        data.kind = block.file.extraKind; // 分片额外传资源类型参数（资源类型 1:视频 2:图片）
        data.taskId = block.file.extraTaskId; // 分片额外传任务ID参数
        data.index = block.file.extraIndex; // 分片额外传播放序号参数
      });
      
      /*this.uploader.on('uploadProgress', (file, percentage) => {
        // window.console.log(`${file.name} uploadProgress percentage：`, percentage);
      });*/
      
      this.uploader.on('uploadError', (file, reason) => {
        window.console.log(`${file.name} uploadError reason：`, reason);
        
        Toast(this.$t('multimedia.failedToSend'));
        this.resetUpload();
      });
      
      this.uploader.on('uploadSuccess', (file, response) => {
        // window.console.log(`${file.name} uploadSuccess response：`, response);
        
        if (response.msg === 'success') {
          this.submitProgress = Math.floor(++this.submittedNum/this.curMediaList.length*100);
          this.verdictUploadComplete();
        } else if (response.msg === 'upload_chunk') {
          // 分片文件上传成功时返回，啥也不做
        } else {
          Toast(this.$t('multimedia.failedToSend'));
          this.resetUpload();
        }
      });
      
      /*this.uploader.on('uploadComplete', (file) => {
        // window.console.log(`${file.name} uploadComplete !`);
      });*/
      
      this.uploader.on('error', (type) => {
        window.console.log(`errorType：`, type);
        
        Toast(this.$t('multimedia.failedToSend'));
        this.resetUpload();
      });
      
      this.uploader.upload();
    },
    
    // 销毁 WebUploader 实例对象
    wuDestroy() {
      if (!this.uploader) return false;
      
      this.uploader.destroy();
      this.uploader = null;
    },
    
    /******************************* WebUploader API END *******************************/
  }
};
</script>

<style lang="less" scoped>
@import '../../styles/var';

@active-bgcolor: #e6f4ff;

.multimedia {
  width: 100%;
  height: 100%;
  
  /* 顶部 */
  .multi-top {
    .top {
      padding: 0 30px;
    }
    
    /* 标题 */
    .title {
      height: 90px;
      line-height: 90px;
      text-align: center;
      font-size: 36px;
      color: @mqu-text-color333;
      border-bottom: @mqu-hairline;
    }
    
    /* 提示 */
    .add-tips {
      height: 58px;
      line-height: 58px;
      font-size: 24px;
      color: @mqu-text-color999;
    }
    
    
    /* 多媒体 */
    .options {
      border-bottom: 15px solid #f4f4f4;
      background-color: #fff;
    }
    
    .option-box, .option-uploader {
      .mixin-flex-column-center();
      height: 120px;
    }
    
    .option-box {
      position: relative;
      overflow: hidden;
      
      &:active {
        background-color: @active-bgcolor;
      }
    }
    
    .option-uploader {
      width: 250px;
    }
    
    .option-img {
      width: 50px;
      height: 50px;
    }
    
    .option-txt {
      margin-top: 10px;
      font-size: 24px;
      color: @mqu-text-color333;
    }
  }
  
  /* 多媒体内容 */
  .multi-cont {
    padding: 30px 30px 200px;
    
    & > div {
      width: 100%;
    }
    
    /* 内容 */
    .content {
      margin-bottom: 30px;
      height: 388px;
      position: relative;
      border-radius: 10px;
      overflow: hidden;
    }
    
    .mqu-field {
      border-bottom: @mqu-hairline;
      padding: 0 0 20px;
    }
    
    /* 读取图片/视频时的遮罩 */
    .reading-mask, .reading-progress {
      display: flex;
      flex-direction: column;
      justify-content: center;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
    
    .reading-mask {
      background-color: #000;
      opacity: .5;
    }
    
    /* 读取图片/视频时的进度 */
    .reading-progress {
      padding: 0 20px;
      box-sizing: border-box;
    }
    
    .reading-progress-cont {
      background: #f1f0f0;
      height: 10px;
      border-radius: 5px;
    }

    .subjoin {
      .mixin-flex-between();
      height: 60px;
      align-items: flex-start;
    }
    
    /* 信息 */
    .info {
      font-size: 24px;
      color: @mqu-text-color333;
    }
    
    .info-name {
      max-width: 600px;
    }
    
    .info-run {
      width: 185px;
      height: 35px;
      line-height: 35px;
      font-size: 24px;
      background-color: rgba(0, 0, 0, .7);
      color: #fff;
    }
    
    /* 删除 */
    .action {
      font-size: 30px;
    }
    
    .action-cancel {
      color: @mqu-theme-color;
    }
    
    .action-remove {
      color: @mqu-danger-color;
    }
    
    /* 索引栏 */
    .bar {
      .mixin-flex-center();
      padding: 80px 0;
      color: @mqu-text-color333;
    }
    
    .bar-left, .bar-right {
      .mixin-flex-center();
      font-size: 50px;
      
      &.disable {
        color: #e0e0e0;
        pointer-events: none;
      }
      
      &:active {
        color: #008FFF;
      }
    }
    
    .bar-cont {
      font-size: 36px;
      margin: 0 50px;
    }
  }
  
  /* 底部上传 */
  .multi-bottom {
    padding: 0 30px 30px;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    box-sizing: border-box;
    background-color: #fff;
    z-index: 2;
    
    .bottom-box {
      .mixin-flex-column-center();
      border-top: @mqu-hairline;
    }
    
    .upload-total {
      padding: 18px 0;
      font-size: 30px;
      color: @mqu-text-color999;
    }
    
    .upload-btn {
      width: 100%;
      height: 80px;
      line-height: 80px;
      font-size: 30px;
      color: @mqu-text-colorfff;
      background-color: @mqu-theme-color;
      border: 1px solid @mqu-theme-color;
      border-radius: 10px;
    }
  }
  
  /* 编辑文本 */
  .multi-edit {
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    
    & > div {
      box-sizing: border-box;
    }
    
    /* 顶部取消、完成操作 */
    .top {
      width: 100%;
      height: 80px;
      padding: 0 30PX;
      
      & > div {
        .mixin-flex-between();
        width: 100%;
        height: 80px;
        line-height: 80px;
        border-bottom: @mqu-hairline;
      }
    }
    
    .top-cancel, .top-length {
      font-size: 28px;
      color: @mqu-text-color333;
    }
    
    .top-done {
      font-size: 28px;
      color: @mqu-theme-color;
    }
    
    /* 输入文本框 */
    .field {
      padding: 0;
      width: 100%;
      min-height: 60px;
      position: relative;
      flex: 1;
      transition: all .4s cubic-bezier(.4,0,0,1);
    }
    
    .mqu-field {
      position: absolute;
      padding: 30px 30PX;
    }
    
    /* 样式栏 */
    .bar {
      display: flex;
      flex-direction: column;
      width: 100%;
      font-size: 28px;
      color: @mqu-text-color333;
      transition: all .4s cubic-bezier(.4,0,0,1);
    }
    
    .bar-tab {
      height: 70px;
      min-height: 40PX;
      background-color: #f4f6f7;
    }
    
    .bar-tab-keyboard, .bar-tab-style {
      .mixin-flex-center();
      
      img {
        width: 35px;
        height: 35px;
        margin-right: 10px;
      }
      
      &.active {
        color: @mqu-theme-color;
        border-bottom: 4px solid @mqu-theme-color;
      }
    }
    
    .bar-cont {
      .mixin-flex-column-around();
      padding: 0 30PX;
      width: 100%;
      background-color: #fff;
      box-sizing: border-box;
      transition: all .4s cubic-bezier(.4,0,0,1);
      
      & > div {
        .mixin-flex-between();
        width: 100%;
        box-sizing: border-box;
      }
    }
    
    .style-label {
      width: 80px;
      text-align: right;
    }
    
    .style-color, .style-opacity {
      padding-right: 20px;
    }
    
    .style-color {
      position: relative;
      padding-top: 40px;
    }
    
    .style-color-txt {
      display: inline-block;
      width: 30px;
      height: 30px;
      border: 2px solid rgba(0, 0, 0, .25);
      border-radius: 5px;
    }
    
    .style-color-cont {
      width: calc(100% - 80px - 40px);
      border: 2px solid rgba(0, 0, 0, .25);
      border-radius: 15px;
      background: url(../../assets/img/color_bar.png) center center no-repeat;
      background-size: 100% 100%;
      background: linear-gradient(to right, 
        #ffffff 4%, #9a9791 4% 8%, #6a6663 8% 12%, #34302f 12% 16%, #333333 16% 20%, 
        #2d2824 20% 24%, #191814 24% 28%, #a86e35 28% 32%, #7e0e14 32% 36%, #c20e17 36% 40%, 
        #e51b27 40% 44%, #e4451f 44% 48%, #ea7527 48% 52%, #f1c03c 52% 56%, #b4da4b 56% 60%,
        #7eb63e 60% 64%, #33862e 64% 68%, #88d9f3 68% 72%, #0994f5 72% 76%, #1064d4 76% 80%,
        #1b1c6f 80% 84%, #381a6c 84% 88%, #76128d 88% 92%, #e43b86 92% 96%, #f1cdd5 96%);
      box-sizing: border-box;
    }
    
    .style-color-button {
      position: relative;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      border: 3px solid rgba(0, 0, 0, .25);
      
      .title {
        display: inline-block;
        position: absolute;
        left: -3px;
        top: -50px;
        width: 30px;
        height: 30px;
        border-radius: 5px;
        border: 3px solid rgba(0, 0, 0, .25);
        opacity: 0;
        
        &::after {
          display: block;
          content: " ";
          width: 8px;
          height: 8px;
          bottom: -6px;
          left: 10px;
          position: absolute;
          background: inherit;
          transform: rotate(45deg);
          border-right: 3px solid rgba(0, 0, 0, .25);
          border-bottom: 3px solid rgba(0, 0, 0, .25);
        }
      }
    }
    
    .style-opacity-txt, .style-weight-txt, .style-shadow-txt  {
      font-size: 28px;
      color: @mqu-text-color333;
    }
    
    .style-opacity-cont {
      width: calc(100% - 80px - 40px);
      border-radius: 15px;
      box-sizing: border-box;
    }
  }
  
  /* 提交后台 */
  .multi-submit {
    
    .submit, .end {
      display: flex;
      flex-direction: column;
      align-items: center;
      height: 100%;
      width: 100%;
      text-align: center;
      
      &, & > div {
        box-sizing: border-box;
      }
    }
    
    /* 上传等待 */
    .submit {
      padding-top: 270px;
    }
    
    .submit-tips {
      margin-bottom: 50px;
      font-size: 30px;
      color: @mqu-text-color333;
    }
    
    .submit-progress {
      margin-bottom: 140px;
    }
    
    .submit-progress-txt {
      margin-bottom: 20px;
      color: @mqu-text-color999;
      font-size: 28px;
    }
    
    .submit-progress-cont {
      background: #f1f0f0;
      width: 650px;
      height: 10px;
      border-radius: 5px;
    }
    
    .submit-cancel, .end-return {
      padding: 20px 30px;
      height: auto;
      font-size: 32px;
      line-height: 32px;
      color: #fff;
      border-radius: 50px;
      background-color: @mqu-theme-color;
      background: @mqu-theme-color;
      border: 2px solid @mqu-theme-color;
      
      &:active {
        background-color: @mqu-active-color;
        background: @mqu-active-color;
      }
    }
    
    /* 上传完成 */
    .end {
      padding-top: 338px;
    }
    
    .end-img {
      width: 145px;
      height: 179px;
      margin-bottom: 62px;
    }
  }
  
  &.is-landscape .mqu-field {
    padding: 0 30PX;
  }
}
</style>
