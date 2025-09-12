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
function apiGetDriverTodayPlan(data = {}) {
  return utils_request.request({
    url: "/api/driver/getDriverTodayPlan",
    data
  });
}
function apiGetnoNeedCollect(data = {}) {
  return utils_request.request({
    url: "/api/driver/noNeedCollect",
    data
  });
}
function apiGetdriverConfirmPlan(data = {}) {
  return utils_request.request({
    url: "/api/driver/driverConfirmPlan",
    data
  });
}
function apiPostreportWeight(data = {}) {
  return utils_request.request({
    url: "/api/driver/reportWeight",
    data,
    method: "POST"
  });
}
function apiGetDriverPlanById(data = {}) {
  return utils_request.request({
    url: "/api/driver/getDriverPlanById",
    data
  });
}
function apiAddCarWeight(data = {}) {
  return utils_request.request({
    url: "/api/driver/addCarWeight",
    data
  });
}
function apiGetDriverPlanPage(data = {}) {
  return utils_request.request({
    url: "/api/driver/getDriverPlanPage",
    data
  });
}
exports.apiAddCarWeight = apiAddCarWeight;
exports.apiGetDriverInfo = apiGetDriverInfo;
exports.apiGetDriverPlanById = apiGetDriverPlanById;
exports.apiGetDriverPlanPage = apiGetDriverPlanPage;
exports.apiGetDriverTodayPlan = apiGetDriverTodayPlan;
exports.apiGetDriverTodayStatistics = apiGetDriverTodayStatistics;
exports.apiGetInfo = apiGetInfo;
exports.apiGetMerchantCheck = apiGetMerchantCheck;
exports.apiGetMerchantStatistics = apiGetMerchantStatistics;
exports.apiGetPlanAllPage = apiGetPlanAllPage;
exports.apiGetPlanPage = apiGetPlanPage;
exports.apiGetconfirmPlanById = apiGetconfirmPlanById;
exports.apiGetdriverConfirmPlan = apiGetdriverConfirmPlan;
exports.apiGetnoNeedCollect = apiGetnoNeedCollect;
exports.apiPostLogin = apiPostLogin;
exports.apiPostMerchantCheck = apiPostMerchantCheck;
exports.apiPostaddPlanTemporary = apiPostaddPlanTemporary;
exports.apiPostreportWeight = apiPostreportWeight;
//# sourceMappingURL=../../.sourcemap/mp-weixin/api/apis.js.map
