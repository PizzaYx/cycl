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
    },
    /**
     * 是否只显示查看按钮
     * @type {Boolean}
     * @description true-只显示查看按钮, false-根据状态显示所有按钮
     * @default false
     */
    viewOnly: {
      type: Boolean,
      default: false
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
        a: __props.viewOnly
      }, __props.viewOnly ? {
        b: common_vendor.o(handleView),
        c: common_vendor.p({
          size: "mini",
          type: "default"
        })
      } : __props.status === 0 || __props.status === "0" ? {
        e: common_vendor.o(handleReport),
        f: common_vendor.p({
          size: "mini",
          type: "primary"
        }),
        g: common_vendor.o(handleCancel),
        h: common_vendor.p({
          size: "mini",
          type: "default"
        }),
        i: common_vendor.o(handleView),
        j: common_vendor.p({
          size: "mini",
          type: "default"
        })
      } : {
        k: common_vendor.o(handleView),
        l: common_vendor.p({
          size: "mini",
          type: "default"
        })
      }, {
        d: __props.status === 0 || __props.status === "0"
      });
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-6ceb9dbd"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/components/DriverOrderActions/DriverOrderActions.js.map
