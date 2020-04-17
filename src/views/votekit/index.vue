<template>
  <div :class="['votekit', { 'is-ios': isIOS, 'is-landscape': isLandscape }]">
    <!-- 标题 -->
    <header class="title">
      <div class="title-wrap">{{ subject }}</div>
    </header>

    <!-- 滚动选项 -->
    <main class="content">
      <ul v-if="options && options.length > 0" class="options-list">
        <li v-for="(item, index) in options" :key="index" @click="handleSelect(index)">
          <div v-waves class="options-item">
            <div class="options-item-selector">
              <template v-if="multiple === '0'">
                <img v-show="selectedIndexList.indexOf(index) > -1" src="../../assets/img/icon_radio.png" alt="radio" width="100%" height="100%" />
                <img v-show="!~selectedIndexList.indexOf(index)" src="../../assets/img/icon_unselected_01.png" alt="radio" width="100%" height="100%" />
              </template>
              <template v-else>
                <img v-show="selectedIndexList.indexOf(index) > -1" src="../../assets/img/icon_checkbox.png" alt="checkbox" width="100%" height="100%" />
                <img v-show="!~selectedIndexList.indexOf(index)" src="../../assets/img/icon_unselected_02.png" alt="checkbox" width="100%" height="100%" />
              </template>
            </div>

            <div class="options-item-txt">{{ item }}</div>
          </div>
        </li>
      </ul>
    </main>

    <!-- 投票按钮 -->
    <footer class="submit">
      <div class="submit-wrap">
        <van-button class="upload-btn" size="large" :disabled="!selectedIndexList || selectedIndexList.length === 0" @click="handleSubmit">{{ $t('votekit.vote') }}</van-button>
      </div>
    </footer>

    <!-- 实名投票 -->
    <van-dialog
      v-model="showVotingDialog"
      :class="['vote-dialog', { disabled: !realNameInput }]"
      :title="$t('votekit.realName')"
      show-cancel-button
      :confirm-button-text="$t('common.confirm')"
      @confirm="handleConfirm"
    >
      <van-field ref="realNameEl" v-model="realNameInput" class="real-name" maxlength="8" @click="$refs.realNameEl.focus()" />
    </van-dialog>

    <!-- 投票中 -->
    <van-overlay :show="showVotingOverlay">
      <div class="voting-wrapper">
        <img class="voting-loading" src="../../assets/img/point_loading.gif" alt="loading" />
        <p class="voting-txt">{{ $t('votekit.voting') }}</p>
      </div>
    </van-overlay>

    <!-- 提交后台 -->
    <van-popup
      class="multi-submit mqu-popup vote-popup"
      v-model="showVotingPopup"
      :duration="0"
      position="right"
      :style="{ minHeight: '100%', width: '100%' }"
      :close-on-click-overlay="false"
    >
      <div class="vote-popup-wrapper">
        <!-- 投票成功 -->
        <template v-if="voteResult === '1'">
          <img class="complete-icon" src="../../assets/img/icon_complete.png" alt="complete" />
          <p class="complete-tips">
            {{ $t('votekit.votedOptions') }}
            <br />
            {{ selectedIndexList | formatOptions(options) }}
          </p>
        </template>

        <!-- 投票失效 -->
        <template v-else-if="voteResult === '0'">
          <img class="invalid-icon" src="../../assets/img/icon_invalid.png" alt="invalid" />
          <p class="invalid-tips">{{ $t('votekit.voteExpired') }}</p>
        </template>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { Button, Toast, Dialog, Field, Overlay, Popup } from 'vant';
import { myMixin } from '@/utils/mixins';
import waves from '@/directive/waves/index.js'; // 水波纹指令
import { ajaxTaskContent, ajaxVote } from '@/api/votekit/votekit';

Toast.setDefaultOptions({
  className: 'mqu-toast'
});

