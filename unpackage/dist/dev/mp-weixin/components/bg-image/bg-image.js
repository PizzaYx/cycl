"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "bg-image",
  props: {
    src: {
      type: String,
      default: "/static/headTopBg.png"
    },
    height: {
      type: String,
      default: "442rpx"
    }
  },
  setup(__props) {
    return (_ctx, _cache) => {
      return {
        a: __props.src
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-c0a7bcbd"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/components/bg-image/bg-image.js.map
