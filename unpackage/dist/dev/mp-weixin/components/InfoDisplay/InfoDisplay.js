"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_orderUtils = require("../../utils/orderUtils.js");
const _sfc_main = {
  name: "InfoDisplay",
  props: {
    /**
     * 字段配置数组
     * @type {Array}
     * @description 每个字段对象包含key、label、value属性
     * @required true
     * @example
     * [
     *   { key: 'appointmentTime', label: '预估时间', value: '2024-01-01 10:00' },
     *   { key: 'estimateWeight', label: '预估重量', value: 12.5 }
     * ]
     */
    fields: {
      type: Array,
      required: true
    },
    /**
     * 是否显示上边框
     * @type {Boolean}
     * @description 控制组件上边框的显示，默认为true
     * @default true
     */
    showTopBorder: {
      type: Boolean,
      default: true
    },
    /**
     * 是否显示下边框
     * @type {Boolean}
     * @description 控制组件下边框的显示，默认为true
     * @default true
     */
    showBottomBorder: {
      type: Boolean,
      default: true
    },
    /**
     * 是否启用地址导航功能
     * @type {Boolean}
     * @description 控制地址字段是否显示定位图标和点击导航功能，默认为false
     * @default false
     */
    enableAddressNavigation: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    /**
     * 获取字段显示值
     * 根据字段类型进行相应的格式化处理
     * 
     * @param {Object} field - 字段对象
     * @param {String} field.key - 字段标识
     * @param {*} field.value - 字段值
     * @returns {String} 格式化后的显示值
     */
    getFieldValue(field) {
      if (field.key === "weight" || field.key === "estimateWeight") {
        return utils_orderUtils.formatWeight(field.value);
      } else if (field.key === "bucketNum" || field.key === "estimateBucketNum" || field.key === "deliveryCount") {
        return utils_orderUtils.formatNum(field.value);
      } else {
        return field.value || "暂无";
      }
    },
    /**
     * 处理地址点击事件
     * 显示导航选择弹窗
     * 
     * @param {Object} field - 地址字段对象
     */
    handleAddressClick(field) {
      if (field.key === "address" && this.enableAddressNavigation) {
        const taskData = this.getTaskDataFromField(field);
        this.showNavigationActionSheet(field.value, taskData);
      }
    },
    /**
     * 从字段中获取任务数据
     * 这里需要从父组件传递完整的任务数据
     * 
     * @param {Object} field - 字段对象
     * @returns {Object} 任务数据
     */
    getTaskDataFromField(field) {
      if (field.taskData) {
        return field.taskData;
      }
      return {};
    },
    /**
     * 显示导航选择操作表
     * 
     * @param {String} address - 地址
     * @param {Object} taskData - 任务数据，包含经纬度信息
     */
    showNavigationActionSheet(address, taskData = {}) {
      this.openLocation(address, taskData);
    },
    /**
     * 打开地图导航（统一使用 wx.openLocation）
     * 
     * @param {String} address - 地址
     * @param {Object} taskData - 任务数据，包含经纬度信息
     */
    openLocation(address, taskData = {}) {
      common_vendor.index.__f__("log", "at components/InfoDisplay/InfoDisplay.vue:173", "打开地图导航，地址:", address, "任务数据:", taskData);
      if (taskData.lat && taskData.lon) {
        const lat = parseFloat(taskData.lat);
        const lon = parseFloat(taskData.lon);
        common_vendor.index.__f__("log", "at components/InfoDisplay/InfoDisplay.vue:179", "使用经纬度导航:", lat, lon);
        common_vendor.wx$1.openLocation({
          latitude: lat,
          longitude: lon,
          name: taskData.merchantName || "目标位置",
          address,
          scale: 18
        });
      } else {
        common_vendor.index.__f__("log", "at components/InfoDisplay/InfoDisplay.vue:190", "没有经纬度信息，无法导航");
        common_vendor.index.showToast({
          title: "地址信息不完整，无法导航",
          icon: "none",
          duration: 2e3
        });
      }
    }
  }
};
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  _easycom_uni_icons2();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  _easycom_uni_icons();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f($props.fields, (field, k0, i0) => {
      return common_vendor.e({
        a: common_vendor.t(field.label),
        b: common_vendor.t($options.getFieldValue(field)),
        c: field.key === "address" && $props.enableAddressNavigation
      }, field.key === "address" && $props.enableAddressNavigation ? {
        d: "e3352e09-0-" + i0,
        e: common_vendor.p({
          type: "location-filled",
          size: "16",
          color: "#07C160"
        })
      } : {}, {
        f: field.key,
        g: field.key === "address" && $props.enableAddressNavigation ? 1 : "",
        h: common_vendor.o(($event) => field.key === "address" && $props.enableAddressNavigation ? $options.handleAddressClick(field) : null, field.key)
      });
    }),
    b: !$props.showTopBorder ? 1 : "",
    c: !$props.showBottomBorder ? 1 : ""
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-e3352e09"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/components/InfoDisplay/InfoDisplay.js.map
