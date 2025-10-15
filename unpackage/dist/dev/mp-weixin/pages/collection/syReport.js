"use strict";
const common_vendor = require("../../common/vendor.js");
const api_apis = require("../../api/apis.js");
const stores_user = require("../../stores/user.js");
if (!Math) {
  PageHeader();
}
const PageHeader = () => "../../components/PageHeader/PageHeader.js";
const maxAutoRefreshTime = 9e5;
const refreshInterval = 5e3;
const _sfc_main = {
  __name: "syReport",
  setup(__props) {
    const back = () => {
      common_vendor.index.$emit("refreshSfDetails");
      common_vendor.index.navigateBack();
    };
    const startAutoRefresh = () => {
      if (isAutoRefreshing.value)
        return;
      isAutoRefreshing.value = true;
      autoRefreshCount.value = 0;
      isAutoRefreshTimeout.value = false;
      autoRefreshTimeout.value = setTimeout(() => {
        if (isAutoRefreshing.value && records.value.length === 0) {
          isAutoRefreshTimeout.value = true;
          stopAutoRefresh();
        }
      }, maxAutoRefreshTime);
      autoRefreshTimer.value = setInterval(async () => {
        autoRefreshCount.value++;
        await handleRefresh();
      }, refreshInterval);
    };
    const stopAutoRefresh = () => {
      isAutoRefreshing.value = false;
      if (autoRefreshTimer.value) {
        clearInterval(autoRefreshTimer.value);
        autoRefreshTimer.value = null;
      }
      if (autoRefreshTimeout.value) {
        clearTimeout(autoRefreshTimeout.value);
        autoRefreshTimeout.value = null;
      }
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
          common_vendor.index.__f__("log", "at pages/collection/syReport.vue:125", "刷新获取的重量信息:", weightRes.data);
          const existingThirdpartyIds = new Set(
            submitData.value.map((item) => item.thirdpartyId)
          );
          if (weightRes.data && (Array.isArray(weightRes.data) ? weightRes.data.length > 0 : true)) {
            const newWeightData = Array.isArray(weightRes.data) ? weightRes.data : [weightRes.data];
            const newData = newWeightData.filter(
              (weightItem) => !existingThirdpartyIds.has(weightItem.id)
            );
            if (newData.length > 0) {
              addNewRecordsFromWeightData(newData);
            }
          }
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/collection/syReport.vue:148", "刷新重量数据异常:", error);
      }
    };
    const ljNum = common_vendor.ref(0);
    const isAutoRefreshing = common_vendor.ref(false);
    const autoRefreshTimer = common_vendor.ref(null);
    const autoRefreshCount = common_vendor.ref(0);
    const autoRefreshTimeout = common_vendor.ref(null);
    const isAutoRefreshTimeout = common_vendor.ref(false);
    const carId = common_vendor.ref("");
    const driverId = common_vendor.ref("");
    const merchantId = common_vendor.ref("");
    const planId = common_vendor.ref("");
    const merchantName = common_vendor.ref("");
    const registrationNumber = common_vendor.ref("");
    const userStore = stores_user.useUserStore();
    const records = common_vendor.ref([]);
    const submitData = common_vendor.ref([]);
    const isSubmitting = common_vendor.ref(false);
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
      common_vendor.index.__f__("log", "at pages/collection/syReport.vue:189", "接收到的参数:", options);
      startAutoRefresh();
    });
    common_vendor.onUnload(() => {
      stopAutoRefresh();
    });
    const getSyCheckDetail = () => {
      if (isSubmitting.value) {
        return;
      }
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
            isSubmitting.value = true;
            stopAutoRefresh();
            try {
              const confirmRes = await api_apis.apiPostreportWeight(submitData.value);
              if (confirmRes.code === 200) {
                common_vendor.index.showToast({
                  title: confirmRes.msg || "操作成功",
                  icon: "success"
                });
                setTimeout(() => {
                  back();
                }, 500);
              } else {
                common_vendor.index.showToast({
                  title: confirmRes.msg || "操作失败",
                  icon: "error"
                });
                isSubmitting.value = false;
              }
            } catch (error) {
              common_vendor.index.__f__("error", "at pages/collection/syReport.vue:251", "确认收运异常:", error);
              common_vendor.index.showToast({
                title: "操作异常",
                icon: "none"
              });
              isSubmitting.value = false;
            }
          }
        }
      });
    };
    const addNewRecordsFromWeightData = (newWeightData) => {
      newWeightData.forEach((weightItem, index) => {
        records.value.push({
          binCount: 1,
          // 默认垃圾桶数量为1
          weight: weightItem.weight || "",
          // 使用回填的重量数据
          images: [],
          isConfirmed: false,
          // 新添加的记录标记为未确认
          bucketCode: "",
          // 桶编码，自动刷新时可能没有桶信息
          bucketType: "",
          // 桶类型
          bucketName: "",
          // 桶名称
          id: `temp_${Date.now()}_${index}`
          // 临时ID
        });
        submitData.value.push({
          thirdpartyId: weightItem.id,
          // 第三方垃圾桶称重记录id
          bucketCode: "",
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
      common_vendor.index.__f__("log", "at pages/collection/syReport.vue:295", "新增记录数据:", newWeightData);
      common_vendor.index.__f__("log", "at pages/collection/syReport.vue:296", "当前提交数据:", submitData.value);
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(back),
        b: common_vendor.p({
          title: "收运上报"
        }),
        c: common_vendor.t(merchantName.value),
        d: common_vendor.t(ljNum.value ?? 0),
        e: isAutoRefreshing.value
      }, isAutoRefreshing.value ? common_vendor.e({
        f: records.value.length === 0
      }, records.value.length === 0 ? {} : {
        g: common_vendor.t(records.value.length)
      }) : {}, {
        h: isAutoRefreshTimeout.value
      }, isAutoRefreshTimeout.value ? {} : {}, {
        i: common_vendor.f(records.value, (item, index, i0) => {
          return {
            a: common_vendor.t(index + 1),
            b: common_vendor.t(item.weight),
            c: index
          };
        }),
        j: isSubmitting.value
      }, isSubmitting.value ? {} : {}, {
        k: isSubmitting.value ? 1 : "",
        l: isSubmitting.value,
        m: common_vendor.o(getSyCheckDetail)
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-e09b3d48"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/collection/syReport.js.map
