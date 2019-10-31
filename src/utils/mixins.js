
export const myMixin = {
  created() {
    this.resizeWin();
  },
  mounted() {
    window.$ && window.$(window).on('resize.winresize', () => {
      this.resizeWin();
    });
  },
  destroyed() {
    window.$ && window.$(window).off('.winresize');
  },
  methods: {
    // 窗口大小发生变化处理函数
    resizeWin() {
      // 移动端百分比适配布局极端值处理
      const _deviceWidth = document.documentElement.clientWidth || document.body.clientWidth;
      
      if (375 < _deviceWidth && _deviceWidth < 750) {
        document.documentElement.style.fontSize = '37.5px';
      } else if (750 <= _deviceWidth) {
        document.documentElement.style.fontSize = '75px';
      }
    },
  },
};
