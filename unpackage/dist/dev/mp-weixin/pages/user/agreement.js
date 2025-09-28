"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Math) {
  PageHeader();
}
const PageHeader = () => "../../components/PageHeader/PageHeader.js";
const _sfc_main = {
  __name: "agreement",
  setup(__props) {
    const back = () => {
      common_vendor.index.navigateBack();
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(back),
        b: common_vendor.p({
          title: "用户协议"
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-7ff9d70c"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/user/agreement.js.map
