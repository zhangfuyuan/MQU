<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>

export default {
  name: 'App',
  data() {
    return {
    }
  },
  created() {
    // todo 只能在这里 register 注册 WebUploader，否则会重复注册！
    // let self = this;

    // WebUploader.Uploader.register 内必须备份外层 this 为 self
    window.WebUploader.Uploader.register({
      'before-send-file': 'beforeSendFile',
    }, {
      beforeSendFile(file) {
        let deferred = window.WebUploader.Deferred();

        (new window.WebUploader.Uploader()).md5File(file).then((val) => {
          window.console.log(`${file.name} md5：${val}`);

          file.md5 = val;
          return deferred.resolve();
        });

        return deferred.promise();
      }
    });
  }
}
</script>

<style lang="less">
@import './styles/common';
  
html {
  width: 100%;
  height: 100%;
}

body {
  width: 100%;
  height: 100%;
  font-size: 16px;
  background-color: #f8f8f8;
  -webkit-font-smoothing: antialiased;
  background-color: #fff;
}

#app {
  width: 100%;
  height: 100%;
}

textarea {
  padding: 2px 0 !important;
}
</style>
