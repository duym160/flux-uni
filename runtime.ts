import * as fs from 'fs';
import * as path from 'path';
import { argv, cwd } from 'process';
import { spawn } from 'child_process';
import hjson from 'hjson';
import chalk from 'chalk';
import inquirer from 'inquirer';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// 获取 __dirname (ESM 环境下)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 配置路径
const CONFIG_DIR = path.resolve(__dirname, 'src/config');
const MANIFEST_PATH = path.resolve(__dirname, 'src/manifest.json');
const MANIFEST_BASE_PATH = path.resolve(__dirname, 'src/manifest.base.json');
const ENV_FILE_PATH = path.resolve(__dirname, 'src/config/.env');

// 类型定义
interface AppConfig {
  [key: string]: any;
}

interface ManifestConfig {
  [key: string]: any;
}

interface ProjectConfig {
  NAME: string;
  CODE?: string;
  APP_CONFIG?: AppConfig;
  MANIFEST?: ManifestConfig;
  fileName?: string;
  [key: string]: any;
}

interface ParseArgsResult {
  NPM_ARG: string;
  CUSTOM_PLAFORM?: string;
  PROJECT?: string;
  [key: string]: any;
}

// ====== 工具函数 ======

// 判断是否为对象
const isObject = (val: any): val is object => typeof val === 'object' && val !== null && !Array.isArray(val);

// 解析命令行参数
const parseArgs = (args: string[]): ParseArgsResult => {
  const params: { [key: string]: string } = {};
  const argList = Array.isArray(args) ? args.slice(2) : [];
  argList.forEach((str) => {
    const [key, val] = str.split('=');
    if (key) params[key] = val;
  });
  return params as unknown as ParseArgsResult;
};

// 获取所有项目配置
const getProjectList = (): ProjectConfig[] => {
  try {
    if (!fs.existsSync(CONFIG_DIR)) return [];
    return fs
      .readdirSync(CONFIG_DIR)
      .filter((file) => file.endsWith('.json') && file !== 'env.json') // 排除生成的 env.json
      .map((file) => {
        try {
          const content = hjson.parse(fs.readFileSync(path.join(CONFIG_DIR, file), 'utf-8'));
          return { ...content, fileName: file.replace('.json', '') };
        } catch (e) {
          return null;
        }
      })
      .filter((item): item is ProjectConfig => !!(item && item.NAME));
  } catch (e) {
    return [];
  }
};

// 交互式选择项目
const selectProject = async (): Promise<{ result?: ProjectConfig; error?: string }> => {
  const menu = getProjectList();
  if (menu.length === 0) return { error: '未找到配置文件' };

  const { index } = await inquirer.prompt([
    {
      type: 'rawlist',
      name: 'index',
      message: '请选择项目配置：',
      choices: menu.map((item, idx) => ({ name: item.NAME, value: idx })),
    },
  ]);

  return { result: menu[index] };
};

// 递归合并对象
const deepMerge = (target: any, source: any): any => {
  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        deepMerge(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }
  return target;
};

// 切换 Manifest
const switchManifest = (projectConfig: ProjectConfig) => {
  if (!projectConfig.MANIFEST) return;

  console.log(chalk.blue('正在合并 Manifest 配置...'));
  try {
    const baseManifest = hjson.parse(fs.readFileSync(MANIFEST_BASE_PATH, 'utf-8'));
    const mergedManifest = deepMerge(baseManifest, projectConfig.MANIFEST);
    fs.writeFileSync(MANIFEST_PATH, JSON.stringify(mergedManifest, null, 4));
    console.log(chalk.green('Manifest 更新成功'));
  } catch (e) {
    let msg = 'Unknown Error';
    if (e instanceof Error) msg = e.message;
    console.error(chalk.red('Manifest 更新失败: ' + msg));
    process.exit(1);
  }
};

// 生成 .env 文件
const generateEnvFile = (projectConfig: ProjectConfig) => {
  const appConfig = projectConfig.APP_CONFIG || {};
  const envContent = `VUE_APP_CONFIG=${JSON.stringify(appConfig)}`;
  fs.writeFileSync(ENV_FILE_PATH, envContent);
  console.log(chalk.green('环境变量已更新'));
};

// ====== 主流程 ======

async function main() {
  const { NPM_ARG, CUSTOM_PLAFORM, PROJECT } = parseArgs(argv);

  // 防递归检查
  if (NPM_ARG && NPM_ARG.startsWith('script')) {
    console.error(chalk.red("错误：NPM_ARG 不能包含 'script' 开头的命令，防止死循环"));
    return;
  }

  let projectConfig: ProjectConfig | null = null;

  // 1. 获取配置
  if (PROJECT) {
    const projectPath = path.join(CONFIG_DIR, PROJECT + '.json');
    if (fs.existsSync(projectPath)) {
      projectConfig = hjson.parse(fs.readFileSync(projectPath, 'utf-8')) as ProjectConfig;
    } else {
      console.error(chalk.red(`未找到指定项目配置: ${PROJECT}`));
      process.exit(1);
    }
  } else {
    const selection = await selectProject();
    if (selection.error || !selection.result) {
      console.error(chalk.red(selection.error || '选择失败'));
      process.exit(1);
    }
    projectConfig = selection.result;
  }

  if (!projectConfig) return;

  console.log(chalk.cyan(`当前环境: ${projectConfig.NAME}`));

  // 2. 处理配置
  switchManifest(projectConfig);
  generateEnvFile(projectConfig);

  // 3. 加载环境变量 (使得当前进程及子进程生效)
  dotenv.config({ path: ENV_FILE_PATH });

  // 4. 执行实际命令
  const cmd = `npm run ${NPM_ARG} ${CUSTOM_PLAFORM || ''}`;
  console.log(chalk.gray(`执行命令: ${cmd}`));

  spawn(cmd, { stdio: 'inherit', shell: true });
}

main();
