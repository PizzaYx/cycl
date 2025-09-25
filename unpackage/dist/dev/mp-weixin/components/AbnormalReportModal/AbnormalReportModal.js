"use strict";
const common_vendor = require("../../common/vendor.js");
const api_apis = require("../../api/apis.js");
const _sfc_main = {
  __name: "AbnormalReportModal",
  props: {
    /**
     * 是否显示弹窗
     */
    show: {
      type: Boolean,
      default: false
    },
    /**
     * 订单数据
     */
    orderData: {
      type: Object,
      default: null
    }
  },
  emits: ["close", "success"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const abnormalTypes = [
      { label: "商家未营业", value: "merchant_closed" },
      { label: "垃圾桶损坏", value: "bucket_damaged" },
      { label: "道路不通", value: "road_blocked" },
      { label: "商家拒绝收运", value: "merchant_refused" },
      { label: "设备故障", value: "equipment_failure" },
      { label: "天气原因", value: "weather_issue" }
    ];
    const selectedException = common_vendor.ref("");
    const otherReason = common_vendor.ref("");
    common_vendor.watch(() => props.show, (newVal) => {
      if (newVal) {
        selectedException.value = "";
        otherReason.value = "";
      }
    });
    const selectExceptionType = (type) => {
      selectedException.value = type;
      otherReason.value = "";
    };
    const onOtherReasonInput = () => {
      if (otherReason.value.trim()) {
        selectedException.value = "";
      }
    };
    const preventTouch = (e) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    };
    const handleClose = () => {
      emit("close");
    };
    const handleSubmit = async () => {
      if (!selectedException.value.trim() && !otherReason.value.trim()) {
        common_vendor.index.showToast({ title: "请选择异常类型或输入其他原因", icon: "none" });
        return;
      }
      try {
        let fullRemark = "";
        if (selectedException.value) {
          fullRemark = selectedException.value;
        } else {
          fullRemark = otherReason.value;
        }
        const { id: planId } = props.orderData;
        const result = await api_apis.apiGetnoNeedCollect({
          id: planId,
          driverId: props.orderData.driverId,
          remark: fullRemark
        });
        if (result.code === 200) {
          common_vendor.index.showToast({ title: "异常上报成功", icon: "success" });
          emit("success");
          handleClose();
        } else {
          common_vendor.index.showToast({ title: result.message || "异常上报失败", icon: "none" });
        }
      } catch (error) {
        common_vendor.index.showToast({ title: "异常上报失败", icon: "none" });
        common_vendor.index.__f__("error", "at components/AbnormalReportModal/AbnormalReportModal.vue:153", "异常上报失败:", error);
      }
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: __props.show
      }, __props.show ? {
        b: common_vendor.o(handleClose),
        c: common_vendor.f(abnormalTypes, (type, index, i0) => {
          return common_vendor.e({
            a: selectedException.value === type.label
          }, selectedException.value === type.label ? {} : {}, {
            b: selectedException.value === type.label ? 1 : "",
            c: common_vendor.t(type.label),
            d: index,
            e: selectedException.value === type.label ? 1 : "",
            f: common_vendor.o(($event) => selectExceptionType(type.label), index)
          });
        }),
        d: common_vendor.o([($event) => otherReason.value = $event.detail.value, onOtherReasonInput]),
        e: otherReason.value,
        f: common_vendor.t(otherReason.value.length),
        g: common_vendor.o(handleClose),
        h: !selectedException.value.trim() ? 1 : "",
        i: common_vendor.o(handleSubmit),
        j: common_vendor.o(preventTouch),
        k: common_vendor.o(preventTouch),
        l: common_vendor.o(preventTouch)
      } : {});
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-407f79fb"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/components/AbnormalReportModal/AbnormalReportModal.js.map
