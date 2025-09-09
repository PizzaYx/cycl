"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _component_uni_button = common_vendor.resolveComponent("uni-button");
  (_easycom_uni_icons2 + _component_uni_button)();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  _easycom_uni_icons();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "sydAllList",
  setup(__props) {
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          type: "search",
          size: "16",
          color: "#999"
        }),
        b: common_vendor.p({
          type: "bottom",
          size: "12",
          color: "#666"
        }),
        c: common_vendor.p({
          type: "bottom",
          size: "12",
          color: "#666"
        }),
        d: common_vendor.f(3, (item, index, i0) => {
          return {
            a: "e2277cf4-3-" + i0,
            b: index
          };
        }),
        e: common_vendor.p({
          type: "primary",
          size: "mini"
        })
      };
    };
  }
});
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/merchant/sydAllList.js.map
