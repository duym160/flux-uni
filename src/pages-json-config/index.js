const path = require('path');
const fs = require('fs');

// 获取通用配置
const commonConfig = require('./common');

// 获取当前项目代号
let projectCode = '';
if (process.env.VUE_APP_CONFIG) {
  try {
    const config = JSON.parse(process.env.VUE_APP_CONFIG);
    projectCode = config.PROJECT_CODE || 'dev'; // 默认为 dev
  } catch (e) {}
}

// 尝试加载项目特定配置
let projectConfig = {};
try {
  // 注意：这里是在 node 环境下运行的 (pages.js)，可以使用 require
  // 假设项目配置文件名就是 projectCode，例如 dev.js
  const projectConfigPath = path.resolve(__dirname, `${projectCode}.js`);
  if (fs.existsSync(projectConfigPath)) {
    projectConfig = require(projectConfigPath);
  }
} catch (e) {
  console.log(`[Pages Config] No specific config for project: ${projectCode}`);
}

// 合并逻辑
const mergeConfig = (common, project) => {
  const result = JSON.parse(JSON.stringify(common)); // 深拷贝

  if (!project) return result;

  // 简单的合并策略：如果项目有 PAGES_JSON，则合并/覆盖
  if (project.PAGES_JSON) {
    // 可以在这里实现更复杂的合并逻辑，例如合并 pages 数组，而不是直接替换
    // 这里简单演示直接覆盖 globalStyle，合并 pages
    if (project.PAGES_JSON.globalStyle) {
      Object.assign(result.globalStyle, project.PAGES_JSON.globalStyle);
    }
    if (project.PAGES_JSON.pages) {
      // 简单追加? 还是基于 path 覆盖?
      // 实际业务中通常是追加或替换，这里假设是追加
      result.pages = [...result.pages, ...project.PAGES_JSON.pages];
    }
    // 处理 subPackages 等...
  }

  // 执行回调 (最高级自定义)
  if (typeof project.CALL_BACK === 'function') {
    return project.CALL_BACK(result);
  }

  return result;
};

module.exports = mergeConfig(commonConfig, projectConfig);
