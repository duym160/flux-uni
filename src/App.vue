<script setup lang="ts">
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app';
onLaunch(() => {
  console.log('App Launch');
});
onShow(() => {
  console.log('App Show');
});
onHide(() => {
  console.log('App Hide');
});
</script>
<style lang="scss">
/* 每个页面公共css */
@import '@/uni.scss';
@import '@/theme-skin/u-view-var.scss';
/* 引入当前激活的主题样式 (实际生产环境中建议使用条件编译或由构建工具自动注入) */
@import '@/theme-skin/theme-blue/index.scss';

/* 字体图标 */
@font-face {
  font-family: 'iconfont';
  src: url('~@/static/iconfont/iconfont.ttf') format('truetype');
}
.iconfont {
  font-family: 'iconfont' !important;
  font-size: 32rpx;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
