"use strict";
const utils_request = require("../utils/request.js");
function apiPostLogin(data = {}) {
  return utils_request.request({
    url: "/api/apiLogin",
    data,
    method: "POST"
  });
}
function apiGetInfo() {
  return utils_request.request({
    url: "/api/getInfo"
  });
}
function apiPostMerchantCheck(data = {}) {
  return utils_request.request({
    url: "/api/merchantapi/addMerchantCheck",
    data,
    method: "POST"
  });
}
function apiGetMerchantCheck(data = {}) {
  return utils_request.request({
    url: "/api/merchantapi/getMerchantCheck",
    data
  });
}
exports.apiGetInfo = apiGetInfo;
exports.apiGetMerchantCheck = apiGetMerchantCheck;
exports.apiPostLogin = apiPostLogin;
exports.apiPostMerchantCheck = apiPostMerchantCheck;
//# sourceMappingURL=../../.sourcemap/mp-weixin/api/apis.js.map
