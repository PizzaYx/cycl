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
function apiGetMerchantStatistics(data = {}) {
  return utils_request.request({
    url: "/api/merchantapi/getMerchantStatistics",
    data
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
function apiPostaddPlanTemporary(data = {}) {
  return utils_request.request({
    url: "/api/merchantapi/addPlanTemporary",
    data,
    method: "POST"
  });
}
function apiGetconfirmPlanById(data = {}) {
  return utils_request.request({
    url: "/api/merchantapi/confirmPlanById",
    data
  });
}
function apiGetDriverTodayStatistics(data = {}) {
  return utils_request.request({
    url: "/api/driver/getDriverTodayStatistics",
    data
  });
}
function apiGetDriverInfo(data = {}) {
  return utils_request.request({
    url: "/api/driver/getDriverInfo",
    data
  });
}
exports.apiGetDriverInfo = apiGetDriverInfo;
exports.apiGetDriverTodayStatistics = apiGetDriverTodayStatistics;
exports.apiGetInfo = apiGetInfo;
exports.apiGetMerchantCheck = apiGetMerchantCheck;
exports.apiGetMerchantStatistics = apiGetMerchantStatistics;
exports.apiGetPlanAllPage = apiGetPlanAllPage;
exports.apiGetPlanPage = apiGetPlanPage;
exports.apiGetconfirmPlanById = apiGetconfirmPlanById;
exports.apiPostLogin = apiPostLogin;
exports.apiPostMerchantCheck = apiPostMerchantCheck;
exports.apiPostaddPlanTemporary = apiPostaddPlanTemporary;
//# sourceMappingURL=../../.sourcemap/mp-weixin/api/apis.js.map
