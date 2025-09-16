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
  __name: "StatusPicker",
  props: {
    // 初始选中的状态值
    modelValue: {
      type: [Number, String, null],
      default: null
    },
    // 状态选项配置
    options: {
      type: Array,
      default: () => [
        { value: 0, text: "待收运" },
        { value: 1, text: "已完成" },
        { value: 2, text: "无需收运" }
      ]
    }
  },
  emits: [
    "update:modelValue",
    // 状态变化时触发，用于 v-model 双向绑定
    "change"
    // 状态变化时触发，传递新的状态值
  ],
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const selectedStatus = common_vendor.ref(null);
    common_vendor.watch(() => props.modelValue, (newValue) => {
      selectedStatus.value = newValue;
    }, { immediate: true });
    common_vendor.watch(selectedStatus, (newValue) => {
      emit("update:modelValue", newValue);
      emit("change", newValue);
    });
    const showStatusPicker = () => {
      const itemList = props.options.map((item) => {
        const isSelected = selectedStatus.value === item.value;
        return isSelected ? `✓ ${item.text}` : item.text;
      });
      common_vendor.index.showActionSheet({
        itemList,
        success: (res) => {
          const selectedOption = props.options[res.tapIndex];
          selectedStatus.value = selectedOption.value;
          common_vendor.index.__f__("log", "at components/StatusPicker/StatusPicker.vue:79", "状态选择:", selectedOption.text, selectedOption.value);
        },
        fail: (res) => {
          if (res.errMsg.includes("cancel")) {
            selectedStatus.value = null;
            common_vendor.index.__f__("log", "at components/StatusPicker/StatusPicker.vue:86", "状态已重置为 null");
          }
        }
      });
    };
    __expose({
      reset: () => {
        selectedStatus.value = null;
      },
      // 重置方法
      setValue: (value) => {
        selectedStatus.value = value;
      }
      // 设置值方法
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          type: "bottom",
          size: "12",
          color: "#666"
        }),
        b: common_vendor.o(showStatusPicker)
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-e667379f"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/components/StatusPicker/StatusPicker.js.map
