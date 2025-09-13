"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_config = require("../../utils/config.js");
const api_apis = require("../../api/apis.js");
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
const _sfc_main = {
  __name: "syReport",
  setup(__props) {
    const back = () => {
      common_vendor.index.$emit("refreshSfDetails");
      common_vendor.index.navigateBack();
    };
    const ljNum = common_vendor.ref(1);
    const carId = common_vendor.ref("");
    const driverId = common_vendor.ref("");
    const merchantId = common_vendor.ref("");
    const planId = common_vendor.ref("");
    const uploadHeaders = utils_config.createUploadHeaders();
    const records = common_vendor.ref([
      {
        binCount: "",
        weight: "",
        images: [],
        // 改为数组存储多张图片
        isConfirmed: false
        // 添加确认状态
      }
    ]);
    common_vendor.onLoad((options) => {
      if (options.carId)
        carId.value = options.carId;
      if (options.driverId)
        driverId.value = options.driverId;
      if (options.merchantId)
        merchantId.value = options.merchantId;
      if (options.planId)
        planId.value = options.planId;
      common_vendor.index.__f__("log", "at pages/collection/syReport.vue:109", "接收到的参数:", options);
    });
    const handleFileSelect = (event, index) => {
      if (event.tempFiles && event.tempFiles.length > 0) {
        const newImages = [...records.value[index].images || [], ...event.tempFiles];
        records.value[index].images = newImages;
      }
    };
    const handleFileSuccess = (event, index) => {
      common_vendor.index.__f__("log", "at pages/collection/syReport.vue:124", "文件上传成功", event);
    };
    const handleFileFail = (event, index) => {
      common_vendor.index.__f__("log", "at pages/collection/syReport.vue:128", "文件上传失败", event);
    };
    const handleScan = () => {
      common_vendor.index.scanCode({
        success: (res) => {
          common_vendor.index.__f__("log", "at pages/collection/syReport.vue:135", "扫码结果", res);
          records.value.push({
            binCount: "",
            weight: "",
            images: [],
            isConfirmed: false
            // 添加确认状态
          });
          ljNum.value++;
        },
        fail: (err) => {
          common_vendor.index.__f__("log", "at pages/collection/syReport.vue:147", "扫码失败", err);
          records.value.push({
            binCount: "",
            weight: "",
            images: [],
            isConfirmed: false
            // 添加确认状态
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
      const record = records.value[index];
      if (!record.weight || record.weight.trim() === "") {
        common_vendor.index.showToast({
          title: "请输入垃圾重量",
          icon: "none"
        });
        return;
      }
      if (record.images === void 0 || record.images === null) {
        common_vendor.index.showToast({
          title: "请至少上传1张图片",
          icon: "none"
        });
        return;
      }
      if (!Array.isArray(record.images)) {
        common_vendor.index.showToast({
          title: "请至少上传1张图片",
          icon: "none"
        });
        return;
      }
      if (record.images.length === 0) {
        common_vendor.index.showToast({
          title: "请至少上传1张图片",
          icon: "none"
        });
        return;
      }
      const validFiles = record.images.filter((file) => {
        if (!file) {
          return false;
        }
        const hasUrl = file.url && file.url.trim();
        const hasPath = file.path && file.path.trim();
        const hasResponse = file.response && file.response.url;
        const isString = typeof file === "string" && file.trim();
        const hasFileId = file.fileID || file.id;
        const hasName = file.name;
        const hasSize = file.size;
        const hasTempFilePath = file.tempFilePath;
        const hasFile = file.file;
        const isValid = hasUrl || hasPath || hasResponse || isString || hasFileId || hasName || hasSize || hasTempFilePath || hasFile;
        return isValid;
      });
      if (validFiles.length === 0) {
        common_vendor.index.showToast({
          title: "请至少上传1张图片",
          icon: "none"
        });
        return;
      }
      if (validFiles.length > maxImageCount) {
        common_vendor.index.showToast({
          title: `最多只能上传${maxImageCount}张图片`,
          icon: "none"
        });
        return;
      }
      confirmReport(index);
    };
    const confirmReport = async (index) => {
      const record = records.value[index];
      const bucketCode = "BC" + (/* @__PURE__ */ new Date()).getTime();
      const reportData = {
        bucketCode,
        // 桶编码
        weight: parseFloat(record.weight),
        // 垃圾重量改为小数类型
        carId: carId.value,
        // 车辆ID
        driverId: driverId.value,
        // 司机ID
        merchantId: merchantId.value,
        // 商户ID
        planId: planId.value,
        // 收运单ID
        img: record.images.map((image) => {
          if (image.url)
            return image.url;
          if (image.path)
            return image.path;
          if (image.response && image.response.url)
            return image.response.url;
          if (typeof image === "string")
            return image;
          return "";
        }).filter((url) => url !== "").join(",")
        // 过滤掉空的URL并用逗号连接
      };
      try {
        const res = await api_apis.apiPostreportWeight(reportData);
        if (res.code === 200) {
          common_vendor.index.showToast({
            title: "上报成功",
            icon: "success"
          });
          record.isConfirmed = true;
        } else {
          common_vendor.index.showToast({
            title: res.message || "上报失败",
            icon: "none"
          });
        }
      } catch (error) {
        common_vendor.index.showToast({
          title: "上报异常",
          icon: "none"
        });
        common_vendor.index.__f__("error", "at pages/collection/syReport.vue:315", "上报异常:", error);
      }
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(back),
        b: common_vendor.p({
          dark: true,
          fixed: true,
          ["background-color"]: "#fff",
          ["status-bar"]: true,
          ["left-icon"]: "left",
          color: "#000",
          title: "收运上报"
        }),
        c: common_vendor.t(ljNum.value),
        d: common_vendor.o(handleScan),
        e: common_vendor.p({
          type: "scan",
          size: "24",
          color: "#07C160"
        }),
        f: common_vendor.f(records.value, (item, index, i0) => {
          return common_vendor.e({
            a: item.binCount,
            b: common_vendor.o(($event) => item.binCount = $event.detail.value, index),
            c: item.isConfirmed ? 1 : "",
            d: item.isConfirmed,
            e: item.weight,
            f: common_vendor.o(($event) => item.weight = $event.detail.value, index),
            g: common_vendor.o((e) => handleFileSelect(e, index), index),
            h: common_vendor.o((e) => handleFileSuccess(e), index),
            i: common_vendor.o((e) => handleFileFail(e), index),
            j: "e09b3d48-2-" + i0,
            k: common_vendor.o(($event) => item.images = $event, index),
            l: common_vendor.p({
              ["file-mediatype"]: "image",
              limit: maxImageCount,
              ["auto-upload"]: true,
              ["upload-url"]: common_vendor.unref(utils_config.uploadUrl),
              header: common_vendor.unref(uploadHeaders),
              disabled: item.isConfirmed,
              readonly: item.isConfirmed,
              ["return-type"]: "array",
              modelValue: item.images
            }),
            m: !item.isConfirmed
          }, !item.isConfirmed ? {
            n: common_vendor.o(($event) => handleCancel(index), index)
          } : {}, {
            o: !item.isConfirmed
          }, !item.isConfirmed ? {
            p: common_vendor.o(($event) => handleConfirm(index), index)
          } : {}, {
            q: index
          });
        }),
        g: common_vendor.t(maxImageCount)
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-e09b3d48"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/collection/syReport.js.map
