"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _easycom_uni_nav_bar2 = common_vendor.resolveComponent("uni-nav-bar");
  const _easycom_mp_html2 = common_vendor.resolveComponent("mp-html");
  (_easycom_uni_nav_bar2 + _easycom_mp_html2)();
}
const _easycom_uni_nav_bar = () => "../../uni_modules/uni-nav-bar/components/uni-nav-bar/uni-nav-bar.js";
const _easycom_mp_html = () => "../../uni_modules/mp-html/components/mp-html/mp-html.js";
if (!Math) {
  (_easycom_uni_nav_bar + _easycom_mp_html)();
}
const _sfc_main = {
  __name: "syPreview",
  setup(__props) {
    const contractId = common_vendor.ref("");
    const contractTitle = common_vendor.ref("合同预览");
    const contractContent = common_vendor.ref("");
    common_vendor.onLoad((options) => {
      contractId.value = options.contractId || "";
      contractTitle.value = decodeURIComponent(options.title || "合同预览");
      contractContent.value = decodeURIComponent(options.content || "");
    });
    const back = () => {
      common_vendor.index.navigateBack();
    };
    const printContract = () => {
      common_vendor.index.showToast({
        title: "打印功能开发中",
        icon: "none"
      });
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(back),
        b: common_vendor.p({
          dark: true,
          fixed: true,
          ["background-color"]: "#fff",
          ["status-bar"]: true,
          ["left-icon"]: "left",
          color: "#000",
          title: contractTitle.value
        }),
        c: common_vendor.p({
          content: contractContent.value
        }),
        d: common_vendor.o(back),
        e: common_vendor.o(printContract)
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-4b712ad9"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/syContract/syPreview.js.map
