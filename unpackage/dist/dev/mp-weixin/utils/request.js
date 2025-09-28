"use strict";
const common_vendor = require("../common/vendor.js");
const BASE_URL = "https://demo.vps4cloud.com";
let refreshingPromise = null;
let currentRequestInfo = null;
common_vendor.index.addInterceptor("request", {
  invoke(args) {
    if (args.url != null && !args.url.startsWith("http")) {
      args.url = BASE_URL + args.url;
    }
    const accessToken = common_vendor.index.getStorageSync("access_token");
    common_vendor.index.__f__("log", "at utils/request.js:22", "Access Token:", accessToken);
    common_vendor.index.__f__("log", "at utils/request.js:25", "【Request】", args.url, args.method || "GET", args.data || {});
    if (accessToken) {
      args.header = args.header || {};
      args.header["authorization"] = `Bearer ${accessToken}`;
    }
    if (!args.url.includes("/api/apiRefresh")) {
      currentRequestInfo = {
        url: args.url,
        method: args.method || "GET",
        data: args.data || {},
        header: { ...args.header }
      };
    }
    return args;
  }
});
common_vendor.index.addInterceptor("request", {
  success: async (res) => {
    var _a;
    common_vendor.index.__f__("log", "at utils/request.js:51", "【Response】", (_a = res.config) == null ? void 0 : _a.url, res.statusCode, res.data);
    if (res.statusCode === 200) {
      if (res.data.code === 401) {
        try {
          await handleUnauthorized();
          const newToken = common_vendor.index.getStorageSync("access_token");
          if (newToken && currentRequestInfo) {
            const retryRequest = {
              url: currentRequestInfo.url,
              method: currentRequestInfo.method,
              data: currentRequestInfo.data,
              header: {
                ...currentRequestInfo.header,
                "authorization": `Bearer ${newToken}`
              }
            };
            common_vendor.index.__f__("log", "at utils/request.js:72", "【Retry Request】", retryRequest.url, retryRequest.method, retryRequest.data);
            return common_vendor.index.request(retryRequest);
          } else {
            logout();
            return Promise.resolve({ data: { code: 401, msg: "登录已过期" } });
          }
        } catch (error) {
          common_vendor.index.__f__("log", "at utils/request.js:82", "Token刷新失败:", error.message);
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
    common_vendor.index.__f__("error", "at utils/request.js:104", "【Request Fail】", err);
    let errorMessage = "网络请求失败";
    if (err.errMsg) {
      if (err.errMsg.includes("timeout")) {
        errorMessage = "网络连接超时，请检查网络后重试";
      } else if (err.errMsg.includes("fail")) {
        errorMessage = "网络连接失败，请检查网络设置";
      } else if (err.errMsg.includes("abort")) {
        errorMessage = "请求被取消";
      }
    }
    const error = {
      code: -1,
      msg: errorMessage,
      errMsg: err.errMsg || "网络请求失败",
      originalError: err
    };
    return Promise.reject(error);
  }
});
function request(config = {}) {
  const { url, data = {}, method = "GET", header = {}, timeout = 3e4, ...rest } = config;
  return common_vendor.index.request({
    url,
    data,
    method,
    header,
    timeout,
    // 添加超时设置，默认30秒
    ...rest
  });
}
async function handleUnauthorized() {
  if (refreshingPromise) {
    return refreshingPromise;
  }
  try {
    common_vendor.index.__f__("log", "at utils/request.js:155", "未授权，正在处理...");
    const refreshTokenStr = common_vendor.index.getStorageSync("refresh_token");
    const refreshExpireTime = common_vendor.index.getStorageSync("refresh_expire_time");
    common_vendor.index.__f__("log", "at utils/request.js:158", "检查refresh token:", refreshTokenStr ? "存在" : "不存在", refreshExpireTime);
    if (!refreshTokenStr || !refreshExpireTime) {
      common_vendor.index.__f__("log", "at utils/request.js:162", "refresh token不存在，跳转登录");
      logout();
      return Promise.resolve(false);
    }
    const now = Date.now();
    if (now > refreshExpireTime) {
      common_vendor.index.__f__("log", "at utils/request.js:172", "refresh token已过期，跳转登录");
      logout();
      return Promise.resolve(false);
    }
    refreshingPromise = refreshAccessToken(refreshTokenStr);
    const result = await refreshingPromise;
    return result;
  } catch (error) {
    common_vendor.index.__f__("log", "at utils/request.js:183", "处理未授权异常:", error.message);
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
      common_vendor.index.__f__("log", "at utils/request.js:204", "Token刷新成功");
      return true;
    } else {
      common_vendor.index.__f__("log", "at utils/request.js:208", "Token刷新失败:", res.msg || "未知错误");
      clearToken();
      logout();
      return false;
    }
  } catch (error) {
    common_vendor.index.__f__("log", "at utils/request.js:215", "Token刷新网络异常:", error.message || "未知错误");
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
