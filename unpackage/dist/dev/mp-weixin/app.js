"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
if (!Math) {
  "./pages/index/index.js";
  "./pages/merchant/merchant.js";
  "./pages/collection/collection.js";
  "./pages/merchant/shCertification.js";
  "./pages/merchant/shChecklist.js";
  "./pages/merchant/shAllList.js";
  "./pages/merchant/shStatistics.js";
  "./pages/user/user.js";
  "./pages/merchant/shReservation.js";
  "./pages/collection/sfDetails.js";
  "./pages/collection/syReport.js";
  "./pages/collection/sfsyRecord.js";
  "./pages/collection/syAllMap.js";
  "./pages/collection/syCheckDetail.js";
  "./pages/collection/syStatistics.js";
  "./pages/merchant/shyyDetail.js";
  "./pages/merchant/shsyDetail.js";
  "./pages/user/agreement.js";
  "./pages/user/privacyPolicy.js";
  "./pages/user/register.js";
  "./pages/syContract/syContract.js";
  "./pages/syContract/syContractFromAuth.js";
  "./pages/syContract/syPreview.js";
  "./pages/syContract/shSignature.js";
}
const _sfc_main = {
  onLaunch: function() {
    common_vendor.index.__f__("log", "at App.vue:4", "App Launch");
  },
  onShow: function() {
    common_vendor.index.__f__("log", "at App.vue:7", "App Show");
  },
  onHide: function() {
    common_vendor.index.__f__("log", "at App.vue:10", "App Hide");
  }
};
function createApp() {
  const app = common_vendor.createSSRApp(_sfc_main);
  app.use(common_vendor.createPinia());
  return {
    app,
    Pinia: common_vendor.Pinia
    // 此处必须将 Pinia 返回
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
//# sourceMappingURL=../.sourcemap/mp-weixin/app.js.map
