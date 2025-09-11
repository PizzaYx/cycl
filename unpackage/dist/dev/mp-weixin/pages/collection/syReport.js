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
  __name: "syReport",
  setup(__props) {
    const records = common_vendor.ref([
      {
        binCount: "",
        weight: "",
        image: ""
      }
    ]);
    const handleUpload = (index) => {
      common_vendor.index.chooseMedia({
        count: 1,
        mediaType: ["video"],
        sourceType: ["album", "camera"],
        maxDuration: 60,
        success: (res) => {
          common_vendor.index.__f__("log", "at pages/collection/syReport.vue:68", res);
        }
      });
    };
    const handleCancel = (index) => {
      records.value[index] = {
        binCount: "",
        weight: "",
        image: ""
      };
    };
    const handleConfirm = (index) => {
      common_vendor.index.__f__("log", "at pages/collection/syReport.vue:82", "确认提交", records.value[index]);
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          type: "more-filled",
          size: "24",
          color: "#333333"
        }),
        b: common_vendor.f(records.value, (item, index, i0) => {
          return {
            a: item.binCount,
            b: common_vendor.o(($event) => item.binCount = $event.detail.value, index),
            c: item.weight,
            d: common_vendor.o(($event) => item.weight = $event.detail.value, index),
            e: "31477fa9-1-" + i0,
            f: common_vendor.o(($event) => handleUpload(), index),
            g: common_vendor.o(($event) => handleCancel(index), index),
            h: common_vendor.o(($event) => handleConfirm(index), index),
            i: index
          };
        }),
        c: common_vendor.p({
          type: "plusempty",
          size: "32",
          color: "#CCCCCC"
        })
      };
    };
  }
});
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/collection/syReport.js.map
