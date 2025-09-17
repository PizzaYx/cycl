"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_config = require("../../utils/config.js");
const api_apis = require("../../api/apis.js");
const stores_user = require("../../stores/user.js");
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
    const ljNum = common_vendor.ref(0);
    const carId = common_vendor.ref("");
    const driverId = common_vendor.ref("");
    const merchantId = common_vendor.ref("");
    const planId = common_vendor.ref("");
    const merchantName = common_vendor.ref("");
    const uploadHeaders = utils_config.createUploadHeaders().value;
    const userStore = stores_user.useUserStore();
    const records = common_vendor.ref([]);
    common_vendor.onLoad((options) => {
      if (options.carId)
        carId.value = options.carId;
      if (options.driverId)
        driverId.value = options.driverId;
      if (options.merchantId)
        merchantId.value = options.merchantId;
      if (options.planId)
        planId.value = options.planId;
      if (options.merchantName)
        merchantName.value = options.merchantName;
      common_vendor.index.__f__("log", "at pages/collection/syReport.vue:108", "接收到的参数:", options);
    });
    const handleFileSelect = (event, index) => {
      common_vendor.index.__f__("log", "at pages/collection/syReport.vue:113", "选择了图片");
      common_vendor.index.__f__("log", "at pages/collection/syReport.vue:114", "uploadUrl:", utils_config.uploadUrl);
      common_vendor.index.__f__("log", "at pages/collection/syReport.vue:115", "uploadHeaders:", uploadHeaders);
      common_vendor.index.__f__("log", "at pages/collection/syReport.vue:116", "event:", event);
      if (event.tempFiles && event.tempFiles.length > 0) {
        const newImages = [...records.value[index].images || [], ...event.tempFiles];
        records.value[index].images = newImages;
        uploadFileManually(event.tempFiles[0], index);
      }
    };
    const uploadFileManually = (file, index) => {
      common_vendor.index.__f__("log", "at pages/collection/syReport.vue:130", "开始手动上传文件:", file);
      common_vendor.index.__f__("log", "at pages/collection/syReport.vue:131", "文件路径:", file.tempFilePath || file.path);
      common_vendor.index.__f__("log", "at pages/collection/syReport.vue:132", "上传URL:", utils_config.uploadUrl);
      common_vendor.index.__f__("log", "at pages/collection/syReport.vue:133", "请求头:", uploadHeaders);
      common_vendor.index.uploadFile({
        url: utils_config.uploadUrl,
        filePath: file.tempFilePath || file.path,
        name: "file",
        header: uploadHeaders,
        success: (res) => {
          common_vendor.index.__f__("log", "at pages/collection/syReport.vue:141", "手动上传成功:", res);
          const response = JSON.parse(res.data);
          common_vendor.index.__f__("log", "at pages/collection/syReport.vue:144", "服务器响应:", response);
          if (response.code === 200 && response.url) {
            records.value[index].images[records.value[index].images.length - 1] = {
              ...file,
              url: response.url,
              fileName: response.fileName,
              newFileName: response.newFileName,
              originalFilename: response.originalFilename,
              response
            };
            common_vendor.index.__f__("log", "at pages/collection/syReport.vue:156", "文件上传成功，URL:", response.url);
          } else {
            common_vendor.index.__f__("log", "at pages/collection/syReport.vue:158", "上传失败，服务器返回:", response);
          }
        },
        fail: (err) => {
          common_vendor.index.__f__("log", "at pages/collection/syReport.vue:162", "手动上传失败:", err);
          common_vendor.index.__f__("log", "at pages/collection/syReport.vue:163", "错误详情:", JSON.stringify(err));
        }
      });
    };
    const handleGetWeight = (index) => {
      common_vendor.index.__f__("log", "at pages/collection/syReport.vue:170", "获取重量按钮点击", { index, record: records.value[index] });
    };
    const getSyCheckDetail = async () => {
      const confirmedRecords = records.value.filter((record) => record.isConfirmed === true);
      if (confirmedRecords.length === 0) {
        common_vendor.index.showToast({
          title: "请先进行收运上报操作并确认数据",
          icon: "none"
        });
        return;
      }
      try {
        const res = await api_apis.apiGetDriverPlanById({
          driverId: driverId.value,
          id: planId.value
        });
        if (res.code === 200) {
          const data = res.data;
          collectTask(data);
          common_vendor.index.__f__("log", "at pages/collection/syReport.vue:196", "详情", data);
        } else {
          common_vendor.index.showToast({
            title: res.msg || "获取详情失败",
            icon: "none"
          });
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/collection/syReport.vue:204", "获取详情异常:", error);
        common_vendor.index.showToast({
          title: "获取详情异常",
          icon: "none"
        });
      }
    };
    const collectTask = (task) => {
      common_vendor.index.__f__("log", "at pages/collection/syReport.vue:214", "收运:", task.id);
      if (task.weight > 0 && task.bucketNum > 0) {
        common_vendor.index.showModal({
          title: "确认收运完成",
          content: "是否确认收运完成？",
          success: async (res) => {
            var _a;
            if (res.confirm) {
              try {
                const confirmRes = await api_apis.apiGetdriverConfirmPlan({
                  id: task.id,
                  driverId: (_a = userStore.sfmerchant) == null ? void 0 : _a.id
                });
                if (confirmRes.code === 200) {
                  common_vendor.index.showToast({
                    title: confirmRes.msg || "操作成功",
                    icon: "success"
                  });
                  setTimeout(() => {
                    back();
                  }, 1500);
                } else {
                  common_vendor.index.showToast({
                    title: confirmRes.msg || "操作失败",
                    icon: "error"
                  });
                }
              } catch (error) {
                common_vendor.index.__f__("error", "at pages/collection/syReport.vue:246", "确认收运异常:", error);
                common_vendor.index.showToast({
                  title: "操作异常",
                  icon: "none"
                });
              }
            }
          }
        });
      } else {
        common_vendor.index.showToast({
          title: "服务器未检测到上报数据，请先进行收运上报操作",
          icon: "none"
        });
        return;
      }
    };
    const validateScanResult = (scanResult) => {
      if (!scanResult || typeof scanResult !== "string") {
        return false;
      }
      if (!scanResult.includes("_")) {
        return false;
      }
      const parts = scanResult.split("_");
      if (parts.length !== 2) {
        return false;
      }
      if (!parts[0] || !parts[1]) {
        return false;
      }
      const bucketId = parts[0];
      const timestamp = parts[1];
      if (!/^\d+$/.test(bucketId)) {
        return false;
      }
      if (!/^\d{14}$/.test(timestamp)) {
        return false;
      }
      return true;
    };
    const handleScan = () => {
      common_vendor.index.scanCode({
        success: (res) => {
          common_vendor.index.__f__("log", "at pages/collection/syReport.vue:310", "扫码结果", res);
          if (!validateScanResult(res.result)) {
            common_vendor.index.showToast({
              title: "扫码格式不正确，请扫描正确的桶码",
              icon: "none"
            });
            return;
          }
          const scanResult = res.result;
          const parts = scanResult.split("_");
          const scannedMerchantId = parts[0];
          common_vendor.index.__f__("log", "at pages/collection/syReport.vue:326", "扫码结果:", scanResult);
          common_vendor.index.__f__("log", "at pages/collection/syReport.vue:327", "扫码中的商户ID:", scannedMerchantId);
          common_vendor.index.__f__("log", "at pages/collection/syReport.vue:328", "当前商户ID:", merchantId.value);
          if (scannedMerchantId !== merchantId.value) {
            common_vendor.index.showToast({
              title: "桶码不属于当前商户，请扫描正确的桶码",
              icon: "none"
            });
            return;
          }
          const existingRecord = records.value.find((record) => record.bucketCode === res.result);
          if (existingRecord) {
            common_vendor.index.showToast({
              title: "该桶码已扫描，请勿重复扫描",
              icon: "none"
            });
            return;
          }
          records.value.push({
            binCount: "",
            weight: "",
            images: [],
            isConfirmed: false,
            // 添加确认状态
            bucketCode: res.result
            // 添加桶编码
          });
          ljNum.value++;
          common_vendor.index.showToast({
            title: "扫码成功",
            icon: "success"
          });
        },
        fail: (err) => {
          common_vendor.index.__f__("log", "at pages/collection/syReport.vue:365", "扫码失败", err);
          common_vendor.index.showToast({
            title: "扫码失败,请重试!",
            icon: "none"
          });
        }
      });
    };
    const handleCancel = (index) => {
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
      const bucketCode = record.bucketCode || "BC" + (/* @__PURE__ */ new Date()).getTime();
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
          common_vendor.index.__f__("log", "at pages/collection/syReport.vue:489", "处理图片数据:", image);
          common_vendor.index.__f__("log", "at pages/collection/syReport.vue:490", "图片URL:", image.url);
          common_vendor.index.__f__("log", "at pages/collection/syReport.vue:491", "图片路径:", image.path);
          common_vendor.index.__f__("log", "at pages/collection/syReport.vue:492", "图片响应:", image.response);
          if (image.url) {
            common_vendor.index.__f__("log", "at pages/collection/syReport.vue:496", "使用image.url:", image.url);
            return image.url;
          }
          if (image.path) {
            common_vendor.index.__f__("log", "at pages/collection/syReport.vue:500", "使用image.path:", image.path);
            return image.path;
          }
          if (image.response && image.response.url) {
            common_vendor.index.__f__("log", "at pages/collection/syReport.vue:504", "使用image.response.url:", image.response.url);
            return image.response.url;
          }
          if (typeof image === "string") {
            common_vendor.index.__f__("log", "at pages/collection/syReport.vue:508", "使用字符串:", image);
            return image;
          }
          common_vendor.index.__f__("log", "at pages/collection/syReport.vue:511", "没有找到有效的URL");
          return "";
        }).filter((url) => url !== "")
        // 过滤掉空的URL
      };
      reportData.img = reportData.img.join(",");
      common_vendor.index.__f__("log", "at pages/collection/syReport.vue:519", "最终上报的图片URLs:", reportData.img);
      common_vendor.index.__f__("log", "at pages/collection/syReport.vue:520", "完整上报数据:", reportData);
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
            title: res.msg || "上报失败",
            icon: "none"
          });
        }
      } catch (error) {
        common_vendor.index.showToast({
          title: "上报异常",
          icon: "none"
        });
        common_vendor.index.__f__("error", "at pages/collection/syReport.vue:544", "上报异常:", error);
      }
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
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
        c: common_vendor.t(merchantName.value),
        d: common_vendor.t(ljNum.value),
        e: common_vendor.o(handleScan),
        f: common_vendor.p({
          type: "scan",
          size: "30",
          color: "#07C160"
        }),
        g: records.value.length === 0
      }, records.value.length === 0 ? {} : {}, {
        h: common_vendor.f(records.value, (item, index, i0) => {
          return common_vendor.e({
            a: item.binCount,
            b: common_vendor.o(($event) => item.binCount = $event.detail.value, index),
            c: item.isConfirmed ? 1 : "",
            d: item.isConfirmed,
            e: item.weight,
            f: common_vendor.o(($event) => item.weight = $event.detail.value, index),
            g: common_vendor.o(($event) => handleGetWeight(index), index),
            h: item.isConfirmed,
            i: common_vendor.o((e) => handleFileSelect(e, index), index),
            j: "e09b3d48-2-" + i0,
            k: common_vendor.o(($event) => item.images = $event, index),
            l: common_vendor.p({
              ["file-mediatype"]: "image",
              limit: maxImageCount,
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
        i: common_vendor.t(maxImageCount),
        j: common_vendor.o(getSyCheckDetail)
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-e09b3d48"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/collection/syReport.js.map
