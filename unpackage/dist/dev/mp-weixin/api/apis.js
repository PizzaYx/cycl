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
function apiGetPlanAllPage(data = {}) {
  return utils_request.request({
    url: "/api/merchantapi/getPlanAllPage",
    data
  });
}
function apiGetPlanPage(data = {}) {
  return utils_request.request({
    url: "/api/merchantapi/getPlanPage",
    data
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
exports.apiGetPlanAllPage = apiGetPlanAllPage;
exports.apiGetPlanPage = apiGetPlanPage;
exports.apiPostLogin = apiPostLogin;
exports.apiPostMerchantCheck = apiPostMerchantCheck;
//# sourceMappingURL=../../.sourcemap/mp-weixin/api/apis.js.map
