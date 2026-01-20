export class Router {
  static push(url: string, params?: Record<string, any>) {
    // 基础路由守卫检查 (模拟)
    // const userStore = useUserStore();
    // if (isProtected(url) && !userStore.token) { ... }

    const queryString = params
      ? '?' +
        Object.keys(params)
          .map((key) => `${key}=${encodeURIComponent(params[key])}`)
          .join('&')
      : '';

    return new Promise((resolve, reject) => {
      uni.navigateTo({
        url: url + queryString,
        success: resolve,
        fail: reject,
      });
    });
  }

  static replace(url: string, params?: Record<string, any>) {
    const queryString = params
      ? '?' +
        Object.keys(params)
          .map((key) => `${key}=${encodeURIComponent(params[key])}`)
          .join('&')
      : '';

    return new Promise((resolve, reject) => {
      uni.redirectTo({
        url: url + queryString,
        success: resolve,
        fail: reject,
      });
    });
  }

  static back(delta = 1) {
    uni.navigateBack({ delta });
  }
}
