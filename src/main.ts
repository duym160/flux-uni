import { createSSRApp } from 'vue';
import App from './App.vue';
import store from './store';
import { ThemeMixin } from '@/js/mixins';

export function createApp() {
  const app = createSSRApp(App);
  app.use(store);

  // 全局混入主题配置
  app.mixin(ThemeMixin);

  return {
    app,
  };
}
