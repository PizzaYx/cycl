"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_uni_datetime_picker2 = common_vendor.resolveComponent("uni-datetime-picker");
  (_easycom_uni_icons2 + _easycom_uni_datetime_picker2)();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_uni_datetime_picker = () => "../../uni_modules/uni-datetime-picker/components/uni-datetime-picker/uni-datetime-picker.js";
if (!Math) {
  (_easycom_uni_icons + _easycom_uni_datetime_picker)();
}
const _sfc_main = {
  __name: "TimeRangePicker",
  props: {
    // 初始选中的时间范围，格式：['2023-01-01', '2023-01-31']
    modelValue: {
      type: Array,
      default: () => []
    }
  },
  emits: [
    "update:modelValue",
    // 时间范围变化时触发，用于 v-model 双向绑定
    "change"
    // 时间范围变化时触发，传递新的时间范围
  ],
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const selectedTimeRange = common_vendor.ref([]);
    const showClearButton = common_vendor.ref(false);
    const datetimePicker = common_vendor.ref(null);
    common_vendor.watch(() => props.modelValue, (newValue) => {
      selectedTimeRange.value = newValue || [];
    }, { immediate: true });
    common_vendor.watch(selectedTimeRange, (newValue) => {
      emit("update:modelValue", newValue);
      emit("change", newValue);
    });
    const getCurrentDateTime = () => {
      const now = /* @__PURE__ */ new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const day = String(now.getDate()).padStart(2, "0");
      const hour = String(now.getHours()).padStart(2, "0");
      const minute = String(now.getMinutes()).padStart(2, "0");
      const second = String(now.getSeconds()).padStart(2, "0");
      return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
    };
    const onTimePickerShow = () => {
      common_vendor.index.__f__("log", "at components/TimeRangePicker/TimeRangePicker.vue:89", "时间选择器已打开");
      showClearButton.value = true;
    };
    const onTimePickerClose = () => {
      common_vendor.index.__f__("log", "at components/TimeRangePicker/TimeRangePicker.vue:99", "时间选择器已关闭");
      showClearButton.value = false;
    };
    const onTimeChange = (value) => {
      common_vendor.index.__f__("log", "at components/TimeRangePicker/TimeRangePicker.vue:109", "时间变化:", value);
      selectedTimeRange.value = value;
      showClearButton.value = false;
    };
    const clearTimeRange = () => {
      common_vendor.index.__f__("log", "at components/TimeRangePicker/TimeRangePicker.vue:120", "清除时间范围");
      if (datetimePicker.value) {
        datetimePicker.value.clear();
        datetimePicker.value.close();
      }
      selectedTimeRange.value = [];
      showClearButton.value = false;
    };
    __expose({
      clear: clearTimeRange,
      // 清除方法
      show: () => {
        var _a;
        return (_a = datetimePicker.value) == null ? void 0 : _a.show();
      },
      // 显示方法
      close: () => {
        var _a;
        return (_a = datetimePicker.value) == null ? void 0 : _a.close();
      }
      // 关闭方法
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          type: "bottom",
          size: "12",
          color: "#666"
        }),
        b: common_vendor.sr(datetimePicker, "b8a775ab-0", {
          "k": "datetimePicker"
        }),
        c: common_vendor.o(onTimeChange),
        d: common_vendor.o(onTimePickerShow),
        e: common_vendor.o(onTimePickerClose),
        f: common_vendor.o(($event) => selectedTimeRange.value = $event),
        g: common_vendor.p({
          type: "datetimerange",
          rangeSeparator: "至",
          start: "2020-01-01 00:00:00",
          end: getCurrentDateTime(),
          modelValue: selectedTimeRange.value
        }),
        h: showClearButton.value ? 1 : "",
        i: common_vendor.o(clearTimeRange)
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-b8a775ab"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/components/TimeRangePicker/TimeRangePicker.js.map
