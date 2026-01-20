/**
 * 通用 Pages 配置 (相当于原来的 pages.json)
 */
module.exports = {
  pages: [
    {
      path: 'pages/index/index',
      style: {
        navigationBarTitleText: 'uni-app',
      },
    },
  ],
  subPackages: [
    {
      root: 'pages-sub',
      pages: [
        {
          path: 'demo/index',
          style: {
            navigationBarTitleText: 'Demo Subpackage',
          },
        },
      ],
    },
  ],
  preloadRule: {
    'pages/index/index': {
      network: 'all',
      packages: ['pages-sub'],
    },
  },
  globalStyle: {
    navigationBarTextStyle: 'black',
    navigationBarTitleText: 'uni-app',
    navigationBarBackgroundColor: '#F8F8F8',
    backgroundColor: '#F8F8F8',
  },
};
