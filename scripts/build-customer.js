const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 用法: node scripts/build-customer.js clientA mp-weixin
const customer = process.argv[2];
const platform = process.argv[3] || 'mp-weixin';

if (!customer) {
  console.error('请指定客户代码 (例如: clientA)');
  process.exit(1);
}

const customerAssetsPath = path.resolve(__dirname, `../customers/${customer}`);
const srcStaticPath = path.resolve(__dirname, '../src/static');
const srcManifestPath = path.resolve(__dirname, '../src/manifest.json');

// 1. 检查客户目录是否存在
if (!fs.existsSync(customerAssetsPath)) {
  console.error(`未找到客户目录: ${customerAssetsPath}`);
  process.exit(1);
}

console.log(`正在构建客户: ${customer}，平台: ${platform}`);

// 2. 复制资源 (覆盖 static 文件)
// 这是一个简单的实现。生产环境中，可以考虑使用更合适的合并策略或构建插件。
try {
  // 示例: 复制 logo.png 等
  if (fs.existsSync(path.join(customerAssetsPath, 'static'))) {
    console.log('正在复制静态资源...');
    fs.cpSync(path.join(customerAssetsPath, 'static'), srcStaticPath, { recursive: true });
  }

  // 3. 注入 manifest.json 覆盖配置
  const manifestOverridePath = path.join(customerAssetsPath, 'manifest.json');
  if (fs.existsSync(manifestOverridePath)) {
    console.log('正在覆盖 manifest.json...');

    // 辅助函数：去除注释
    const parseJsonWithComments = (content) => {
      // 去除单行注释 // ... 和多行注释 /* ... */
      const jsonString = content.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
      return JSON.parse(jsonString);
    };

    const originalManifest = parseJsonWithComments(fs.readFileSync(srcManifestPath, 'utf8'));
    const overrideManifest = parseJsonWithComments(fs.readFileSync(manifestOverridePath, 'utf8'));

    // 深度合并或特定字段覆盖
    const newManifest = { ...originalManifest, ...overrideManifest }; // 简化合并

    // 写入临时 manifest (虽然在 CI 中直接修改 src 不是最佳实践，但在这个脚本范围内如果能还原或 git 忽略是可以的)
    // 更好的策略：使用 vite 插件进行变量替换或直接输出到 dist。
    // 对于 uniapp 构建，构建前修改 manifest.json 是常见做法。
    fs.writeFileSync(srcManifestPath, JSON.stringify(newManifest, null, 2));
  }
} catch (e) {
  console.error('准备客户资源时出错:', e);
  process.exit(1);
}

// 4. 运行构建命令
try {
  console.log(`运行构建命令: npm run build:${platform}`);
  execSync(`npm run build:${platform}`, { stdio: 'inherit' });
} catch (e) {
  console.error('构建失败:', e);
  process.exit(1);
} finally {
  // 可选: 还原 manifest 更改?
  // 理想情况下，我们不应该触碰 src 文件，但 uniapp 从 src 读取 manifest.json。
  // 如果在 git 仓库中，可以在这里运行 git checkout path/to/manifest.json。
  console.log('构建流程完成。');
}
