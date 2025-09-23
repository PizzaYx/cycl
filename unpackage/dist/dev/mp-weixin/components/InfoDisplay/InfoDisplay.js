"use strict";
const utils_orderUtils = require("../../utils/orderUtils.js");
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  name: "InfoDisplay",
  props: {
    fields: {
      type: Array,
      required: true
    }
  },
  methods: {
    getFieldValue(field) {
      if (field.key === "weight" || field.key === "estimateWeight") {
        return utils_orderUtils.formatWeight(field.value);
      } else if (field.key === "bucketNum" || field.key === "estimateBucketNum" || field.key === "deliveryCount") {
        return utils_orderUtils.formatNum(field.value);
      } else {
        return field.value || "暂无";
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f($props.fields, (field, k0, i0) => {
      return {
        a: common_vendor.t(field.label),
        b: common_vendor.t($options.getFieldValue(field)),
        c: field.key
      };
    })
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-e3352e09"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/components/InfoDisplay/InfoDisplay.js.map
