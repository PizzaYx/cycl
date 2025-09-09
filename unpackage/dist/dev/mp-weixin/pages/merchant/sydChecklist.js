"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _component_uni_button = common_vendor.resolveComponent("uni-button");
  _component_uni_button();
}
const _sfc_main = {
  __name: "sydChecklist",
  setup(__props) {
    const tabs = ["全部", "预约中", "已完成"];
    const currentTab = common_vendor.ref(0);
    const handleTabClick = (index) => {
      currentTab.value = index;
    };
    const orderList = common_vendor.ref([
      {
        shopName: "川味小厨(总店)",
        status: "预约中",
        deliveryCount: "5",
        weight: "451kg",
        carInfo: "川A3D47M",
        time: "2025-14:30-15:30"
      },
      {
        shopName: "川味小厨(总店)",
        status: "已完成",
        deliveryCount: "5",
        weight: "451kg",
        carInfo: "川A3D47M",
        time: "2025-14:30-15:30"
      },
      {
        shopName: "川味小厨(总店)",
        status: "已完成",
        deliveryCount: "5",
        weight: "451kg",
        carInfo: "川A3D47M",
        time: "2025-14:30-15:30"
      }
    ]);
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(tabs, (tab, index, i0) => {
          return common_vendor.e({
            a: common_vendor.t(tab),
            b: currentTab.value === index
          }, currentTab.value === index ? {} : {}, {
            c: index,
            d: currentTab.value === index ? 1 : "",
            e: common_vendor.o(($event) => handleTabClick(index), index)
          });
        }),
        b: common_vendor.f(orderList.value, (item, index, i0) => {
          return {
            a: common_vendor.t(item.shopName),
            b: common_vendor.t(item.status),
            c: common_vendor.n(item.status === "预约中" ? "booking" : "completed"),
            d: common_vendor.t(item.deliveryCount),
            e: common_vendor.t(item.weight),
            f: common_vendor.t(item.carInfo),
            g: common_vendor.t(item.time),
            h: "888270ea-0-" + i0,
            i: common_vendor.t(item.status === "预约中" ? "确认收运" : "查看详情"),
            j: "888270ea-1-" + i0,
            k: common_vendor.p({
              size: "mini",
              type: item.status === "预约中" ? "primary" : "default"
            }),
            l: index
          };
        }),
        c: common_vendor.p({
          size: "mini"
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-888270ea"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/merchant/sydChecklist.js.map
