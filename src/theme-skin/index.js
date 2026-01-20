import { PROJECT_CONFIG } from '@/js/constant';

// 默认主题 (如果没有配置 themeName)
const DEFAULT_THEME = 'theme-blue';

// 获取当期配置的主题名称
const getThemeName = () => {
  // 优先从环境变量读取 (由 runtime 注入到 process.env.VUE_APP_CONFIG)
  if (process.env.VUE_APP_CONFIG) {
    try {
      const config = JSON.parse(process.env.VUE_APP_CONFIG);
      if (config.THEME_NAME) return config.THEME_NAME;
    } catch (e) {
      console.error('Parse VUE_APP_CONFIG error', e);
    }
  }
  return DEFAULT_THEME;
};

const curThemeName = getThemeName();

// 动态引入对应主题的变量定义
// 注意：Vite/Webpack 需要静态分析，所以这里可能需要使用 glob 或 switch
// 为了简单起见，这里假设我们只有 theme-blue，实际项目中建议使用 import.meta.glob
import themeBlueVars from './theme-blue/index.js';

let currentThemeVars = {};
if (curThemeName === 'theme-blue') {
  currentThemeVars = themeBlueVars;
}

// 导出混合后的样式变量对象
export default {
  themeName: curThemeName,
  themeCssVar: {
    ...currentThemeVars,
  },
};
