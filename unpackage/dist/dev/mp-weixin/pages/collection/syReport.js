"use strict";
const common_vendor = require("../../common/vendor.js");
const api_apis = require("../../api/apis.js");
const stores_user = require("../../stores/user.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  _easycom_uni_icons2();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  (PageHeader + _easycom_uni_icons)();
}
const PageHeader = () => "../../components/PageHeader/PageHeader.js";
const _sfc_main = {
  __name: "syReport",
  setup(__props) {
    const back = () => {
      common_vendor.index.$emit("refreshSfDetails");
      common_vendor.index.navigateBack();
    };
    const handleRefresh = async () => {
      try {
        const weightRes = await api_apis.apiGetBackfillBuckeWeight({
          id: planId.value,
          // 收运单ID
          merchantId: merchantId.value,
          // 商户ID
          driverId: driverId.value,
          // 司机ID
          registrationNumber: registrationNumber.value
          // 车牌号
        });
        if (weightRes.code === 200) {
          common_vendor.index.__f__("log", "at pages/collection/syReport.vue:79", "刷新获取的重量信息:", weightRes.data);
          records.value = [];
          submitData.value = [];
          ljNum.value = 0;
          if (weightRes.data && (Array.isArray(weightRes.data) ? weightRes.data.length > 0 : true)) {
            addRecordsFromBucketData([], weightRes.data);
            common_vendor.index.showToast({
              title: "刷新成功",
              icon: "success"
            });
          } else {
            common_vendor.index.showToast({
              title: "未获取到数据，请稍后点击刷新按钮",
              icon: "none",
              duration: 2e3
            });
          }
        } else {
          common_vendor.index.showToast({
            title: weightRes.msg || "刷新失败",
            icon: "none"
          });
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/collection/syReport.vue:108", "刷新重量数据异常:", error);
        common_vendor.index.showToast({
          title: "刷新异常",
          icon: "none"
        });
      } finally {
      }
    };
    const ljNum = common_vendor.ref(0);
    const showRefreshButton = common_vendor.ref(false);
    const carId = common_vendor.ref("");
    const driverId = common_vendor.ref("");
    const merchantId = common_vendor.ref("");
    const planId = common_vendor.ref("");
    const merchantName = common_vendor.ref("");
    const registrationNumber = common_vendor.ref("");
    const userStore = stores_user.useUserStore();
    const records = common_vendor.ref([]);
    const submitData = common_vendor.ref([]);
    common_vendor.onLoad(async (options) => {
      var _a;
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
      registrationNumber.value = (_a = userStore.sfmerchant) == null ? void 0 : _a.registrationNumber;
      common_vendor.index.__f__("log", "at pages/collection/syReport.vue:143", "接收到的参数:", options);
    });
    const getSyCheckDetail = () => {
      if (!submitData.value || submitData.value.length === 0) {
        common_vendor.index.showToast({
          title: "没有收运数据，请先进行扫码上报操作",
          icon: "none"
        });
        return;
      }
      common_vendor.index.showModal({
        title: "确认收运完成",
        content: "是否确认收运完成？",
        success: async (res) => {
          if (res.confirm) {
            try {
              const confirmRes = await api_apis.apiPostreportWeight(submitData.value);
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
              common_vendor.index.__f__("error", "at pages/collection/syReport.vue:183", "确认收运异常:", error);
              common_vendor.index.showToast({
                title: "操作异常",
                icon: "none"
              });
            }
          }
        }
      });
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
        success: async (res) => {
          common_vendor.index.__f__("log", "at pages/collection/syReport.vue:240", "扫码结果", res);
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
          common_vendor.index.__f__("log", "at pages/collection/syReport.vue:256", "扫码结果:", scanResult);
          common_vendor.index.__f__("log", "at pages/collection/syReport.vue:257", "扫码中的商户ID:", scannedMerchantId);
          common_vendor.index.__f__("log", "at pages/collection/syReport.vue:258", "当前商户ID:", merchantId.value);
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
          try {
            const bucketRes = await api_apis.apiGetMerchantBucke({
              id: planId.value,
              // 收运单ID
              merchantId: merchantId.value,
              // 商户ID
              driverId: driverId.value,
              // 司机ID
              registrationNumber: registrationNumber.value
              // 车牌号
            });
            if (bucketRes.code !== 200) {
              common_vendor.index.showToast({
                title: bucketRes.msg || "获取桶信息失败",
                icon: "none"
              });
              return;
            }
            common_vendor.index.__f__("log", "at pages/collection/syReport.vue:295", "获取到的桶信息:", bucketRes.data);
            const weightRes = await api_apis.apiGetBackfillBuckeWeight({
              id: planId.value,
              // 收运单ID
              merchantId: merchantId.value,
              // 商户ID
              driverId: driverId.value,
              // 司机ID
              registrationNumber: registrationNumber.value
              // 车牌号
            });
            if (weightRes.code !== 200) {
            } else {
            }
            addRecordsFromBucketData(bucketRes.data, weightRes.data);
            showRefreshButton.value = true;
            if (weightRes.code === 200 && weightRes.data && (Array.isArray(weightRes.data) ? weightRes.data.length > 0 : true)) {
              common_vendor.index.showToast({
                title: "获取数据成功",
                icon: "none",
                duration: 2e3
              });
            } else {
              common_vendor.index.showToast({
                title: "未获取到数据，请稍后点击右下刷新按钮",
                icon: "none",
                duration: 2e3
              });
            }
          } catch (error) {
            common_vendor.index.showToast({
              title: "获取桶信息异常",
              icon: "none"
            });
          }
        },
        fail: (err) => {
          common_vendor.index.__f__("log", "at pages/collection/syReport.vue:341", "扫码失败", err);
          common_vendor.index.showToast({
            title: "扫码失败,请重试!",
            icon: "none"
          });
        }
      });
    };
    const addRecordsFromBucketData = (bucketData, weightData) => {
      submitData.value = [];
      if (Array.isArray(weightData)) {
        weightData.forEach((weightItem, index) => {
          let bucketInfo = null;
          if (Array.isArray(bucketData) && bucketData.length > index) {
            bucketInfo = bucketData[index];
          }
          records.value.push({
            binCount: 1,
            // 默认垃圾桶数量为1
            weight: weightItem.weight || "",
            // 使用回填的重量数据
            images: [],
            isConfirmed: false,
            // 新添加的记录标记为未确认
            bucketCode: bucketInfo ? bucketInfo.bucketCode : "",
            // 桶编码，有就给，没有就空着
            bucketType: bucketInfo ? bucketInfo.bucketType : "",
            // 桶类型
            bucketName: bucketInfo ? bucketInfo.bucketName : "",
            // 桶名称
            id: `temp_${Date.now()}_${index}`
            // 临时ID
          });
          submitData.value.push({
            thirdpartyId: weightItem.id,
            // 第三方垃圾桶称重记录id
            bucketCode: bucketInfo ? bucketInfo.bucketCode : "",
            // 桶编码
            weight: parseFloat(weightItem.weight || 0),
            // 垃圾重量改为小数类型
            carId: carId.value,
            // 车辆ID
            driverId: driverId.value,
            // 司机ID
            merchantId: merchantId.value,
            // 商户ID
            planId: planId.value
            // 收运单ID
          });
          ljNum.value++;
        });
      } else if (weightData && typeof weightData === "object") {
        let bucketInfo = null;
        if (Array.isArray(bucketData) && bucketData.length > 0) {
          bucketInfo = bucketData[0];
        }
        records.value.push({
          binCount: 1,
          // 默认垃圾桶数量为1
          weight: weightData.weight || "",
          // 使用回填的重量数据
          images: [],
          isConfirmed: false,
          // 新添加的记录标记为未确认
          bucketCode: bucketInfo ? bucketInfo.bucketCode : "",
          // 桶编码，有就给，没有就空着
          bucketType: bucketInfo ? bucketInfo.bucketType : "",
          // 桶类型
          bucketName: bucketInfo ? bucketInfo.bucketName : "",
          // 桶名称
          id: `temp_${Date.now()}_0`
          // 临时ID
        });
        submitData.value.push({
          thirdpartyId: weightData.id,
          // 第三方垃圾桶称重记录id
          bucketCode: bucketInfo ? bucketInfo.bucketCode : "",
          // 桶编码
          weight: parseFloat(weightData.weight || 0),
          // 垃圾重量改为小数类型
          carId: carId.value,
          // 车辆ID
          driverId: driverId.value,
          // 司机ID
          merchantId: merchantId.value,
          // 商户ID
          planId: planId.value
          // 收运单ID
        });
        ljNum.value++;
      } else {
        common_vendor.index.__f__("log", "at pages/collection/syReport.vue:423", "重量数据格式不正确");
      }
      common_vendor.index.__f__("log", "at pages/collection/syReport.vue:426", "提交数据:", submitData.value);
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(back),
        b: common_vendor.p({
          title: "收运上报"
        }),
        c: common_vendor.t(merchantName.value),
        d: common_vendor.t(ljNum.value ?? 0),
        e: common_vendor.o(handleScan),
        f: common_vendor.p({
          type: "scan",
          size: "30",
          color: "#07C160"
        }),
        g: records.value.length === 0
      }, records.value.length === 0 ? {} : {}, {
        h: common_vendor.f(records.value, (item, index, i0) => {
          return {
            a: common_vendor.t(index + 1),
            b: common_vendor.t(item.weight),
            c: index
          };
        }),
        i: showRefreshButton.value
      }, showRefreshButton.value ? {
        j: common_vendor.p({
          type: "reload",
          size: "40",
          color: "#07C160"
        }),
        k: common_vendor.o(handleRefresh)
      } : {}, {
        l: common_vendor.o(getSyCheckDetail)
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-e09b3d48"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/collection/syReport.js.map
