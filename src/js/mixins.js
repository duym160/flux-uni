import themeConfig from '@/theme-skin/index.js';

export const ThemeMixin = {
  data() {
    return {
      THEME_NAME: themeConfig.themeName,
    };
  },
  computed: {
    THEME_CSS_VAR() {
      return themeConfig.themeCssVar;
    },
  },
};

export default {
  ThemeMixin,
};
