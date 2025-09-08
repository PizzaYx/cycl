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
exports.apiGetInfo = apiGetInfo;
exports.apiPostLogin = apiPostLogin;
//# sourceMappingURL=../../.sourcemap/mp-weixin/api/apis.js.map
