"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const stores_user = require("../../stores/user.js");
const api_apis = require("../../api/apis.js");
const utils_orderUtils = require("../../utils/orderUtils.js");
const utils_config = require("../../utils/config.js");
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
    const uploadHeaders = utils_config.createUploadHeaders();
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
    const navBarBgColor = common_vendor.ref("transparent");
    const taskList = common_vendor.ref([]);
    const originalTaskList = common_vendor.ref([]);
    const abnormalList = common_vendor.ref([]);
    const searchKeyword = common_vendor.ref("");
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
          common_vendor.index.__f__("log", "at pages/collection/sfDetails.vue:258", "获取定位成功:", res);
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/collection/sfDetails.vue:261", "获取定位失败:", err);
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
        common_vendor.index.__f__("error", "at pages/collection/sfDetails.vue:289", "加载数据失败:", error);
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
      common_vendor.index.__f__("log", "at pages/collection/sfDetails.vue:395", "页面显示时刷新数据");
      await loadAllData();
      getCurrentLocation();
    });
    const handleRefresh = async () => {
      try {
        await loadAllData();
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/collection/sfDetails.vue:406", "刷新数据失败:", error);
      }
    };
    const showAbnormalModal = common_vendor.ref(false);
    const currentOrderData = common_vendor.ref(null);
    const handleAbnormalReport = (orderData) => {
      common_vendor.index.__f__("log", "at pages/collection/sfDetails.vue:416", "异常上报事件", orderData);
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
    const handleNewReport = async () => {
      var _a;
      try {
        common_vendor.index.__f__("log", "at pages/collection/sfDetails.vue:437", "开始静默拍照...");
        const chooseMediaRes = await common_vendor.index.chooseMedia({
          count: 1,
          mediaType: ["image"],
          sourceType: ["camera"],
          camera: "back",
          // 使用后置摄像头
          sizeType: ["compressed"]
        });
        common_vendor.index.__f__("log", "at pages/collection/sfDetails.vue:446", "拍照结果:", chooseMediaRes);
        if (!chooseMediaRes.tempFiles || chooseMediaRes.tempFiles.length === 0) {
          common_vendor.index.__f__("log", "at pages/collection/sfDetails.vue:449", "拍照失败，没有获取到图片");
          return;
        }
        common_vendor.index.__f__("log", "at pages/collection/sfDetails.vue:453", "拍照成功，图片路径:", chooseMediaRes.tempFiles[0].tempFilePath);
        let longitude = "";
        let latitude = "";
        try {
          const locationRes = await common_vendor.index.getLocation({
            type: "gcj02"
          });
          longitude = locationRes.longitude;
          latitude = locationRes.latitude;
          common_vendor.index.__f__("log", "at pages/collection/sfDetails.vue:465", "当前经纬度 - 经度(lon):", longitude, "纬度(lat):", latitude);
        } catch (locationError) {
          common_vendor.index.__f__("error", "at pages/collection/sfDetails.vue:467", "获取地理位置失败:", locationError);
          return;
        }
        common_vendor.index.__f__("log", "at pages/collection/sfDetails.vue:472", "开始上传图片...");
        common_vendor.index.__f__("log", "at pages/collection/sfDetails.vue:473", "上传URL:", utils_config.uploadUrl);
        common_vendor.index.__f__("log", "at pages/collection/sfDetails.vue:474", "文件路径:", chooseMediaRes.tempFiles[0].tempFilePath);
        common_vendor.index.__f__("log", "at pages/collection/sfDetails.vue:475", "请求头:", uploadHeaders.value);
        const uploadRes = await common_vendor.index.uploadFile({
          url: utils_config.uploadUrl,
          filePath: chooseMediaRes.tempFiles[0].tempFilePath,
          name: "file",
          header: uploadHeaders.value
        });
        common_vendor.index.__f__("log", "at pages/collection/sfDetails.vue:484", "上传响应状态码:", uploadRes.statusCode);
        common_vendor.index.__f__("log", "at pages/collection/sfDetails.vue:485", "上传响应数据:", uploadRes.data);
        if (uploadRes.statusCode !== 200) {
          common_vendor.index.__f__("error", "at pages/collection/sfDetails.vue:488", "图片上传失败, statusCode:", uploadRes.statusCode);
          common_vendor.index.__f__("error", "at pages/collection/sfDetails.vue:489", "上传失败响应:", uploadRes);
          return;
        }
        common_vendor.index.__f__("log", "at pages/collection/sfDetails.vue:494", "开始解析上传返回数据...");
        const uploadData = JSON.parse(uploadRes.data);
        common_vendor.index.__f__("log", "at pages/collection/sfDetails.vue:496", "解析后的上传数据:", uploadData);
        if (uploadData.code !== 200) {
          common_vendor.index.__f__("error", "at pages/collection/sfDetails.vue:499", "图片上传失败:", uploadData.msg);
          return;
        }
        const imageUrl = uploadData.url;
        common_vendor.index.__f__("log", "at pages/collection/sfDetails.vue:504", "上传成功的图片URL:", imageUrl);
        const reportData = {
          derverid: (_a = userStore.currentDriver) == null ? void 0 : _a.id,
          // 司机id
          lon: longitude,
          lat: latitude,
          img: imageUrl
          // 图片URL
        };
        common_vendor.index.__f__("log", "at pages/collection/sfDetails.vue:514", "新增上报提交数据:", reportData);
        const submitRes = await api_apis.apiAddLonLatImg(reportData);
        if (submitRes.code === 200) {
          common_vendor.index.__f__("log", "at pages/collection/sfDetails.vue:519", "上报成功");
        } else {
          common_vendor.index.__f__("error", "at pages/collection/sfDetails.vue:521", "上报失败:", submitRes.msg);
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/collection/sfDetails.vue:525", "新增上报异常:", error);
      }
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
      var _a, _b;
      try {
        const res = await api_apis.apiGetDriverInfo({
          driverId: (_a = userStore.currentDriver) == null ? void 0 : _a.id,
          carId: (_b = userStore.currentDriver) == null ? void 0 : _b.carId
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
        } else {
          common_vendor.index.__f__("error", "at pages/collection/sfDetails.vue:562", "获取司机信息失败:", res.message || "未知错误");
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/collection/sfDetails.vue:565", "获取司机信息异常:", error);
      }
    };
    const getapiGetDriverTodayPlan = async () => {
      var _a, _b;
      try {
        const res = await api_apis.apiGetDriverTodayPlan({
          driverId: (_a = userStore.currentDriver) == null ? void 0 : _a.id,
          carId: (_b = userStore.currentDriver) == null ? void 0 : _b.carId,
          page: 1
        });
        if (res.code === 200) {
          originalTaskList.value = res.data || [];
          taskList.value = [...originalTaskList.value];
        } else {
          common_vendor.index.__f__("error", "at pages/collection/sfDetails.vue:582", "获取今日收运计划失败:", res.message || "未知错误");
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/collection/sfDetails.vue:585", "获取今日收运计划异常:", error);
      }
    };
    const getapiGetAbnormalPlan = async () => {
      var _a, _b;
      try {
        const res = await api_apis.apiGetAbnormalPlan({
          driverId: (_a = userStore.currentDriver) == null ? void 0 : _a.id,
          carId: (_b = userStore.currentDriver) == null ? void 0 : _b.id
        });
        if (res.code === 200) {
          abnormalList.value = res.data || [];
        } else {
          common_vendor.index.__f__("error", "at pages/collection/sfDetails.vue:599", "获取异常计划失败:", res.message || "未知错误");
          abnormalList.value = [];
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/collection/sfDetails.vue:603", "获取异常计划异常:", error);
        abnormalList.value = [];
      }
    };
    const contactLine = () => {
      common_vendor.index.__f__("log", "at pages/collection/sfDetails.vue:616", "查看线路");
      const mapData = {
        taskList: taskList.value,
        driverName: name.value,
        registrationNumber: registrationNumber.value,
        bucketNum: bucketNum.value,
        currentDate
      };
      common_vendor.index.setStorageSync("mapData", mapData);
      common_vendor.index.__f__("log", "at pages/collection/sfDetails.vue:628", "数据已存储，跳转页面");
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
                driverId: (_a = userStore.currentDriver) == null ? void 0 : _a.id
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
              common_vendor.index.__f__("error", "at pages/collection/sfDetails.vue:674", "获取重量失败:", error);
            }
          }
        }
      });
    };
    const back = () => {
      common_vendor.index.navigateBack();
    };
    const onSearch = () => {
      filterTaskList();
    };
    const onSearchInput = () => {
      filterTaskList();
    };
    const clearSearch = () => {
      searchKeyword.value = "";
      filterTaskList();
    };
    const filterTaskList = () => {
      if (!searchKeyword.value.trim()) {
        taskList.value = [...originalTaskList.value];
      } else {
        const keyword = searchKeyword.value.trim().toLowerCase();
        taskList.value = originalTaskList.value.filter(
          (task) => task.merchantName && task.merchantName.toLowerCase().includes(keyword)
        );
      }
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_assets._imports_0,
        b: common_vendor.o(back, "4e"),
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
        p: common_vendor.o(($event) => weightInput.value = $event.detail.value, "17"),
        q: common_vendor.o(($event) => handleSubmitWeight(), "35"),
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
        x: common_vendor.o(($event) => contactLine(), "42"),
        y: common_vendor.p({
          size: "mini",
          type: "primary"
        }),
        z: common_vendor.o(($event) => handleNewReport(), "7d"),
        A: common_vendor.p({
          size: "mini",
          type: "primary"
        }),
        B: common_vendor.o(onSearch, "b3"),
        C: common_vendor.p({
          type: "search",
          size: "24",
          color: "#999"
        }),
        D: common_vendor.o(onSearch, "91"),
        E: common_vendor.o([($event) => searchKeyword.value = $event.detail.value, onSearchInput], "58"),
        F: searchKeyword.value,
        G: searchKeyword.value
      }, searchKeyword.value ? {
        H: common_vendor.o(clearSearch, "ff"),
        I: common_vendor.p({
          type: "clear",
          size: "20",
          color: "#999"
        })
      } : {}, {
        J: common_vendor.f(taskList.value, (task, index, i0) => {
          return {
            a: "b624ea25-26-" + i0,
            b: common_vendor.p({
              type: "circle-filled",
              color: index === 0 ? "rgba(7, 193, 96, 1)" : "rgba(61, 61, 61, 0.50)",
              size: index === 0 ? ICON_SIZE.first : ICON_SIZE.normal
            }),
            c: common_vendor.t(task.appointmentTime),
            d: "b624ea25-27-" + i0,
            e: "b624ea25-28-" + i0,
            f: common_vendor.p({
              status: task.status
            }),
            g: "b624ea25-29-" + i0,
            h: common_vendor.p({
              fields: getInfoFields(task),
              ["show-bottom-border"]: false,
              showTopBorder: false,
              ["enable-address-navigation"]: true
            }),
            i: common_vendor.o(handleRefresh, task.id),
            j: common_vendor.o(handleAbnormalReport, task.id),
            k: "b624ea25-30-" + i0,
            l: common_vendor.p({
              status: task.status,
              ["order-data"]: task
            }),
            m: task.id,
            n: getLinePositions(index).topHeight + "rpx",
            o: getLinePositions(index).bottomTop + "rpx"
          };
        }),
        K: common_assets._imports_0,
        L: common_vendor.o(closeAbnormalModal, "0b"),
        M: common_vendor.o(handleAbnormalSuccess, "44"),
        N: common_vendor.p({
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