export default {
  name: 'votekit',

  mixins: [myMixin],

  components: {
    [Button.name]: Button,
    [Dialog.Component.name]: Dialog.Component,
    [Field.name]: Field,
    [Overlay.name]: Overlay,
    [Popup.name]: Popup
  },

  directives: {
    waves
  },

  props: {},

  data() {
    return {
      isIOS: /(\(i[^;]+;( U;)? CPU.+Mac OS X)|(iPhone)|(iPad)|(iPod)/i.test(navigator.userAgent), // 判断是否iOS系统
      isLandscape: window.orientation == 90 || window.orientation == -90, // 是否横屏
      isPageExpired: false, // 网页是否过期
      subject: '',
      subjectId: '',
      options: [],
      multiple: '0',
      realName: '0',
      showVotingDialog: false,
      realNameInput: '',
      showVotingOverlay: false,
      showVotingPopup: false,
      voteResult: '-1',
      selectedIndexList: [],
      oldSubjectId: ''
    };
  },

  computed: {},

  watch: {},

  filters: {
    formatOptions(indexList, options) {
      const list = [...indexList];

      return list
        .sort((a, b) => parseInt(a) - parseInt(b))
        .map(index => `“${options[index]}”`)
        .join('、');
    }
  },

  created() {
    document.title = this.$t(`votekit.title`);
  },

  mounted() {
    // 屏幕旋转
    window.$(window).on('orientationchange.orientationchange', () => {
      this.isLandscape = window.orientation == 90 || window.orientation == -90;
    });

    const query = this.$route.query;

    if (query) {
      const { id } = query;

      if (id) {
        this.getVoteInfo(id);
      } else {
        this.subject = 'URI missing "id"';
        Toast(this.$t('common.failedToSend'));
      }
    }

    window.localStorage && (this.oldSubjectId = window.localStorage.getItem('subjectId'));
  },

  destroyed() {
    window.$(window).off('.orientationchange');
  },

  beforeRouteEnter(to, from, next) {
    try {
      const qrTimestamp = new Date(Number(to.query.timestamp)).getTime();
      const nowTimestamp = Date.now();

      if (nowTimestamp - qrTimestamp > 30 * 60000) {
        // 二维码生成30分钟后过期
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
      window.console.log(err);
      next();
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
    getVoteInfo(id) {
      if (id) {
        ajaxTaskContent({ id })
          .then(res => {
            const { errcode, data } = res;

            if (errcode === 0 && data && data.content) {
              const { subject, options, multiple, realName } = data.content;

              this.subject = subject;
              this.subjectId = id;
              this.options = options.map(item => item.value);
              this.multiple = multiple;
              this.realName = realName;
            } else {
              Toast(this.$t('common.failedToSend'));
            }
          })
          .catch(err => {
            window.console.log(err);
            Toast(this.$t('common.failedToSend'));
          });
      } else {
        Toast(this.$t('common.failedToSend'));
      }
    },
    handleSelect(index) {
      const selectedIndex = this.selectedIndexList.indexOf(index);
      const isMultiple = this.multiple === '1';

      if (isMultiple) {
        if (selectedIndex > -1) {
          this.selectedIndexList.splice(selectedIndex, 1);
        } else {
          this.selectedIndexList.push(index);
        }
      } else if (selectedIndex === -1) {
        this.selectedIndexList = [index];
      }
    },
    handleSubmit() {
      if (this.oldSubjectId && this.oldSubjectId.indexOf(this.subjectId) > -1) {
        Toast(this.$t('votekit.noDoubleVote'));
        return false;
      }

      if (this.realName === '1') this.showVotingDialog = true;
      else this.handleConfirm();
    },
    handleConfirm() {
      this.showVotingOverlay = true;
      this.submitVote();
    },
    submitVote() {
      const submitContent = {};

      submitContent.selectedOptions = this.selectedIndexList.map(index => index + 1 + '');

      if (this.realName === '1') submitContent.realNameValue = this.realNameInput;

      ajaxVote({
        kind: '5',
        taskId: this.subjectId,
        content: JSON.stringify(submitContent)
      })
        .then(res => {
          const { errcode } = res;

          this.showVotingOverlay = false;

          if (errcode === 0) {
            // 投票成功
            this.voteResult = '1';
            this.showVotingPopup = true;
            window.localStorage && window.localStorage.setItem('subjectId', this.oldSubjectId ? `${this.oldSubjectId},${this.subjectId}` : this.subjectId);
          } else if (errcode === 10004) {
            // 投票失效
            this.voteResult = '0';
            this.showVotingPopup = true;
          } else {
            // 其它异常
            Toast(this.$t('common.failedToSend'));
          }
        })
        .catch(err => {
          window.console.log(err);
          this.showVotingOverlay = false;
          Toast(this.$t('common.failedToSend'));
        });
    }
  }
};
</script>

<style lang="less" scoped>
@import '../../styles/var';

.votekit {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;

  ::-webkit-scrollbar {
    width: 30px;
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 15px;
    border: 10px solid transparent;
    box-shadow: 10px 0 0 #dcdcdc inset;
  }

  ::-webkit-scrollbar-thumb:hover {
    box-shadow: 10px 0 0 #dcdcdc inset;
  }

  .title {
    padding: 0 30px;
    width: 100%;
    min-height: 90px;
    box-sizing: border-box;

    .title-wrap {
      .mixin-flex-center();
      flex-wrap: wrap;
      width: 100%;
      min-height: 90px;
      color: @mqu-text-color333;
      font-size: 32px;
      text-align: justify;
      border-bottom: @mqu-hairline;
      box-sizing: border-box;
    }
  }

  .content {
    width: 100%;
    flex: 1;
    overflow-x: hidden;
    overflow-y: auto;
    box-sizing: border-box;

    .options-list {
      width: 100%;
      box-sizing: border-box;
    }

    .options-item {
      padding: 0 30px;
      width: 100%;
      height: 110px;
      display: flex;
      align-items: center;
      box-sizing: border-box;

      .options-item-selector {
        margin-right: 20px;
        width: 36px;
        height: 36px;
        position: relative;

        img {
          position: absolute;
          left: 0;
          top: 0;
        }
      }

      .options-item-txt {
        flex: 1;
        max-height: 80px;
        color: @mqu-text-color333;
        font-size: 30px;
        text-overflow: -o-ellipsis-lastline;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        line-clamp: 2;
        -webkit-box-orient: vertical;
        white-space: normal;
        word-break: break-word;
      }
    }
  }

  .vote-dialog {
    width: 570px;
    background-color: #ffffff;
    box-shadow: 1px 1px 5px 0px rgba(0, 0, 0, 0.41);
    border-radius: 10px;
    color: @mqu-text-color333;

    .real-name {
      padding: 80px 30px 0;
      border-top: @mqu-hairline;
      color: @mqu-text-color333;
      font-size: 30px;
      caret-color: @mqu-theme-color;
    }
  }

  .voting-wrapper {
    .mixin-flex-column-center();
    height: 100%;

    .voting-loading {
      width: 157px;
      height: 157px;
    }

    .voting-txt {
      margin: 0;
      font-size: 30px;
      letter-spacing: 2px;
      color: #fefefe;
    }
  }

  .submit {
    padding: 0 30px;
    width: 100%;
    height: 125px;
    box-sizing: border-box;

    .submit-wrap {
      padding-top: 15px;
      width: 100%;
      height: 100%;
      border-bottom: @mqu-hairline;
      box-sizing: border-box;
    }

    .upload-btn {
      width: 100%;
      height: 80px;
      line-height: 80px;
      font-size: 36px;
      color: @mqu-text-colorfff;
      background-color: @mqu-theme-color;
      border: 1px solid @mqu-theme-color;
      border-radius: 10px;

      &:active {
        background-color: @mqu-active-color;
        border: 1px solid @mqu-active-color;
      }
    }
  }

  .vote-popup {
    height: 100%;

    .vote-popup-wrapper {
      .mixin-flex-column-center();
      height: 100%;

      .complete-icon,
      .invalid-icon {
        width: 170px;
        height: 216px;
      }

      .complete-tips,
      .invalid-tips {
        margin: 34px 0 0 25px;
        max-width: 80%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: normal;
        word-break: break-all;
        text-align: center;
        font-size: 32px;
        line-height: 64px;
        letter-spacing: 0px;
        color: @mqu-text-color333;
      }
    }
  }
}
</style>
