"use strict";
const common_vendor = require("../common/vendor.js");
const uploadUrl = "http://192.168.0.118:8089/api/merchantapi/webupload";
const createUploadHeaders = () => {
  return common_vendor.computed(() => {
    const accessToken = common_vendor.index.getStorageSync("access_token");
    return {
      "authorization": accessToken ? `Bearer ${accessToken}` : ""
    };
  });
};
exports.createUploadHeaders = createUploadHeaders;
exports.uploadUrl = uploadUrl;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/config.js.map
