# Flux Uni Project

这是一个基于 **UniApp + Vue 3 + TypeScript + Vite** 的跨平台开发框架。

## 📁 目录结构

主要代码位于 `my-vue3-project` 目录下，采用标准的 UniApp Vue 3 项目结构。

```text
flux-uni/
├── my-vue3-project/      # UniApp 主项目源码 (Vue 3 + TS + Vite)
│   ├── src/              # 源代码
│   ├── public/           # 静态资源
│   ├── index.html        # 入口文件
│   ├── package.json      # 项目配置与依赖
│   ├── tsconfig.json     # TypeScript 配置
│   └── vite.config.ts    # Vite 配置
└── README.md             # 项目说明文档
```

## 🚀 技术栈

- **框架**: [UniApp](https://uniapp.dcloud.io/) (Vue 3 版本)
- **构建工具**: [Vite](https://vitejs.dev/)
- **语言**: [TypeScript](https://www.typescriptlang.org/)
- **包管理**: NPM

## 🛠️ 快速开始

### 1. 进入项目目录

```bash
cd my-vue3-project
```

### 2. 安装依赖

```bash
npm install
```

### 3. 常用的开发命令

```bash
# 运行 H5 开发环境
npm run dev:h5

# 运行微信小程序开发环境
npm run dev:mp-weixin

# 运行 App 开发环境
npm run dev:app
```

更多命令请查看 `package.json` 中的 `scripts` 部分。

## 📦 构建与发布

```bash
# 构建 H5 生产包
npm run build:h5

# 构建微信小程序生产包
npm run build:mp-weixin

# 构建 App 生产包
npm run build:app
```

## 📝 开发建议

- 推荐使用 **VS Code** 进行开发。
- 安装 **Vue Language Features (Volar)** 插件以获得最佳的 Vue 3 + TS 支持。
- 遵循 Vue 3 Composition API 的开发范式。
