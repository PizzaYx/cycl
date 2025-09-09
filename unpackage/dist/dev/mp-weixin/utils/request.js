"use strict";
const common_vendor = require("../common/vendor.js");
const BASE_URL = "http://192.168.0.118:8089";
let refreshingPromise = null;
common_vendor.index.addInterceptor("request", {
  invoke(args) {
    if (!args.url.startsWith("http")) {
      args.url = BASE_URL + args.url;
    }
    const accessToken = common_vendor.index.getStorageSync("access_token");
    common_vendor.index.__f__("log", "at utils/request.js:17", "Access Token:", accessToken);
    if (accessToken) {
      args.header = args.header || {};
      args.header["authorization"] = `Bearer ${accessToken}`;
    }
    return args;
  }
});
common_vendor.index.addInterceptor("request", {
  success: async (res) => {
    if (res.statusCode === 401) {
      try {
        await handleUnauthorized();
        const newToken = common_vendor.index.getStorageSync("access_token");
        if (newToken) {
          const originalRequest = res.config || {};
          originalRequest.header = originalRequest.header || {};
          originalRequest.header["authorization"] = `Bearer ${newToken}`;
          return common_vendor.index.request(originalRequest);
        } else {
          logout();
          return Promise.reject(res);
        }
      } catch (error) {
        logout();
        return Promise.reject(res);
      }
    } else if (res.data.code === 200) {
      if (res.data.data && res.data.data.access_token && res.data.data.refresh_token) {
        saveToken(res.data.data);
      }
      return res.data;
    } else {
      handleRequestError(res.data);
      return Promise.reject(res.data);
    }
  },
  fail: (err) => {
    return Promise.reject(err);
  }
});
function request(config = {}) {
  const { url, data = {}, method = "GET", header = {}, ...rest } = config;
  return common_vendor.index.request({
    url,
    data,
    method,
    header,
    ...rest
  });
}
async function handleUnauthorized() {
  if (refreshingPromise) {
    return refreshingPromise;
  }
  try {
    const refreshTokenStr = common_vendor.index.getStorageSync("refresh_token");
    const refreshExpireTime = common_vendor.index.getStorageSync("refresh_expire_time");
    if (!refreshTokenStr || !refreshExpireTime) {
      throw new Error("未登录");
    }
    const now = Date.now();
    if (now > refreshExpireTime) {
      throw new Error("登录已过期");
    }
    refreshingPromise = refreshAccessToken(refreshTokenStr);
    await refreshingPromise;
  } finally {
    refreshingPromise = null;
  }
}
async function refreshAccessToken(refreshTokenStr) {
  const res = await post("/api/apiRefresh", {
    refresh_token: refreshTokenStr
  });
  if (res.code === 200) {
    saveToken(res.data);
    return res;
  } else {
    clearToken();
    throw new Error(res.msg || "刷新token失败");
  }
}
function saveToken(tokenData) {
  const now = Date.now();
  common_vendor.index.setStorageSync("access_token", tokenData.access_token);
  common_vendor.index.setStorageSync("access_expire_time", now + tokenData.access_expire_time * 1e3);
  common_vendor.index.setStorageSync("refresh_token", tokenData.refresh_token);
  common_vendor.index.setStorageSync("refresh_expire_time", now + tokenData.refresh_expire_time * 1e3);
}
function clearToken() {
  common_vendor.index.removeStorageSync("access_token");
  common_vendor.index.removeStorageSync("access_expire_time");
  common_vendor.index.removeStorageSync("refresh_token");
  common_vendor.index.removeStorageSync("refresh_expire_time");
}
function logout() {
  clearToken();
  common_vendor.index.redirectTo({
    url: "/pages/index/index"
  });
}
function handleRequestError(data) {
  if (data.msg) {
    common_vendor.index.showToast({
      title: data.msg,
      icon: "none"
    });
  }
}
exports.request = request;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/request.js.map
