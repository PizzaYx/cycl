"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _component_uni_button = common_vendor.resolveComponent("uni-button");
  _component_uni_button();
}
const _sfc_main = {
  __name: "DriverOrderActions",
  props: {
    /**
     * 订单状态
     * @type {Number|String}
     * @description 0-进行中, 1-已完成, 2-无法收运
     * @required true
     */
    status: {
      type: [Number, String],
      required: true
    },
    /**
     * 订单数据
     * @type {Object}
     * @description 包含订单的完整信息，用于传递给事件处理函数
     * @required true
     */
    orderData: {
      type: Object,
      required: true
    }
  },
  emits: ["refresh", "abnormalReport"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const handleCancel = () => {
      emit("abnormalReport", props.orderData);
    };
    const handleReport = () => {
      const { carId, driverId, merchantId, id: planId, merchantName, registrationNumber } = props.orderData;
      common_vendor.index.navigateTo({
        url: `/pages/collection/syReport?carId=${carId}&driverId=${driverId}&merchantId=${merchantId}&planId=${planId}&merchantName=${merchantName}&registrationNumber=${registrationNumber}`
      });
    };
    const handleView = () => {
      const { id: planId, driverId } = props.orderData;
      common_vendor.index.navigateTo({
        url: `/pages/collection/syCheckDetail?planId=${planId}&driverId=${driverId}`
      });
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: __props.status === 0 || __props.status === "0"
      }, __props.status === 0 || __props.status === "0" ? {
        b: common_vendor.o(handleReport),
        c: common_vendor.p({
          size: "mini",
          type: "primary"
        }),
        d: common_vendor.o(handleCancel),
        e: common_vendor.p({
          size: "mini",
          type: "default"
        }),
        f: common_vendor.o(handleView),
        g: common_vendor.p({
          size: "mini",
          type: "default"
        })
      } : {
        h: common_vendor.o(handleView),
        i: common_vendor.p({
          size: "mini",
          type: "default"
        })
      });
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-6ceb9dbd"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/components/DriverOrderActions/DriverOrderActions.js.map
