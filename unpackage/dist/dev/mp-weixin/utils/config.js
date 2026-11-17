"use strict";
const common_vendor = require("../common/vendor.js");
const uploadUrl = "https://cc.cdlians.tech:8883/backend/api/merchantapi/webupload";
const CONTRACT_DOWNLOAD_URL = "https://cc.cdlians.tech:8883/upload/img";
const TIANDITU_CONFIG = {
  // 天地图API密钥
  API_KEY: "cd0affe367bfe3a6300580c3502b7f17",
  // 天地图路径规划API地址
  ROUTE_API_URL: "https://api.tianditu.gov.cn/v2/route",
  // 请求超时时间（毫秒）
  TIMEOUT: 1e4
};
const createUploadHeaders = () => {
  return common_vendor.computed(() => {
    const accessToken = common_vendor.index.getStorageSync("access_token");
    return {
      "authorization": accessToken ? `Bearer ${accessToken}` : ""
    };
  });
};
exports.CONTRACT_DOWNLOAD_URL = CONTRACT_DOWNLOAD_URL;
exports.TIANDITU_CONFIG = TIANDITU_CONFIG;
exports.createUploadHeaders = createUploadHeaders;
exports.uploadUrl = uploadUrl;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/config.js.map
