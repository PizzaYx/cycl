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
const _sfc_main = {
  __name: "merchant",
  setup(__props) {
    const records = common_vendor.ref([
      {
        name: "川味小厨（总店）",
        time: "2023-08-20 14:05:30",
        weight: "1.56kg",
        status: "待确定"
      },
      {
        name: "川味小厨（总店）",
        time: "2023-08-20 14:05:30",
        weight: "1.56kg",
        status: "已完成"
      },
      {
        name: "川味小厨（总店）",
        time: "2023-08-20 14:05:30",
        weight: "1.56kg",
        status: "已完成"
      },
      {
        name: "川味小厨（总店）",
        time: "2023-08-20 14:05:30",
        weight: "1.56kg",
        status: "已完成"
      }
    ]);
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          type: "chatboxes",
          size: "24",
          color: "#fff"
        }),
        b: common_vendor.p({
          type: "calendar",
          size: "24",
          color: "#fff"
        }),
        c: common_vendor.p({
          type: "chart",
          size: "24",
          color: "#fff"
        }),
        d: common_vendor.p({
          type: "person-filled",
          size: "24",
          color: "#fff"
        }),
        e: common_vendor.f(records.value, (item, index, i0) => {
          return {
            a: common_vendor.t(item.name),
            b: common_vendor.t(item.time),
            c: common_vendor.t(item.weight),
            d: common_vendor.t(item.status),
            e: index
          };
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-b35646dd"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/merchant/merchant.js.map
