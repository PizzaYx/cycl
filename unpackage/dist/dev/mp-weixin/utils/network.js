"use strict";
const common_vendor = require("../common/vendor.js");
function checkNetworkStatus() {
  return new Promise((resolve) => {
    common_vendor.index.getNetworkType({
      success: (res) => {
        common_vendor.index.__f__("log", "at utils/network.js:11", "网络类型:", res.networkType);
        const hasNetwork = res.networkType !== "none";
        resolve(hasNetwork);
      },
      fail: () => {
        common_vendor.index.__f__("log", "at utils/network.js:17", "获取网络状态失败");
        resolve(false);
      }
    });
  });
}
async function requestWithRetry(requestFn, maxRetries = 3, retryDelay = 1e3) {
  let lastError = null;
  for (let i = 0; i <= maxRetries; i++) {
    try {
      const hasNetwork = await checkNetworkStatus();
      if (!hasNetwork) {
        throw new Error("网络连接不可用");
      }
      const result = await requestFn();
      return result;
    } catch (error) {
      lastError = error;
      common_vendor.index.__f__("log", "at utils/network.js:77", `请求失败，第${i + 1}次重试:`, error.message);
      if (i < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, retryDelay * (i + 1)));
      }
    }
  }
  throw lastError;
}
exports.checkNetworkStatus = checkNetworkStatus;
exports.requestWithRetry = requestWithRetry;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/network.js.map
