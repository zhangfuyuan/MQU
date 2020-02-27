<template>
  <div :class="['qu', { 'is-ios': isIOS, 'is-landscape': isLandscape }]">
    <!-- 顶部 -->
    <div class="top">
      <!-- 标题 -->
      <div class="title">
        {{ $t('quickUpload.title') }}
        <span :class="['send', { 'can-send': canSend }]" @click="send">{{ $t('common.send') }}</span>
      </div>
    </div>

    <!-- 文本 -->
    <div class="field">
      <!-- 字数统计 -->
      <div class="length">{{ txtContent.length }}/{{ txtLengthLimit }}</div>

      <!-- 输入框 -->
      <van-field class="qu-field" ref="editField" v-model="txtContent" type="textarea" :maxlength="txtLengthLimit" :placeholder="$t('quickUpload.inputContent')" />
    </div>

    <!-- 图片 -->
    <div class="upload">
      <!-- 上传 -->
      <van-uploader
        :class="['qu-uploader', { 'is-reading': isReading }]"
        v-model="imgList"
        name="imgUploader"
        accept="image/*"
        :preview-full-image="false"
        multiple
        :max-count="imgCountLimit"
        :before-read="imgBeforeRead"
        :after-read="imgAfterRead"
      />

      <!-- 读取进度 -->
      <ul class="mask-wrap" v-show="isReading">
        <li class="mask-box" v-for="(item, index) in imgProgressList" :key="index">
          <div :class="['mask-box-progress', progressAnimation()]" v-if="item === 1">
            <div class="progress-txt">{{ $t('quickUpload.uploading') }}</div>
          </div>
          <div class="mask-box-add" v-else-if="item === 2"></div>
        </li>
      </ul>
    </div>

    <!-- 提交后台 -->
    <van-popup
      class="multi-submit mqu-popup"
      v-model="showSendingPopup"
      :duration="0"
      position="right"
      :style="{ minHeight: '100%', width: '100%' }"
      :close-on-click-overlay="false"
    >
      <!-- 上传完成 -->
      <template v-if="submittedSize >= totalSize && submitProgress >= 100 && !pauseSend">
        <div class="end">
          <div class="end-img"><img src="../../assets/img/icon.png" alt="icon" width="100%" height="100%" /></div>

          <van-button class="end-return" round @click="reset">{{ $t('multimedia.returnHome') }}</van-button>
        </div>
      </template>

      <!-- 等待中 -->
      <template v-else>
        <div class="submit">
          <div class="submit-tips">
            <div>{{ $t('multimedia.beSending') }}</div>
            <div>{{ $t('multimedia.pleaseNotClosePage') }}</div>
          </div>

          <div class="submit-progress">
            <div class="submit-progress-txt">{{ submitProgress }}%</div>

            <van-progress class="submit-progress-cont qu-progress" :percentage="submitProgress" :show-pivot="false" color="#008fff" />
          </div>

          <van-button class="submit-cancel" round @click="undoSend">{{ $t('multimedia.undoSend') }}</van-button>
        </div>
      </template>
    </van-popup>
  </div>
</template>

<script>
import { Button, Toast, Uploader, Progress, Dialog, Field, Popup } from 'vant';
import baseURL from '@/api/config';
import { getTerminalState, createTask, deleteTask, performTask, uploadNonFile } from '@/api/quickUpload';
import { detectUtils } from '@/utils/common';

Toast.setDefaultOptions({
  className: 'mqu-toast'
});

