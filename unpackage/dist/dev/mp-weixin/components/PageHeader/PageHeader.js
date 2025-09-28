"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _easycom_uni_nav_bar2 = common_vendor.resolveComponent("uni-nav-bar");
  _easycom_uni_nav_bar2();
}
const _easycom_uni_nav_bar = () => "../../uni_modules/uni-nav-bar/components/uni-nav-bar/uni-nav-bar.js";
if (!Math) {
  _easycom_uni_nav_bar();
}
const _sfc_main = {
  __name: "PageHeader",
  props: {
    /**
     * 页面标题
     * @type {String}
     * @description 显示在导航栏中间的标题文字
     * @required true
     */
    title: {
      type: String,
      required: true
    }
  },
  emits: ["back"],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    const handleBack = () => {
      emit("back");
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(handleBack),
        b: common_vendor.p({
          dark: true,
          fixed: true,
          ["background-color"]: "#fff",
          ["status-bar"]: true,
          ["left-icon"]: "left",
          color: "#000",
          title: __props.title
        })
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-5b4cc82c"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/components/PageHeader/PageHeader.js.map
