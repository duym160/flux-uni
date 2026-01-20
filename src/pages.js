/**
 * uni-app 动态 pages.json 入口
 * 该文件运行在 Node.js 环境中，用于生成最终的 configuration
 */
const pagesConfig = require('./src/pages-json-config/index.js');

module.exports = (pagesJson, loader) => {
  // 返回最终的配置对象
  // 注意：uni-app 会自动将此对象写入到 pages.json (内存或临时文件)
  return pagesConfig;
};