export default {
  name: 'quickUpload',

  mixins: [],

  components: {
    [Button.name]: Button,
    [Uploader.name]: Uploader,
    [Progress.name]: Progress,
    [Field.name]: Field,
    [Popup.name]: Popup
  },

  props: {},

  data() {
    return {
      baseURL, // 根据环境设置的全局请求路径
      isIOS: /(\(i[^;]+;( U;)? CPU.+Mac OS X)|(iPhone)|(iPad)|(iPod)/i.test(navigator.userAgent), // 判断是否iOS系统
      isLandscape: window.orientation == 90 || window.orientation == -90, // 是否横屏
      txtContent: '', // 缓存输入框文本内容（动态）
      txtLengthLimit: 240, // 输入框文本长度限制
      isPageExpired: false, // 网页是否过期
      uploader: null, // WebUploader 实例对象（动态）
      showSendingPopup: false, // 是否显示发送等待界面（动态）
      imgList: [], // 图片素材已添加集合（动态）
      imgCountLimit: 9, // 添加图片数量限制
      imgAcceptReg: ['image/png', 'image/jpg', 'image/jpeg', 'image/gif'], // 图片文件支持的格式
      imgProgressList: [0, 1, 1, 1, 1, 1, 1, 1, 2], // 读取图片文件进度集合（动态）
      isReading: false, // 是否正在读取图片文件（动态）
      submittedSize: 0, // 已发送文件大小（动态）
      submitProgress: 0, // 已发送进度百分比（动态）
      pauseSend: false, // 是否暂停发送（动态）
      serverTaskId: '' // 后台任务ID（动态）
    };
  },

  computed: {
    // 当前能否发送
    canSend() {
      return (this.txtContent.length || this.imgList.length) && !this.isReading;
    },

    // 当前文件总大小，文字算1KB
    totalSize() {
      let _size = 0;

      if (this.txtContent.length > 0) {
        _size += 1024;
      }

      if (this.imgList.length > 0) {
        this.imgList.map(item => {
          _size += item.file.size;
        });
      }

      return _size;
    }
  },

  watch: {},

  created() {
    document.title = this.$t(document.title);
  },

  mounted() {
    // 屏幕旋转
    window.$(window).on('orientationchange.orientationchange', () => {
      this.isLandscape = window.orientation == 90 || window.orientation == -90;
    });

    // 网页访问6小时后过期
    window.setTimeout(() => {
      this.isPageExpired = true;
      if (this.$route.path === '/error') return;
      this.$router.replace({
        path: '/error',
        query: {
          type: 'pageExpired'
        }
      });
    }, 6 * 60 * 60000);

    this.getTerminalStateFn();
  },

  destroyed() {
    window.$(window).off('.orientationchange');
    this.wuDestroy();
  },

  beforeRouteEnter(to, from, next) {
    try {
      const qrTimestamp = new Date(Number(to.query.timestamp)).getTime();
      const nowTimestamp = Date.now();

      if (nowTimestamp - qrTimestamp > 10 * 60000) {
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

  beforeRouteLeave(to, from, next) {
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
      this.txtContent = '';
      this.showSendingPopup = false;
      this.imgList = [];
      this.imgProgressList = [0, 0, 0, 0, 0, 0, 0, 0, 0];
      this.isReading = false;
      this.submittedSize = 0;
      this.submitProgress = 0;
      this.pauseSend = false;
      this.serverTaskId = '';
      this.wuDestroy();
      document.title = this.$t('quickUpload.title');
    },

    // 获取终端状态(在线/离线)
    getTerminalStateFn(teid) {
      return new Promise(resolve => {
        let _teid = teid || this.$route.query.teid;

        if (_teid) {
          getTerminalState({
            teid: _teid
          })
            .then(res => {
              // window.console.log(res);

              if (res.errcode == 0 && res.data && res.data.state == '0') {
                // 终端应用关闭，跳转显示二维码过期页面
                resolve('offline');
                this.isPageExpired = true;
                this.$router.replace({
                  path: '/error',
                  query: {
                    type: 'qrExpired'
                  }
                });
              } else {
                resolve();
              }
            })
            .catch(() => {
              resolve();
            });
        } else {
          resolve();
        }
      });
    },

    // 发送
    send() {
      if (this.canSend) {
        this.showSendingPopup = true;

        const _teid = this.$route.query.teid;
        // window.console.log(`终端ID：${_teid}`);

        if (!_teid) {
          Toast(this.$t('multimedia.failedToSend'));
          this.resetSend();
          return false;
        }

        // 第一步，获取终端状态(在线/离线)
        this.getTerminalStateFn(_teid).then(result => {
          if (result !== 'offline') {
            this.showSendingPopup = true;
            document.title = this.$t('multimedia.beSending');
            let _userSystem = '';

            try {
              _userSystem = detectUtils.detectMobile();
              _userSystem = /Unknown/i.test(_userSystem.brand) ? _userSystem.model : _userSystem.brand;
            } catch (error) {
              window.console.log(error);
            }

            // 第二步，创建任务
            createTask({
              name: 'QuickUpload Task',
              type: '2',
              teid: _teid,
              userSystem: _userSystem
            })
              .then(result => {
                // window.console.log(result);

                if (!this.showSendingPopup) return false;

                if (result.errcode == 0) {
                  let _taskId = result.data.id;

                  this.serverTaskId = _taskId;

                  // 第三步，分类讨论上传文本/图片
                  if (this.txtContent.length > 0) {
                    uploadNonFile({
                      kind: '4',
                      taskId: _taskId,
                      content: JSON.stringify({
                        index: 1,
                        kind: '4',
                        color: '#333333',
                        bold: '0',
                        shadow: '0',
                        text: this.txtContent
                      }),
                      index: 1
                    })
                      .then(r => {
                        // window.console.log(r);
                        if (!this.showSendingPopup) return false;

                        if (r.msg === 'success') {
                          this.submittedSize += 1024;
                          let _progress = Math.floor((this.submittedSize / this.totalSize) * 100);
                          this.submitProgress = _progress > 100 ? 100 : this.submitProgress > _progress ? this.submitProgress : _progress;

                          if (this.imgList.length > 0) {
                            // 1、上传资源中含文本信息，还含图片
                            this.wuInit();
                          } else {
                            // 2、上传资源中仅含文本信息，不含图片
                            this.verdictSendComplete();
                          }
                        } else {
                          window.console.log(r.msg);

                          Toast(this.$t('multimedia.failedToSend'));
                          this.resetSend();
                        }
                      })
                      .catch(e => {
                        window.console.log(e);

                        if (!this.showSendingPopup) return false;
                        Toast(this.$t('multimedia.failedToSend'));
                        this.resetSend();
                      });
                  } else if (this.imgList.length > 0) {
                    // 3、上传资源中不含文本信息，仅含图片
                    this.wuInit();
                  }
                } else {
                  Toast(this.$t('multimedia.failedToSend'));
                  this.resetSend();
                }
              })
              .catch(err => {
                window.console.log(err);

                if (!this.showSendingPopup) return false;
                Toast(this.$t('multimedia.failedToSend'));
                this.resetSend();
              });
          }
        });
      }
    },

    // 读取图片文件前
    imgBeforeRead(file) {
      return new Promise((resolve, reject) => {
        if (Array.isArray(file) && file.length > 0) {
          // 多选文件
          const totalNum = file.length;
          const validNum = file.filter(item => {
            window.console.log(item.type);
            return this.imgAcceptReg.indexOf(item.type) > -1;
          }).length;

          if (validNum === totalNum) {
            // 均为合法格式文件
            this.showAddImgProgress(validNum);
            resolve();
          } else if (validNum === 0) {
            // 均为非法格式文件
            Toast(this.$t('quickUpload.addImgFormatTips'));
            reject();
          } else {
            // 含非法格式文件
            this.showAddImgProgress(validNum);
            Toast(this.$t('quickUpload.addImgFormatTips'));
            resolve();
          }
        } else {
          window.console.log(file.type);
          // 单选文件
          if (this.imgAcceptReg.indexOf(file.type) > -1) {
            this.showAddImgProgress(1);
            resolve();
          } else {
            Toast(this.$t('quickUpload.addImgFormatTips'));
            reject();
          }
        }
      });
    },

    // 读取图片文件进度
    showAddImgProgress(num) {
      const oLength = this.imgList.length;
      const curLength = num + oLength;

      this.isReading = true;
      this.imgProgressList = this.imgProgressList.map((item, index) => {
        let _show = 0;

        if (index >= oLength && index < curLength) {
          _show = 1;
        } else if (index === curLength) {
          _show = 2;
        } else {
          _show = 0;
        }

        return _show;
      });
    },

    // 随机生成进度动画
    progressAnimation() {
      return 'animation-' + parseInt(Math.random() * 5);
    },

    // 读取图片文件后
    imgAfterRead(/*file*/) {
      this.imgProgressList = [0, 0, 0, 0, 0, 0, 0, 0, 0];
      this.isReading = false;
    },

    // 取消发送
    undoSend() {
      this.pauseSend = true;

      Dialog.confirm({
        message: this.$t('multimedia.undoSendTips'),
        className: 'mqu-dialog',
        cancelButtonText: this.$t('multimedia.waitAMoment'),
        confirmButtonText: this.$t('multimedia.undoSend')
      })
        .then(() => {
          deleteTask({
            id: this.serverTaskId
          })
            .then((/*res*/) => {
              // window.console.log(res);
            })
            .catch(err => {
              window.console.log(err);
            });

          this.resetSend();
        })
        .catch(() => {
          // 左侧按钮，继续上传
          this.pauseSend = false;
          this.verdictSendComplete();
        });
    },

    // 取消发送，恢复上传数据为默认值
    resetSend() {
      this.showSendingPopup = false;
      this.wuDestroy();
      this.submitProgress = 0;
      this.submittedSize = 0;
      this.serverTaskId = '';
      this.pauseSend = false;
      Dialog.close();
      document.title = this.$t('quickUpload.title');
    },

    // 判断当前是否全部发送完成
    verdictSendComplete() {
      if (!this.showSendingPopup) return false;

      if (this.submittedSize >= this.totalSize && this.submitProgress >= 100 && !this.pauseSend) {
        performTask({
          id: this.serverTaskId
        })
          .then(res => {
            // window.console.log(res);

            if (!this.showSendingPopup) return false;

            if (res.errcode == 0) {
              // 最终完成！
              document.title = this.$t('multimedia.sentSuccessfully');
              Dialog.close();
            } else {
              Toast(this.$t('multimedia.failedToSend'));
              this.resetSend();
            }
          })
          .catch(err => {
            window.console.log(err);

            if (!this.showUploadingPopup) return false;
            Toast(this.$t('multimedia.failedToSend'));
            this.resetSend();
          });
      }
    },

    /******************************* WebUploader API START *******************************/
    // 初始化 WebUploader 实例对象
    wuInit() {
      if (!this.showSendingPopup) return false;

      if (this.uploader) this.wuDestroy();

      this.uploader = window.WebUploader.create({
        swf: this.$baseUrl + 'lib/webuploader/Uploader.swf', // 请根据实际项目部署路径配置swf文件路径
        server: this.baseURL + '/resource/upload', // 文件接收服务端
        thumb: false, // 不生成缩略图
        compress: false, // 如果此选项为false, 则图片在上传前不进行压缩
        prepareNextFile: true, // 是否允许在文件传输时提前把下一个文件准备好
        chunked: true // 分片上传
      });

      this.imgList.map((item, index) => {
        let wuFile = new window.WebUploader.Lib.File(window.WebUploader.guid('rt_'), item.file);
        let newfile = new window.WebUploader.File(wuFile);
        newfile.extraIndex = index + (this.txtContent.length > 0 ? 2 : 1);

        this.uploader.addFiles(newfile);
        wuFile = null;
        newfile = null;
      });
      this.wuUpload();

      // window.console.log('imgList：', this.imgList);
      // window.console.log('swfURL：', this.$baseUrl + 'lib/webuploader/Uploader.swf');
      // window.console.log('uploader：', this.uploader);
    },

    // 触发 WebUploader 上传图片/视频资源
    wuUpload() {
      if (!this.uploader) return false;

      this.uploader.on('uploadStart', file => {
        // window.console.log(`${file.name} uploadStart !`);

        file.extraKind = '2'; // 分片额外传资源类型参数（资源类型 1:视频 2:图片）
        file.extraTaskId = this.serverTaskId; // 分片额外传任务ID参数
      });

      this.uploader.on('uploadBeforeSend', (block, data) => {
        // window.console.log(`${block.file.name} uploadBeforeSend !`);

        data.md5 = block.file.extraMd5; // 分片额外传md5参数
        data.kind = block.file.extraKind; // 分片额外传资源类型参数（资源类型 1:视频 2:图片）
        data.taskId = block.file.extraTaskId; // 分片额外传任务ID参数
        data.index = block.file.extraIndex; // 分片额外传播放序号参数
      });

      this.uploader.on('uploadProgress', (file, percentage) => {
        // window.console.log(`${file.name} uploadProgress percentage：`, percentage);
        let _progress = Math.floor(((this.submittedSize + (file.size || 0) * percentage) / this.totalSize) * 100);
        this.submitProgress = _progress > 100 ? 100 : this.submitProgress > _progress ? this.submitProgress : _progress;
      });

      this.uploader.on('uploadError', (file, reason) => {
        window.console.log(`${file.name} uploadError reason：`, reason);

        Toast(this.$t('multimedia.failedToSend'));
        this.resetSend();
      });

      this.uploader.on('uploadSuccess', (file, response) => {
        // window.console.log(`${file.name} uploadSuccess response：`, response);

        if (response.msg === 'success') {
          this.submittedSize += file.size || 0;
          let _progress = Math.floor(((this.submittedSize + (file.size || 0)) / this.totalSize) * 100);
          this.submitProgress = _progress > 100 ? 100 : this.submitProgress > _progress ? this.submitProgress : _progress;
          this.verdictSendComplete();
        } else if (response.msg === 'upload_chunk') {
          // 分片文件上传成功时返回，啥也不做
        } else {
          Toast(this.$t('multimedia.failedToSend'));
          this.resetSend();
        }
      });

      /*this.uploader.on('uploadComplete', (file) => {
        // window.console.log(`${file.name} uploadComplete !`);
      });*/

      this.uploader.on('error', type => {
        window.console.log(`errorType：`, type);

        Toast(this.$t('multimedia.failedToSend'));
        this.resetSend();
      });

      this.uploader.upload();
    },

    // 销毁 WebUploader 实例对象
    wuDestroy() {
      if (!this.uploader) return false;

      this.uploader.destroy();
      this.uploader = null;
    }

    /******************************* WebUploader API END *******************************/
  }
};
</script>

<style lang="less" scoped>
@import '../../styles/var';

.border-box() {
  width: 100%;
  box-sizing: border-box;
}

.qu {
  .border-box();
  padding: 0 30px;
  height: 100%;

  /* 顶部 */
  .top {
    .border-box();
    height: 90px;
    line-height: 90px;

    .title {
      .border-box();
      position: relative;
      font-size: 36px;
      text-align: center;
      color: @mqu-text-color333;
      border-bottom: @mqu-hairline;
    }

    .send {
      position: absolute;
      right: 0;
      top: 0;
      font-size: 30px;
      color: #e0e0e0;

      &.can-send {
        color: #008fff;

        &:active {
          color: #0061d8;
        }
      }
    }
  }

  /* 文本 */
  .field {
    .border-box();
    border-bottom: @mqu-hairline;

    .length {
      padding: 22px 0 26px 0;
      font-size: 30px;
      color: @mqu-text-color333;
    }

    .qu-field {
      padding: 0 !important;
      height: 200px;
      font-size: 30px;
      line-height: 1;
      word-break: break-all;
      color: @mqu-text-color333;
    }
  }

  /* 图片 */
  .upload {
    .border-box();
    padding-top: 35px;
    position: relative;

    .mask-wrap {
      .border-box();
      position: absolute;
      top: 35px;
      left: 0;
      display: flex;
      flex-wrap: wrap;
    }

    .mask-box {
      margin: 0 22px 22px 0;
      position: relative;
      width: 215px;
      height: 215px;

      &:nth-of-type(3),
      &:nth-of-type(6),
      &:nth-of-type(9) {
        margin: 0;
      }

      div {
        border-radius: 10px;
      }
    }

    .mask-box-progress {
      .border-box();
      height: 50%;
      position: absolute;
      bottom: 0;
      left: 0;
      background-color: rgba(178, 211, 249, 0.5);

      .progress-txt {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 215px;
        height: 215px;
        position: absolute;
        bottom: 0;
        left: 0;
        color: #fff;
        font-size: 24px;
        background-color: rgba(0, 0, 0, 0.5);
      }

      &.animation-0 {
        animation: ani-progress 500ms cubic-bezier(0.4, 0, 0, 1);
        animation-fill-mode: forwards;
      }

      &.animation-1 {
        animation: ani-progress 800ms cubic-bezier(0.4, 0, 0, 1);
        animation-fill-mode: forwards;
      }

      &.animation-2 {
        animation: ani-progress 800ms cubic-bezier(0.4, 0, 0, 1);
        animation-fill-mode: forwards;
        animation-delay: 100ms;
      }

      &.animation-3 {
        animation: ani-progress 1s cubic-bezier(0.4, 0, 0, 1);
        animation-fill-mode: forwards;
      }

      &.animation-4 {
        animation: ani-progress 1s cubic-bezier(0.4, 0, 0, 1);
        animation-fill-mode: forwards;
        animation-delay: 250ms;
      }
    }

    .mask-box-add {
      .border-box();
      height: 100%;
      background: url(../../assets/img/icon_add_to_normal.png) center center no-repeat;
      background-size: 100% 100%;
    }
  }

  /* 提交后台 */
  .multi-submit {
    .submit,
    .end {
      display: flex;
      flex-direction: column;
      align-items: center;
      height: 100%;
      width: 100%;
      text-align: center;

      &,
      & > div {
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

    .submit-cancel,
    .end-return {
      margin-left: 25px;
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

  /* 横屏下 */
  &.is-landscape {
  }
}

@keyframes ani-progress {
  0% {
    height: 50%;
  }
  100% {
    height: 95%;
  }
}
</style>
