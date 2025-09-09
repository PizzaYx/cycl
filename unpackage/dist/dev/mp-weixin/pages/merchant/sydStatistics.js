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
  __name: "sydStatistics",
  setup(__props) {
    const orderList = common_vendor.ref([
      {
        time: "2025-08-13 14:30",
        status: "已完成",
        name: "二硫香菜",
        quantity: 3,
        weight: "2.5"
      },
      {
        time: "2025-08-13 14:30",
        status: "已完成",
        name: "二硫香菜",
        quantity: 3,
        weight: "1.3"
      },
      {
        time: "2025-08-13 14:30",
        status: "已完成",
        name: "二硫香菜",
        quantity: 3,
        weight: "2.4"
      }
    ]);
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          type: "search",
          size: "16",
          color: "#999999"
        }),
        b: common_vendor.p({
          type: "bottom",
          size: "12",
          color: "#999999"
        }),
        c: common_vendor.p({
          type: "bottom",
          size: "12",
          color: "#999999"
        }),
        d: common_vendor.p({
          type: "shop",
          size: "24",
          color: "#FF9500"
        }),
        e: common_vendor.p({
          type: "gift",
          size: "24",
          color: "#007AFF"
        }),
        f: common_vendor.f(orderList.value, (item, index, i0) => {
          return {
            a: common_vendor.t(item.time),
            b: common_vendor.t(item.status),
            c: common_vendor.t(item.name),
            d: common_vendor.t(item.quantity),
            e: common_vendor.t(item.weight),
            f: "2b52cae6-5-" + i0,
            g: index
          };
        }),
        g: common_vendor.p({
          size: "mini",
          type: "primary"
        })
      };
    };
  }
});
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/merchant/sydStatistics.js.map
