<template>
  <div class="error">
    <div class="error-img">
      <img src="../../assets/img/icon_qr_code_expired.png" alt="icon_qr_code_expired" width="100%" height="100%">
    </div>
    
    <p class="error-tips">
      <span v-if="errorType==='qrExpired'">{{$t('error.qrExpiredTips')}}</span>
      <span v-else-if="errorType==='pageExpired'">{{$t('error.pageExpiredTips')}}</span>
    </p>
  </div>
</template>

<script>
import { myMixin } from '@/utils/mixins';

export default {
  name: 'error',

  mixins: [ myMixin ],

  components: {},

  props: {},

  data() {
    return {
      errorType: this.$route.query.type
    }
  },

  computed: {},

  watch: {},

  created() {
    document.title = this.$t(`error.${this.errorType}`);
  },

  mounted() {},

  destroyed() {},

  methods: {}
};
</script>

<style lang="less" scoped>
@import '../../styles/var';

.error {
  .mixin-flex-column-center();
  padding-top: 250px;
  
  .error-img {
    width: 264px;
    height: 264px;
  }
  
  .error-tips {
    padding-top: 40px;
    color: @mqu-text-color333;
    font-size: 30px;
  }
  
}
</style>
