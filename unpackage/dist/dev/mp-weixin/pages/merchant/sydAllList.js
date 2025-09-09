"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _component_uni_button = common_vendor.resolveComponent("uni-button");
  const _easycom_uni_load_more2 = common_vendor.resolveComponent("uni-load-more");
  (_easycom_uni_icons2 + _component_uni_button + _easycom_uni_load_more2)();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_uni_load_more = () => "../../uni_modules/uni-load-more/components/uni-load-more/uni-load-more.js";
if (!Math) {
  (_easycom_uni_icons + _easycom_uni_load_more)();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "sydAllList",
  setup(__props) {
    const orderList = common_vendor.ref([
      {
        shopName: "川味小厨（总店）",
        status: "预约中",
        deliveryCount: 5,
        weight: "4.24KG",
        carInfo: "川A3D47M",
        time: "2025-08-20 14:05:30"
      },
      {
        shopName: "湘味私房菜",
        status: "进行中",
        deliveryCount: 3,
        weight: "2.5KG",
        carInfo: "沪B12345",
        time: "2025-08-20 15:30:00"
      },
      {
        shopName: "粤式烧腊",
        status: "已完成",
        deliveryCount: 4,
        weight: "3.8KG",
        carInfo: "京C67890",
        time: "2025-08-20 16:45:00"
      }
    ]);
    const loadingStatus = common_vendor.ref("more");
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
        d: common_vendor.f(orderList.value, (item, index, i0) => {
          return common_vendor.e({
            a: common_vendor.t(item.shopName),
            b: common_vendor.t(item.status),
            c: common_vendor.n(item.status === "预约中" ? "booking" : item.status === "进行中" ? "processing" : "completed"),
            d: common_vendor.t(item.deliveryCount),
            e: common_vendor.t(item.weight),
            f: common_vendor.t(item.carInfo),
            g: common_vendor.t(item.time),
            h: item.status !== "已完成"
          }, item.status !== "已完成" ? {
            i: "b6e750bc-3-" + i0,
            j: common_vendor.p({
              size: "mini"
            })
          } : {}, {
            k: common_vendor.t(item.status === "预约中" ? "确认收运" : item.status === "进行中" ? "完成收运" : "查看详情"),
            l: "b6e750bc-4-" + i0,
            m: common_vendor.p({
              size: "mini",
              type: item.status === "预约中" ? "primary" : "default"
            }),
            n: index
          });
        }),
        e: common_vendor.p({
          status: loadingStatus.value,
          ["content-text"]: {
            contentdown: "上拉显示更多",
            contentrefresh: "正在加载...",
            contentnomore: "没有更多数据了"
          }
        })
      };
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-b6e750bc"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/merchant/sydAllList.js.map
