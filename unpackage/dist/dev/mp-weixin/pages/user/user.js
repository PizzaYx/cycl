"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  _easycom_uni_icons2();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  _easycom_uni_icons();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "user",
  setup(__props) {
    const avatarUrl = common_vendor.ref("https://ai-public.mastergo.com/ai/img_res/ad260cc6ead8d4815bc8d1dd5beae8f9.jpg");
    return (_ctx, _cache) => {
      return {
        a: avatarUrl.value,
        b: common_vendor.p({
          type: "right",
          size: "16",
          color: "#999999"
        })
      };
    };
  }
});
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/user/user.js.map
