"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const stores_user = require("../../stores/user.js");
const api_apis = require("../../api/apis.js");
const utils_orderUtils = require("../../utils/orderUtils.js");
if (!Array) {
  const _easycom_uni_nav_bar2 = common_vendor.resolveComponent("uni-nav-bar");
  const _component_uni_text = common_vendor.resolveComponent("uni-text");
  const _component_uni_button = common_vendor.resolveComponent("uni-button");
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  (_easycom_uni_nav_bar2 + _component_uni_text + _component_uni_button + _easycom_uni_icons2)();
}
const _easycom_uni_nav_bar = () => "../../uni_modules/uni-nav-bar/components/uni-nav-bar/uni-nav-bar.js";
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  (_easycom_uni_nav_bar + _easycom_uni_icons + DriverStatusTag + InfoDisplay + DriverOrderActions + AbnormalReportModal)();
}
const DriverStatusTag = () => "../../components/DriverStatusTag/DriverStatusTag.js";
const DriverOrderActions = () => "../../components/DriverOrderActions/DriverOrderActions.js";
const InfoDisplay = () => "../../components/InfoDisplay/InfoDisplay.js";
const AbnormalReportModal = () => "../../components/AbnormalReportModal/AbnormalReportModal.js";
const _sfc_main = {
  __name: "sfDetails",
  setup(__props) {
    const getCurrentDate = () => {
      const date = /* @__PURE__ */ new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };
    const userStore = stores_user.useUserStore();
    const weightNum = common_vendor.ref(0);
    const notConfirmNum = common_vendor.ref(0);
    const confirmNum = common_vendor.ref(0);
    const bucketNum = common_vendor.ref(0);
    const registrationNumber = common_vendor.ref("");
    const name = common_vendor.ref("");
    const currentDate = getCurrentDate();
    const weightInput = common_vendor.ref("");
    const allCarId = common_vendor.ref(0);
    const allRecordNo = common_vendor.ref("");
    const navBarBgColor = common_vendor.ref("transparent");
    const taskList = common_vendor.ref([]);
    const abnormalList = common_vendor.ref([]);
    const currentLocation = common_vendor.ref({
      longitude: 104.066,
      // 默认经度
      latitude: 30.5728
      // 默认纬度
    });
    const markers = common_vendor.ref([]);
    const ICON_SIZE = {
      first: 25,
      // 第一个图标大小
      normal: 20
      // 普通图标大小
    };
    const getLinePositions = (index) => {
      const iconSize = index === 0 ? ICON_SIZE.first : ICON_SIZE.normal;
      const containerHeight = 50;
      const containerCenter = containerHeight / 2;
      const iconRadius = iconSize / 2;
      const taskItemPadding = 30;
      const timeInfoHeight = 50;
      const timeInfoTop = (timeInfoHeight - containerHeight) / 2;
      const topToIconTop = taskItemPadding + timeInfoTop + containerCenter - iconRadius;
      return {
        topHeight: topToIconTop,
        // 上半段高度：从task-item顶部到图标顶部
        bottomTop: topToIconTop + iconSize
        // 下半段起始位置：从task-item顶部到图标底部
      };
    };
    const getCurrentLocation = () => {
      common_vendor.index.getLocation({
        type: "gcj02",
        success: (res) => {
          currentLocation.value = {
            longitude: res.longitude,
            latitude: res.latitude
          };
          markers.value = [{
            id: 1,
            longitude: res.longitude,
            latitude: res.latitude,
            title: "当前位置",
            iconPath: "/static/ssd/positioning.png",
            width: 30,
            height: 30
          }];
          common_vendor.index.__f__("log", "at pages/collection/sfDetails.vue:240", "获取定位成功:", res);
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/collection/sfDetails.vue:243", "获取定位失败:", err);
          common_vendor.index.showToast({
            title: "获取定位失败",
            icon: "none"
          });
        }
      });
    };
    const progressPercentage = common_vendor.computed(() => {
      if (confirmNum.value === 0 && weightNum.value === 0)
        return 0;
      return Math.round(confirmNum.value / (confirmNum.value + notConfirmNum.value) * 100);
    });
    const loadAllData = async () => {
      getCurrentLocation();
      try {
        await Promise.all([
          getapiGetDriverInfo(),
          getapiGetDriverTodayPlan(),
          getapiGetAbnormalPlan()
        ]);
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/collection/sfDetails.vue:271", "加载数据失败:", error);
      }
    };
    common_vendor.onMounted(async () => {
    });
    const getInfoFields = (task) => {
      const status = task.status;
      if (status === 0 || status === "0" || status === 2 || status === "2") {
        return [
          {
            key: "merchantName",
            label: "商户名称",
            value: task.merchantName
          },
          {
            key: "estimateWeight",
            label: "预估重量",
            value: utils_orderUtils.formatWeight(task.estimateWeight)
          },
          {
            key: "estimateBucketNum",
            label: "预估桶数",
            value: utils_orderUtils.formatNum(task.estimateBucketNum)
          },
          {
            key: "address",
            label: "地址",
            value: task.address,
            taskData: task
            // 传递完整的任务数据，包含经纬度信息
          }
        ];
      }
      if (status === 1 || status === "1") {
        return [
          {
            key: "merchantName",
            label: "商户名称",
            value: task.merchantName
          },
          {
            key: "weight",
            label: "收运重量",
            value: utils_orderUtils.formatWeight(task.weight)
          },
          {
            key: "bucketNum",
            label: "收运桶数",
            value: utils_orderUtils.formatNum(task.bucketNum)
          },
          {
            key: "address",
            label: "地址",
            value: task.address,
            taskData: task
            // 传递完整的任务数据，包含经纬度信息
          }
        ];
      }
      return [
        {
          key: "merchantName",
          label: "商户名称",
          value: task.merchantName
        },
        {
          key: "estimateWeight",
          label: "预估重量",
          value: utils_orderUtils.formatWeight(task.estimateWeight)
        },
        {
          key: "estimateBucketNum",
          label: "预估桶数",
          value: utils_orderUtils.formatNum(task.estimateBucketNum)
        },
        {
          key: "address",
          label: "地址",
          value: task.address
        }
      ];
    };
    common_vendor.onShow(async () => {
      common_vendor.index.__f__("log", "at pages/collection/sfDetails.vue:377", "页面显示时刷新数据");
      await loadAllData();
      getCurrentLocation();
    });
    const handleRefresh = async () => {
      try {
        await loadAllData();
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/collection/sfDetails.vue:388", "刷新数据失败:", error);
      }
    };
    const showAbnormalModal = common_vendor.ref(false);
    const currentOrderData = common_vendor.ref(null);
    const handleAbnormalReport = (orderData) => {
      common_vendor.index.__f__("log", "at pages/collection/sfDetails.vue:398", "异常上报事件", orderData);
      currentOrderData.value = orderData;
      showAbnormalModal.value = true;
    };
    const closeAbnormalModal = () => {
      showAbnormalModal.value = false;
      currentOrderData.value = null;
    };
    const handleAbnormalSuccess = async () => {
      await handleRefresh();
    };
    common_vendor.onPageScroll((e) => {
      const scrollTop = e.scrollTop;
      if (scrollTop > 20) {
        navBarBgColor.value = "#fff";
      } else {
        navBarBgColor.value = "transparent";
      }
    });
    const getapiGetDriverInfo = async () => {
      var _a;
      try {
        const res = await api_apis.apiGetDriverInfo({
          driverId: (_a = userStore.sfmerchant) == null ? void 0 : _a.id
        });
        if (res.code === 200) {
          if (res.data === null)
            return;
          confirmNum.value = res.data.confirmNum ?? 0;
          notConfirmNum.value = res.data.notConfirmNum ?? 0;
          weightNum.value = res.data.weightNum ?? 0;
          bucketNum.value = res.data.bucketNum ?? 0;
          registrationNumber.value = res.data.registrationNumber;
          name.value = res.data.name;
          allCarId.value = res.data.carId;
          allRecordNo.value = res.data.crecordNo;
        } else {
          common_vendor.index.__f__("error", "at pages/collection/sfDetails.vue:449", "获取司机信息失败:", res.message || "未知错误");
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/collection/sfDetails.vue:452", "获取司机信息异常:", error);
      }
    };
    const getapiGetDriverTodayPlan = async () => {
      var _a;
      try {
        const res = await api_apis.apiGetDriverTodayPlan({
          driverId: (_a = userStore.sfmerchant) == null ? void 0 : _a.id,
          page: 1
        });
        if (res.code === 200) {
          taskList.value = res.data;
        } else {
          common_vendor.index.__f__("error", "at pages/collection/sfDetails.vue:467", "获取今日收运计划失败:", res.message || "未知错误");
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/collection/sfDetails.vue:470", "获取今日收运计划异常:", error);
      }
    };
    const getapiGetAbnormalPlan = async () => {
      var _a;
      try {
        const res = await api_apis.apiGetAbnormalPlan({
          driverId: (_a = userStore.sfmerchant) == null ? void 0 : _a.id
        });
        if (res.code === 200) {
          abnormalList.value = res.data || [];
        } else {
          common_vendor.index.__f__("error", "at pages/collection/sfDetails.vue:483", "获取异常计划失败:", res.message || "未知错误");
          abnormalList.value = [];
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/collection/sfDetails.vue:487", "获取异常计划异常:", error);
        abnormalList.value = [];
      }
    };
    const contactLine = () => {
      common_vendor.index.__f__("log", "at pages/collection/sfDetails.vue:500", "查看线路");
      const mapData = {
        taskList: taskList.value,
        driverName: name.value,
        registrationNumber: registrationNumber.value,
        bucketNum: bucketNum.value,
        currentDate
      };
      common_vendor.index.setStorageSync("mapData", mapData);
      common_vendor.index.__f__("log", "at pages/collection/sfDetails.vue:512", "数据已存储，跳转页面");
      common_vendor.index.navigateTo({
        url: "/pages/collection/syAllMap"
      });
    };
    const handleSubmitWeight = async () => {
      common_vendor.index.showModal({
        title: "注意!",
        content: "需要车辆过磅后才能获取重量!",
        showCancel: true,
        cancelText: "取消",
        confirmText: "确定",
        success: async (res) => {
          var _a;
          if (res.confirm) {
            try {
              const result = await api_apis.apiGetCarWeight({
                driverId: (_a = userStore.sfmerchant) == null ? void 0 : _a.id
              });
              if (result.code === 200) {
                if (result.data && result.data.weight) {
                  weightInput.value = result.data.weight;
                  common_vendor.index.showToast({
                    title: "获取重量成功",
                    icon: "success"
                  });
                } else {
                  common_vendor.index.showToast({
                    title: "暂无过磅重量数据",
                    icon: "none"
                  });
                }
              } else {
                common_vendor.index.showToast({
                  title: result.message || "获取重量失败",
                  icon: "none"
                });
              }
            } catch (error) {
              common_vendor.index.showToast({
                title: "获取重量失败，请确保车辆已过磅",
                icon: "none"
              });
              common_vendor.index.__f__("error", "at pages/collection/sfDetails.vue:558", "获取重量失败:", error);
            }
          }
        }
      });
    };
    const back = () => {
      common_vendor.index.navigateBack();
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_assets._imports_0,
        b: common_vendor.o(back),
        c: common_vendor.p({
          dark: true,
          fixed: true,
          ["background-color"]: navBarBgColor.value,
          ["status-bar"]: true,
          ["left-icon"]: "left",
          color: "#000",
          title: "今日收运详情"
        }),
        d: common_vendor.t(name.value),
        e: common_vendor.t(registrationNumber.value),
        f: common_vendor.t(common_vendor.unref(currentDate)),
        g: common_vendor.t(bucketNum.value),
        h: common_assets._imports_1$3,
        i: common_vendor.t(progressPercentage.value),
        j: progressPercentage.value + "%",
        k: common_vendor.t(weightNum.value),
        l: common_vendor.t(confirmNum.value),
        m: common_vendor.t(notConfirmNum.value),
        n: common_assets._imports_2$2,
        o: weightInput.value,
        p: common_vendor.o(($event) => weightInput.value = $event.detail.value),
        q: common_vendor.o(($event) => handleSubmitWeight()),
        r: common_vendor.p({
          size: "mini",
          type: "primary"
        }),
        s: abnormalList.value.length > 0
      }, abnormalList.value.length > 0 ? {
        t: common_assets._imports_3,
        v: common_vendor.f(abnormalList.value, (item, index, i0) => {
          return {
            a: common_vendor.t(item.merchantName),
            b: common_vendor.t(item.notCollectNum),
            c: "b624ea25-20-" + i0,
            d: index
          };
        }),
        w: abnormalList.value.length > 1
      } : {}, {
        x: common_vendor.o(($event) => contactLine()),
        y: common_vendor.p({
          size: "mini",
          type: "primary"
        }),
        z: currentLocation.value.longitude,
        A: currentLocation.value.latitude,
        B: markers.value,
        C: common_vendor.f(taskList.value, (task, index, i0) => {
          return {
            a: "b624ea25-23-" + i0,
            b: common_vendor.p({
              type: "circle-filled",
              color: index === 0 ? "rgba(7, 193, 96, 1)" : "rgba(61, 61, 61, 0.50)",
              size: index === 0 ? ICON_SIZE.first : ICON_SIZE.normal
            }),
            c: common_vendor.t(task.appointmentTime),
            d: "b624ea25-24-" + i0,
            e: "b624ea25-25-" + i0,
            f: common_vendor.p({
              status: task.status
            }),
            g: "b624ea25-26-" + i0,
            h: common_vendor.p({
              fields: getInfoFields(task),
              ["show-bottom-border"]: false,
              showTopBorder: false,
              ["enable-address-navigation"]: true
            }),
            i: common_vendor.o(handleRefresh, task.id),
            j: common_vendor.o(handleAbnormalReport, task.id),
            k: "b624ea25-27-" + i0,
            l: common_vendor.p({
              status: task.status,
              ["order-data"]: task
            }),
            m: task.id,
            n: getLinePositions(index).topHeight + "rpx",
            o: getLinePositions(index).bottomTop + "rpx"
          };
        }),
        D: common_assets._imports_0,
        E: common_vendor.o(closeAbnormalModal),
        F: common_vendor.o(handleAbnormalSuccess),
        G: common_vendor.p({
          show: showAbnormalModal.value,
          ["order-data"]: currentOrderData.value
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-b624ea25"]]);
_sfc_main.__runtimeHooks = 1;
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/collection/sfDetails.js.map
