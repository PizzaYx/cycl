"use strict";
const common_vendor = require("../common/vendor.js");
const api_apis = require("../api/apis.js");
const useUserStore = common_vendor.defineStore("user", {
  state: () => ({
    userInfo: null,
    isLoggedIn: false,
    currentMerchantIndex: 0,
    // 当前选中的商户索引
    currentDriverIndex: 0
    // 当前选中的司机索引
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
    // 所有商户列表
    merchants: (state) => {
      var _a;
      const merchant = (_a = state.userInfo) == null ? void 0 : _a.merchant;
      if (Array.isArray(merchant)) {
        return merchant;
      } else if (merchant) {
        return [merchant];
      }
      return [];
    },
    // 当前选中的商户信息（单个对象）
    currentMerchant: (state) => {
      var _a;
      const list = (_a = state.userInfo) == null ? void 0 : _a.merchant;
      if (Array.isArray(list)) {
        if (list.length > 0 && state.currentMerchantIndex < list.length) {
          return list[state.currentMerchantIndex];
        }
        return null;
      }
      return list || null;
    },
    // 兼容旧代码：merchant 指向 currentMerchant
    merchant: (state) => {
      var _a;
      const list = (_a = state.userInfo) == null ? void 0 : _a.merchant;
      if (Array.isArray(list)) {
        if (list.length > 0 && state.currentMerchantIndex < list.length) {
          return list[state.currentMerchantIndex];
        }
        return null;
      }
      return list || null;
    },
    // 所有司机列表
    drivers: (state) => {
      var _a;
      const driver = (_a = state.userInfo) == null ? void 0 : _a.driver;
      if (Array.isArray(driver)) {
        return driver;
      } else if (driver) {
        return [driver];
      }
      return [];
    },
    // 当前选中的司机信息
    currentDriver: (state) => {
      var _a;
      const list = (_a = state.userInfo) == null ? void 0 : _a.driver;
      if (Array.isArray(list)) {
        if (list.length > 0 && state.currentDriverIndex < list.length) {
          return list[state.currentDriverIndex];
        }
        return null;
      }
      return list || null;
    },
    //收运端--师傅信息 (兼容旧代码)
    sfmerchant: (state) => {
      var _a;
      const list = (_a = state.userInfo) == null ? void 0 : _a.driver;
      if (Array.isArray(list)) {
        if (list.length > 0 && state.currentDriverIndex < list.length) {
          return list[state.currentDriverIndex];
        }
        return null;
      }
      return list || null;
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
    isVerified(state) {
      var _a;
      return this.currentMerchant !== null && ((_a = this.currentMerchant) == null ? void 0 : _a.status) === 1;
    },
    // 认证状态：0=未审核/待审核，1=认证成功，2=审核不通过
    merchantStatus(state) {
      if (!this.currentMerchant) {
        return null;
      }
      return this.currentMerchant.status;
    },
    // 认证状态文字
    merchantStatusText(state) {
      var _a;
      const status = (_a = this.currentMerchant) == null ? void 0 : _a.status;
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
    // 切换当前商户
    switchMerchant(index) {
      var _a;
      if (((_a = this.userInfo) == null ? void 0 : _a.merchant) && Array.isArray(this.userInfo.merchant)) {
        if (index >= 0 && index < this.userInfo.merchant.length) {
          this.currentMerchantIndex = index;
          common_vendor.index.__f__("log", "at stores/user.js:160", "已切换商户索引为:", index);
          return true;
        }
      }
      return false;
    },
    // 切换当前司机
    switchDriver(index) {
      var _a;
      if (((_a = this.userInfo) == null ? void 0 : _a.driver) && Array.isArray(this.userInfo.driver)) {
        if (index >= 0 && index < this.userInfo.driver.length) {
          this.currentDriverIndex = index;
          common_vendor.index.__f__("log", "at stores/user.js:172", "已切换司机索引为:", index);
          return true;
        }
      }
      return false;
    },
    // 设置用户信息（仅存储在内存中）
    setUserInfo(userInfo) {
      this.userInfo = userInfo;
      this.isLoggedIn = true;
    },
    // 从服务器获取用户信息
    async fetchUserInfo(returnUserType = false) {
      try {
        const res = await api_apis.apiGetInfo();
        if (!res) {
          common_vendor.index.__f__("log", "at stores/user.js:191", "响应为空，可能是401跳转情况");
          return null;
        }
        const responseData = res.data || res;
        const code = responseData.code;
        if (code === 200) {
          const userInfo = res.user || responseData.user;
          this.setUserInfo(userInfo);
          if (returnUserType) {
            return {
              userInfo,
              userType: userInfo == null ? void 0 : userInfo.type
            };
          }
          return userInfo;
        } else if (code === 401) {
          common_vendor.index.__f__("log", "at stores/user.js:212", "用户未登录，已跳转到登录页");
          return null;
        } else {
          common_vendor.index.__f__("log", "at stores/user.js:215", "获取用户信息失败，code:", code, "msg:", responseData.msg);
          return null;
        }
      } catch (error) {
        common_vendor.index.__f__("log", "at stores/user.js:220", "获取用户信息异常:", error.message || error);
        return null;
      }
    },
    // 更新用户信息（仅内存更新）
    updateUserInfo(updates) {
      if (this.userInfo) {
        this.userInfo = { ...this.userInfo, ...updates };
        common_vendor.index.__f__("log", "at stores/user.js:230", "用户信息已更新:", this.userInfo);
      }
    },
    // 更新当前商户信息
    updateCurrentMerchant(merchantData) {
      var _a, _b;
      if (((_a = this.userInfo) == null ? void 0 : _a.merchant) && Array.isArray(this.userInfo.merchant)) {
        if (this.currentMerchantIndex >= 0 && this.currentMerchantIndex < this.userInfo.merchant.length) {
          this.userInfo.merchant[this.currentMerchantIndex] = merchantData;
          common_vendor.index.__f__("log", "at stores/user.js:240", "当前商户信息已更新");
        }
      } else if ((_b = this.userInfo) == null ? void 0 : _b.merchant) {
        this.userInfo.merchant = merchantData;
      }
    },
    // 添加新商户
    addMerchant(merchantData) {
      if (!this.userInfo)
        return;
      if (!this.userInfo.merchant) {
        this.userInfo.merchant = [merchantData];
      } else if (Array.isArray(this.userInfo.merchant)) {
        this.userInfo.merchant.push(merchantData);
      } else {
        this.userInfo.merchant = [this.userInfo.merchant, merchantData];
      }
      if (Array.isArray(this.userInfo.merchant)) {
        this.currentMerchantIndex = this.userInfo.merchant.length - 1;
      }
    },
    // 检查是否有用户信息，没有则自动获取
    async ensureUserInfo() {
      const result = await this.fetchUserInfo();
      if (result === null) {
        common_vendor.index.__f__("log", "at stores/user.js:274", "用户信息获取失败，可能未登录或网络异常");
        return null;
      }
      return this.userInfo;
    },
    // 清除用户信息
    clearUserInfo() {
      this.userInfo = null;
      this.isLoggedIn = false;
      common_vendor.index.__f__("log", "at stores/user.js:284", "用户信息已清除");
    },
    // 退出登录
    logout() {
      this.clearUserInfo();
      common_vendor.index.removeStorageSync("access_token");
      common_vendor.index.removeStorageSync("access_expire_time");
      common_vendor.index.removeStorageSync("refresh_token");
      common_vendor.index.removeStorageSync("refresh_expire_time");
      common_vendor.index.__f__("log", "at stores/user.js:298", "用户已退出登录");
      common_vendor.index.redirectTo({
        url: "/pages/index/index"
      });
    }
  }
});
exports.useUserStore = useUserStore;
//# sourceMappingURL=../../.sourcemap/mp-weixin/stores/user.js.map
