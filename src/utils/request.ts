interface RequestOptions extends UniApp.RequestOptions {
  hideLoading?: boolean;
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

class Request {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  request<T = any>(options: RequestOptions): Promise<T> {
    return new Promise((resolve, reject) => {
      if (!options.hideLoading) {
        uni.showLoading({ title: '加载中...' });
      }

      // 合并基础 URL
      if (!options.url.startsWith('http')) {
        options.url = this.baseURL + options.url;
      }

      // 从缓存或 Store 获取 Token (需要避免循环依赖，如果直接使用 store，或者在这里直接从 storage 读取)
      // 这里使用安全的方式直接读取 storage 或 store 状态
      const token = uni.getStorageSync('token'); // 最简单的方式，或者匹配持久化 key

      options.header = {
        ...options.header,
        Authorization: token ? `Bearer ${token}` : '',
      };

      uni.request({
        ...options,
        success: (res) => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(res.data as T);
          } else {
            this.handleError(res);
            reject(res);
          }
        },
        fail: (err) => {
          this.handleError(err);
          reject(err);
        },
        complete: () => {
          if (!options.hideLoading) {
            uni.hideLoading();
          }
        },
      });
    });
  }

  get<T = any>(url: string, data?: any, options?: RequestOptions) {
    return this.request<T>({ ...options, url, data, method: 'GET' });
  }

  post<T = any>(url: string, data?: any, options?: RequestOptions) {
    return this.request<T>({ ...options, url, data, method: 'POST' });
  }

  put<T = any>(url: string, data?: any, options?: RequestOptions) {
    return this.request<T>({ ...options, url, data, method: 'PUT' });
  }

  delete<T = any>(url: string, data?: any, options?: RequestOptions) {
    return this.request<T>({ ...options, url, data, method: 'DELETE' });
  }

  private handleError(error: any) {
    const title = error.data?.msg || error.errMsg || '请求失败';
    uni.showToast({
      title,
      icon: 'none',
    });

    if (error.statusCode === 401) {
      // 跳转到登录页
      // uni.navigateTo({ url: '/pages/login/login' });
    }
  }
}

export const request = new Request(BASE_URL);
