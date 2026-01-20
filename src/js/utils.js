/**
 * 全局工具类
 */

/**
 * @description: 统一 Storage 操作，防止多项目 Key 冲突
 * @param {Object} params
 * @param {String} params.key 键名
 * @param {String} params.value 值 (action='set'时必填)
 * @param {'get'|'set'|'remove'|'clear'} params.action 操作类型
 * @return {*}
 */
export const storageAction = ({ key, value, action = 'get' }) => {
  // 获取当前项目代号 (防止不同项目在同一域名下缓存冲突)
  const projectCode = (process.env.VUE_APP_CONFIG && JSON.parse(process.env.VUE_APP_CONFIG).PROJECT_CODE) || 'COMMON';

  // 拼接 Key
  const storageKey = key ? `${projectCode}_${key}` : '';

  switch (action) {
    case 'set':
      if (!key) return false;
      try {
        uni.setStorageSync(storageKey, value);
        return true;
      } catch (e) {
        console.error('Set Storage Error:', e);
        return false;
      }
    case 'get':
      if (!key) return null;
      try {
        return uni.getStorageSync(storageKey);
      } catch (e) {
        console.error('Get Storage Error:', e);
        return null;
      }
    case 'remove':
      if (!key) return false;
      try {
        uni.removeStorageSync(storageKey);
        return true;
      } catch (e) {
        return false;
      }
    case 'clear':
      try {
        uni.clearStorageSync();
        return true;
      } catch (e) {
        return false;
      }
    default:
      return null;
  }
};

export default {
  storageAction,
};
