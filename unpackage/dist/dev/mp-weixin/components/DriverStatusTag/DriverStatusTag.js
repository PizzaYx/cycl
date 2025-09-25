"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "DriverStatusTag",
  props: {
    /**
     * 订单状态值
     * @type {Number|String}
     * @description 0-进行中, 1-已完成, 2-无法收运
     * @required true
     */
    status: {
      type: [Number, String],
      required: true
    }
  },
  setup(__props) {
    const props = __props;
    const statusText = common_vendor.computed(() => {
      return getStatusText(props.status);
    });
    const statusClass = common_vendor.computed(() => {
      return getStatusClass(props.status);
    });
    const getStatusText = (status) => {
      const statusValue = Number(status);
      switch (statusValue) {
        case 0:
          return "进行中";
        case 1:
          return "已完成";
        case 2:
          return "无法收运";
        default:
          return "未知状态";
      }
    };
    const getStatusClass = (status) => {
      const statusValue = Number(status);
      switch (statusValue) {
        case 0:
          return "processing";
        case 1:
          return "completed";
        case 2:
          return "cancelled";
        default:
          return "";
      }
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.t(statusText.value),
        b: common_vendor.n(statusClass.value)
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-b25c61d8"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/components/DriverStatusTag/DriverStatusTag.js.map
