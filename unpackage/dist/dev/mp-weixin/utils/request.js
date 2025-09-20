"use strict";
const common_vendor = require("../common/vendor.js");
const BASE_URL = "http://183.223.252.50:18080";
let refreshingPromise = null;
common_vendor.index.addInterceptor("request", {
  invoke(args) {
    if (args.url != null && !args.url.startsWith("http")) {
      args.url = BASE_URL + args.url;
    }
    const accessToken = common_vendor.index.getStorageSync("access_token");
    common_vendor.index.__f__("log", "at utils/request.js:19", "Access Token:", accessToken);
    common_vendor.index.__f__("log", "at utils/request.js:22", "【Request】", args.url, args.method || "GET", args.data || {});
    if (accessToken) {
      args.header = args.header || {};
      args.header["authorization"] = `Bearer ${accessToken}`;
    }
    return args;
  }
});
common_vendor.index.addInterceptor("request", {
  success: async (res) => {
    var _a;
    common_vendor.index.__f__("log", "at utils/request.js:37", "【Response】", (_a = res.config) == null ? void 0 : _a.url, res.statusCode, res.data);
    if (res.statusCode === 200) {
      if (res.data.code === 401) {
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
            return Promise.resolve({ data: { code: 401, msg: "登录已过期" } });
          }
        } catch (error) {
          common_vendor.index.__f__("log", "at utils/request.js:61", "Token刷新失败:", error.message);
          logout();
          return Promise.resolve({ data: { code: 401, msg: "登录已过期" } });
        }
      }
      if (res.data.code === 200) {
        if (res.data.data && res.data.data.access_token && res.data.data.refresh_token) {
          saveToken(res.data.data);
        }
        return res.data;
      } else {
        return res.data;
      }
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
    common_vendor.index.__f__("log", "at utils/request.js:111", "未授权，正在处理...");
    const refreshTokenStr = common_vendor.index.getStorageSync("refresh_token");
    const refreshExpireTime = common_vendor.index.getStorageSync("refresh_expire_time");
    common_vendor.index.__f__("log", "at utils/request.js:114", "检查refresh token:", refreshTokenStr ? "存在" : "不存在", refreshExpireTime);
    if (!refreshTokenStr || !refreshExpireTime) {
      common_vendor.index.__f__("log", "at utils/request.js:118", "refresh token不存在，跳转登录");
      logout();
      return Promise.resolve(false);
    }
    const now = Date.now();
    if (now > refreshExpireTime) {
      common_vendor.index.__f__("log", "at utils/request.js:128", "refresh token已过期，跳转登录");
      logout();
      return Promise.resolve(false);
    }
    refreshingPromise = refreshAccessToken(refreshTokenStr);
    const result = await refreshingPromise;
    return result;
  } catch (error) {
    common_vendor.index.__f__("log", "at utils/request.js:139", "处理未授权异常:", error.message);
    logout();
    return Promise.resolve(false);
  } finally {
    refreshingPromise = null;
  }
}
async function refreshAccessToken(refreshTokenStr) {
  try {
    const res = await post("/api/apiRefresh", {
      refresh_token: refreshTokenStr
    });
    if (res.code === 200) {
      saveToken(res.data);
      common_vendor.index.__f__("log", "at utils/request.js:160", "Token刷新成功");
      return true;
    } else {
      common_vendor.index.__f__("log", "at utils/request.js:164", "Token刷新失败:", res.msg || "未知错误");
      clearToken();
      logout();
      return false;
    }
  } catch (error) {
    common_vendor.index.__f__("log", "at utils/request.js:171", "Token刷新网络异常:", error.message || "未知错误");
    clearToken();
    logout();
    return false;
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
function post(url, data = {}, config = {}) {
  return request({ url, data, method: "POST", ...config });
}
exports.request = request;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/request.js.map
