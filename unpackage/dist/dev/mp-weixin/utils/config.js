"use strict";
const common_vendor = require("../common/vendor.js");
const uploadUrl = "http://192.168.0.118:8089/api/merchantapi/webupload";
const TIANDITU_CONFIG = {
  // 天地图API密钥
  API_KEY: "1fea78f710be3a88282ab14019dd34c7",
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
exports.TIANDITU_CONFIG = TIANDITU_CONFIG;
exports.createUploadHeaders = createUploadHeaders;
exports.uploadUrl = uploadUrl;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/config.js.map
