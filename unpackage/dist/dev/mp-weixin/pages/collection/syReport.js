"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _easycom_uni_nav_bar2 = common_vendor.resolveComponent("uni-nav-bar");
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_uni_file_picker2 = common_vendor.resolveComponent("uni-file-picker");
  (_easycom_uni_nav_bar2 + _easycom_uni_icons2 + _easycom_uni_file_picker2)();
}
const _easycom_uni_nav_bar = () => "../../uni_modules/uni-nav-bar/components/uni-nav-bar/uni-nav-bar.js";
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_uni_file_picker = () => "../../uni_modules/uni-file-picker/components/uni-file-picker/uni-file-picker.js";
if (!Math) {
  (_easycom_uni_nav_bar + _easycom_uni_icons + _easycom_uni_file_picker)();
}
const maxImageCount = 3;
const maxImageSize = 3 * 1024 * 1024;
const _sfc_main = {
  __name: "syReport",
  setup(__props) {
    const ljNum = common_vendor.ref(1);
    const isInputReadOnly = common_vendor.ref(false);
    const records = common_vendor.ref([
      {
        binCount: "",
        weight: "",
        images: []
        // 改为数组存储多张图片
      }
    ]);
    const handleFileUpload = (event) => {
      if (!event || !event.file) {
        common_vendor.index.__f__("warn", "at pages/collection/syReport.vue:90", "文件上传事件参数不完整:", event);
        return true;
      }
      const { file, index } = event;
      if (file.size && file.size > maxImageSize) {
        common_vendor.index.showToast({
          title: "单张图片不能超过3M",
          icon: "none"
        });
        return false;
      }
      return true;
    };
    const handleScan = () => {
      common_vendor.index.scanCode({
        success: (res) => {
          common_vendor.index.__f__("log", "at pages/collection/syReport.vue:112", "扫码结果", res);
          records.value.push({
            binCount: "",
            weight: "",
            images: []
          });
          ljNum.value++;
        },
        fail: (err) => {
          common_vendor.index.__f__("log", "at pages/collection/syReport.vue:123", "扫码失败", err);
          records.value.push({
            binCount: "",
            weight: "",
            images: []
          });
          ljNum.value++;
        }
      });
    };
    const handleCancel = (index) => {
      if (records.value.length <= 1) {
        common_vendor.index.showToast({
          title: "至少保留一条数据",
          icon: "none"
        });
        return;
      }
      common_vendor.index.showModal({
        title: "确认删除",
        content: "是否确认删除当前数据？",
        success: (res) => {
          if (res.confirm) {
            records.value.splice(index, 1);
            ljNum.value--;
          }
        }
      });
    };
    const handleConfirm = (index) => {
      common_vendor.index.__f__("log", "at pages/collection/syReport.vue:162", "确认提交", records.value[index]);
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(_ctx.back),
        b: common_vendor.p({
          dark: true,
          fixed: true,
          ["background-color"]: "#fff",
          ["status-bar"]: true,
          ["left-icon"]: "left",
          color: "#000",
          title: "收运记录"
        }),
        c: common_vendor.t(ljNum.value),
        d: common_vendor.o(handleScan),
        e: common_vendor.p({
          type: "scan",
          size: "24",
          color: "#07C160"
        }),
        f: common_vendor.f(records.value, (item, index, i0) => {
          return {
            a: item.binCount,
            b: common_vendor.o(($event) => item.binCount = $event.detail.value, index),
            c: item.weight,
            d: common_vendor.o(($event) => item.weight = $event.detail.value, index),
            e: common_vendor.o(handleFileUpload, index),
            f: "e09b3d48-2-" + i0,
            g: common_vendor.o(($event) => item.images = $event, index),
            h: common_vendor.p({
              ["file-mediatype"]: "image",
              limit: maxImageCount,
              readonly: isInputReadOnly.value,
              modelValue: item.images
            }),
            i: common_vendor.o(($event) => handleCancel(index), index),
            j: common_vendor.o(($event) => handleConfirm(index), index),
            k: index
          };
        }),
        g: isInputReadOnly.value,
        h: isInputReadOnly.value,
        i: common_vendor.t(maxImageCount)
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-e09b3d48"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/collection/syReport.js.map
