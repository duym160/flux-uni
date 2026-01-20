import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    token: '' as string,
    userInfo: null as any | null,
  }),
  actions: {
    setToken(token: string) {
      this.token = token;
    },
    setUserInfo(info: any) {
      this.userInfo = info;
    },
    logout() {
      this.token = '';
      this.userInfo = null;
    },
  },
  persist: {
    storage: {
      getItem: uni.getStorageSync,
      setItem: uni.setStorageSync,
    },
  },
});
