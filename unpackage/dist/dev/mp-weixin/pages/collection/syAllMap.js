"use strict";
const common_vendor = require("../../common/vendor.js");
const stores_user = require("../../stores/user.js");
if (!Array) {
  const _easycom_uni_nav_bar2 = common_vendor.resolveComponent("uni-nav-bar");
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  (_easycom_uni_nav_bar2 + _easycom_uni_icons2)();
}
const _easycom_uni_nav_bar = () => "../../uni_modules/uni-nav-bar/components/uni-nav-bar/uni-nav-bar.js";
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  (_easycom_uni_nav_bar + _easycom_uni_icons)();
}
const _sfc_main = {
  __name: "syAllMap",
  setup(__props) {
    const userStore = stores_user.useUserStore();
    const mapScale = common_vendor.ref(14);
    const mapMarkers = common_vendor.ref([]);
    const mapPolyline = common_vendor.ref([]);
    const mapCenter = common_vendor.ref({
      latitude: 30.6586,
      // 成都市中心坐标
      longitude: 104.0647
    });
    const taskList = common_vendor.ref([]);
    const driverName = common_vendor.ref("");
    const registrationNumber = common_vendor.ref("");
    const bucketNum = common_vendor.ref(0);
    const currentDate = common_vendor.ref("");
    const isLocating = common_vendor.ref(false);
    const currentLocation = common_vendor.ref({
      latitude: 0,
      longitude: 0,
      accuracy: 0
    });
    const isDataReceived = common_vendor.ref(false);
    const totalEstimateWeight = common_vendor.computed(() => {
      return taskList.value.reduce((total, task) => {
        return total + (parseFloat(task.estimateWeight) || 0);
      }, 0).toFixed(1);
    });
    const useUniAppLocation = () => {
      common_vendor.index.__f__("log", "at pages/collection/syAllMap.vue:100", "开始定位...");
      isLocating.value = true;
      checkLocationPermission();
    };
    const checkLocationPermission = () => {
      common_vendor.index.getSetting({
        success: (res) => {
          common_vendor.index.__f__("log", "at pages/collection/syAllMap.vue:111", "获取权限设置:", res.authSetting);
          if (res.authSetting["scope.userLocation"] === false) {
            common_vendor.index.showModal({
              title: "定位权限",
              content: "需要获取您的地理位置，请前往设置页面开启定位权限",
              showCancel: true,
              confirmText: "去设置",
              success: (modalRes) => {
                if (modalRes.confirm) {
                  common_vendor.index.openSetting({
                    success: (settingRes) => {
                      if (settingRes.authSetting["scope.userLocation"]) {
                        startUniAppLocation();
                      } else {
                        isLocating.value = false;
                      }
                    }
                  });
                } else {
                  isLocating.value = false;
                }
              }
            });
          } else {
            startUniAppLocation();
          }
        },
        fail: () => {
          startUniAppLocation();
        }
      });
    };
    const startUniAppLocation = () => {
      common_vendor.index.getLocation({
        type: "gcj02",
        // 直接获取GCJ02坐标系的位置
        altitude: false,
        // 不需要高度信息
        success: (res) => {
          const lat = res.latitude;
          const lng = res.longitude;
          common_vendor.index.__f__("log", "at pages/collection/syAllMap.vue:158", "定位成功(GCJ02):", lat, lng);
          currentLocation.value = {
            latitude: lat,
            longitude: lng,
            accuracy: res.accuracy || 100
          };
          mapCenter.value.latitude = lat;
          mapCenter.value.longitude = lng;
          common_vendor.index.__f__("log", "at pages/collection/syAllMap.vue:171", "地图中心点已更新为:", lat, lng);
          setTimeout(() => {
            addCurrentLocationMarker(lat, lng);
            addTaskMarkers();
            planRoute();
            isLocating.value = false;
            common_vendor.index.showToast({
              title: "定位成功，路线规划完成",
              icon: "success"
            });
          }, 100);
        },
        fail: (error) => {
          common_vendor.index.__f__("error", "at pages/collection/syAllMap.vue:193", "定位失败:", error);
          isLocating.value = false;
          let errorMsg = "定位失败";
          if (error.errMsg) {
            if (error.errMsg.includes("auth deny")) {
              errorMsg = "定位权限被拒绝，请开启定位权限";
            } else if (error.errMsg.includes("location fail")) {
              errorMsg = "定位服务不可用，请检查手机定位设置";
            } else {
              errorMsg = "定位失败：" + error.errMsg;
            }
          }
          common_vendor.index.showModal({
            title: "定位失败",
            content: errorMsg,
            showCancel: true,
            confirmText: "重试",
            cancelText: "取消",
            success: (modalRes) => {
              if (modalRes.confirm) {
                setTimeout(() => {
                  useUniAppLocation();
                }, 1e3);
              } else {
                useDefaultLocation();
              }
            }
          });
        }
      });
    };
    const useDefaultLocation = () => {
      common_vendor.index.__f__("log", "at pages/collection/syAllMap.vue:232", "使用默认位置（成都市中心）");
      const defaultLat = 30.6586;
      const defaultLng = 104.0647;
      currentLocation.value = {
        latitude: defaultLat,
        longitude: defaultLng,
        accuracy: 1e3
      };
      mapCenter.value.latitude = defaultLat;
      mapCenter.value.longitude = defaultLng;
      common_vendor.index.__f__("log", "at pages/collection/syAllMap.vue:245", "地图中心点已更新为默认位置:", defaultLat, defaultLng);
      setTimeout(() => {
        addCurrentLocationMarker(defaultLat, defaultLng);
        addTaskMarkers();
        planRoute();
        common_vendor.index.showToast({
          title: "使用默认位置，路线规划完成",
          icon: "none"
        });
      }, 100);
    };
    const addCurrentLocationMarker = (lat, lng) => {
      const marker = {
        id: 0,
        // 使用数字ID
        latitude: lat,
        longitude: lng,
        title: "当前位置",
        iconPath: "/static/ssd/positioning.png",
        width: 30,
        height: 30,
        callout: {
          content: "当前位置",
          color: "#000000",
          fontSize: 12,
          borderRadius: 5,
          bgColor: "#ffffff",
          padding: 5,
          display: "ALWAYS"
        }
      };
      mapMarkers.value = [marker];
    };
    const addTaskMarkers = () => {
      taskList.value.forEach((task, index) => {
        const marker = {
          id: index + 1,
          // 使用数字ID，从1开始（0已被当前位置使用）
          latitude: currentLocation.value.latitude + index * 0.01,
          // 基于当前位置的示例坐标偏移
          longitude: currentLocation.value.longitude + index * 0.01,
          title: task.merchantName,
          iconPath: "/static/ssd/positioning.png",
          width: 25,
          height: 25,
          callout: {
            content: task.merchantName,
            color: "#000000",
            fontSize: 12,
            borderRadius: 5,
            bgColor: "#ffffff",
            padding: 5,
            display: "ALWAYS"
          }
        };
        mapMarkers.value.push(marker);
      });
    };
    const drawRoute = () => {
      if (mapMarkers.value.length < 2) {
        common_vendor.index.__f__("log", "at pages/collection/syAllMap.vue:320", "标记数量不足，无法绘制路线");
        return;
      }
      const points = mapMarkers.value.map((marker) => ({
        latitude: marker.latitude,
        longitude: marker.longitude
      }));
      const polyline = {
        points,
        color: "#07c160",
        width: 4,
        arrowLine: true
      };
      mapPolyline.value = [polyline];
      common_vendor.index.__f__("log", "at pages/collection/syAllMap.vue:339", "路线已绘制:", mapPolyline.value);
    };
    const planRoute = () => {
      common_vendor.index.__f__("log", "at pages/collection/syAllMap.vue:344", "开始路线规划...");
      if (mapMarkers.value.length < 2) {
        common_vendor.index.__f__("log", "at pages/collection/syAllMap.vue:347", "标记数量不足，无法绘制路线");
        return;
      }
      drawRoute();
      common_vendor.index.__f__("log", "at pages/collection/syAllMap.vue:353", "路线规划完成");
    };
    common_vendor.onLoad(() => {
      common_vendor.index.__f__("log", "at pages/collection/syAllMap.vue:358", "页面加载，接收参数");
      const mapData = common_vendor.index.getStorageSync("mapData");
      if (mapData) {
        common_vendor.index.__f__("log", "at pages/collection/syAllMap.vue:363", "获取地图数据:", mapData);
        setMapData(mapData);
        isDataReceived.value = true;
        common_vendor.index.removeStorageSync("mapData");
      } else {
        common_vendor.index.__f__("log", "at pages/collection/syAllMap.vue:369", "暂无数据，等待传递");
      }
    });
    common_vendor.onMounted(() => {
      common_vendor.index.__f__("log", "at pages/collection/syAllMap.vue:375", "DOM已挂载完成，等待数据后初始化地图");
      const waitForDataAndInitMap = () => {
        if (isDataReceived.value) {
          common_vendor.index.__f__("log", "at pages/collection/syAllMap.vue:380", "数据已接收，开始初始化地图");
          setTimeout(() => {
            useUniAppLocation();
          }, 500);
        } else {
          setTimeout(waitForDataAndInitMap, 100);
        }
      };
      waitForDataAndInitMap();
    });
    const setMapData = (data) => {
      taskList.value = data.taskList || [];
      driverName.value = data.driverName || "";
      registrationNumber.value = data.registrationNumber || "";
      bucketNum.value = data.bucketNum || 0;
      currentDate.value = data.currentDate || "";
      common_vendor.index.__f__("log", "at pages/collection/syAllMap.vue:403", "数据设置完成");
    };
    const back = () => {
      common_vendor.index.navigateBack();
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
          title: "收运地图详情"
        }),
        c: mapScale.value,
        d: mapMarkers.value,
        e: mapPolyline.value,
        f: mapCenter.value.latitude,
        g: mapCenter.value.longitude,
        h: isLocating.value
      }, isLocating.value ? {
        i: common_vendor.p({
          type: "spinner-cycle",
          size: "20",
          color: "#07C160"
        })
      } : {}, {
        j: common_vendor.t(common_vendor.unref(userStore).userSFAvatar),
        k: common_vendor.t(driverName.value),
        l: common_vendor.p({
          type: "location",
          size: "16",
          color: "#00B578"
        }),
        m: common_vendor.t(registrationNumber.value),
        n: common_vendor.t(totalEstimateWeight.value),
        o: common_vendor.t(bucketNum.value),
        p: common_vendor.t(currentDate.value)
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-9af8408b"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/collection/syAllMap.js.map
