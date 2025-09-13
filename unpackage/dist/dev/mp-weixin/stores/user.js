"use strict";
const common_vendor = require("../common/vendor.js");
const api_apis = require("../api/apis.js");
const useUserStore = common_vendor.defineStore("user", {
  state: () => ({
    userInfo: null,
    isLoggedIn: false
  }),
  getters: {
    // 用户昵称
    nickName: (state) => {
      var _a;
      return ((_a = state.userInfo) == null ? void 0 : _a.nickName) || "";
    },
    // 用户名
    userName: (state) => {
      var _a;
      return ((_a = state.userInfo) == null ? void 0 : _a.userName) || "";
    },
    // 用户ID
    userId: (state) => {
      var _a;
      return ((_a = state.userInfo) == null ? void 0 : _a.userId) || null;
    },
    //merchant 商户信息
    merchant: (state) => {
      var _a;
      return ((_a = state.userInfo) == null ? void 0 : _a.merchant) || null;
    },
    //收运端--师傅信息
    sfmerchant: (state) => {
      var _a;
      return ((_a = state.userInfo) == null ? void 0 : _a.driver) || null;
    },
    // 商户头像（使用昵称第一个字）
    userAvatar: (state) => {
      var _a;
      const name = (_a = state.userInfo) == null ? void 0 : _a.name;
      return name ? name.charAt(0) : "商";
    },
    //收运端--师傅头像
    userSFAvatar: (state) => {
      var _a;
      const name = (_a = state.userInfo) == null ? void 0 : _a.nickName;
      return name ? name.charAt(0) : "收";
    },
    // 是否已认证（merchant不为null且status为1表示已认证）
    isVerified: (state) => {
      var _a, _b, _c;
      return ((_a = state.userInfo) == null ? void 0 : _a.merchant) !== null && ((_c = (_b = state.userInfo) == null ? void 0 : _b.merchant) == null ? void 0 : _c.status) === 1;
    },
    // 认证状态：0=未审核/待审核，1=认证成功，2=审核不通过
    merchantStatus: (state) => {
      var _a;
      if (!((_a = state.userInfo) == null ? void 0 : _a.merchant)) {
        return null;
      }
      return state.userInfo.merchant.status;
    },
    // 认证状态文字
    merchantStatusText: (state) => {
      var _a, _b;
      const status = (_b = (_a = state.userInfo) == null ? void 0 : _a.merchant) == null ? void 0 : _b.status;
      switch (status) {
        case 0:
          return "待审核";
        case 1:
          return "认证成功";
        case 2:
          return "审核不通过";
        default:
          return "未认证";
      }
    },
    // 用户类型（1=商户，2=收运）
    userType: (state) => {
      var _a;
      return ((_a = state.userInfo) == null ? void 0 : _a.type) || "1";
    },
    // 用户类型文字
    userTypeText: (state) => {
      var _a;
      const type = (_a = state.userInfo) == null ? void 0 : _a.type;
      return type === "1" ? "商户端" : type === "2" ? "收运端" : "未知";
    }
  },
  actions: {
    // 设置用户信息（仅存储在内存中）
    setUserInfo(userInfo) {
      this.userInfo = userInfo;
      this.isLoggedIn = true;
    },
    // 从服务器获取用户信息
    async fetchUserInfo() {
      try {
        const res = await api_apis.apiGetInfo();
        common_vendor.index.__f__("log", "at stores/user.js:89", "fetchUserInfo收到响应:", res);
        if (!res) {
          common_vendor.index.__f__("log", "at stores/user.js:93", "响应为空，可能是401跳转情况");
          return null;
        }
        const responseData = res.data || res;
        const code = responseData.code;
        if (code === 200) {
          this.setUserInfo(res.user || responseData.user);
          common_vendor.index.__f__("log", "at stores/user.js:103", "用户信息获取成功:", res.user || responseData.user);
          return res.user || responseData.user;
        } else if (code === 401) {
          common_vendor.index.__f__("log", "at stores/user.js:107", "用户未登录，已跳转到登录页");
          return null;
        } else {
          common_vendor.index.__f__("log", "at stores/user.js:110", "获取用户信息失败，code:", code, "msg:", responseData.msg);
          return null;
        }
      } catch (error) {
        common_vendor.index.__f__("log", "at stores/user.js:115", "获取用户信息异常:", error.message || error);
        return null;
      }
    },
    // 更新用户信息（仅内存更新）
    updateUserInfo(updates) {
      if (this.userInfo) {
        this.userInfo = { ...this.userInfo, ...updates };
        common_vendor.index.__f__("log", "at stores/user.js:125", "用户信息已更新:", this.userInfo);
      }
    },
    // 检查是否有用户信息，没有则自动获取
    async ensureUserInfo() {
      if (this.userInfo) {
        return this.userInfo;
      }
      const result = await this.fetchUserInfo();
      if (result === null) {
        common_vendor.index.__f__("log", "at stores/user.js:140", "用户信息获取失败，可能未登录或网络异常");
        return null;
      }
      return this.userInfo;
    },
    // 清除用户信息
    clearUserInfo() {
      this.userInfo = null;
      this.isLoggedIn = false;
      common_vendor.index.__f__("log", "at stores/user.js:150", "用户信息已清除");
    },
    // 退出登录
    logout() {
      this.clearUserInfo();
      common_vendor.index.removeStorageSync("access_token");
      common_vendor.index.removeStorageSync("access_expire_time");
      common_vendor.index.removeStorageSync("refresh_token");
      common_vendor.index.removeStorageSync("refresh_expire_time");
      common_vendor.index.__f__("log", "at stores/user.js:164", "用户已退出登录");
      common_vendor.index.redirectTo({
        url: "/pages/index/index"
      });
    }
  }
});
exports.useUserStore = useUserStore;
//# sourceMappingURL=../../.sourcemap/mp-weixin/stores/user.js.map
