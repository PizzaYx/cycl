"use strict";
const common_vendor = require("../../common/vendor.js");
const stores_user = require("../../stores/user.js");
const utils_config = require("../../utils/config.js");
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
      common_vendor.index.__f__("log", "at pages/collection/syAllMap.vue:103", "开始定位...");
      isLocating.value = true;
      checkLocationPermission();
    };
    const checkLocationPermission = () => {
      common_vendor.index.getSetting({
        success: (res) => {
          common_vendor.index.__f__("log", "at pages/collection/syAllMap.vue:114", "获取权限设置:", res.authSetting);
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
          common_vendor.index.__f__("log", "at pages/collection/syAllMap.vue:161", "定位成功(GCJ02):", lat, lng);
          currentLocation.value = {
            latitude: lat,
            longitude: lng,
            accuracy: res.accuracy || 100
          };
          mapCenter.value.latitude = lat;
          mapCenter.value.longitude = lng;
          common_vendor.index.__f__("log", "at pages/collection/syAllMap.vue:174", "地图中心点已更新为:", lat, lng);
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
          common_vendor.index.__f__("error", "at pages/collection/syAllMap.vue:196", "定位失败:", error);
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
      common_vendor.index.__f__("log", "at pages/collection/syAllMap.vue:235", "使用默认位置（成都市中心）");
      const defaultLat = 30.6586;
      const defaultLng = 104.0647;
      currentLocation.value = {
        latitude: defaultLat,
        longitude: defaultLng,
        accuracy: 1e3
      };
      mapCenter.value.latitude = defaultLat;
      mapCenter.value.longitude = defaultLng;
      common_vendor.index.__f__("log", "at pages/collection/syAllMap.vue:248", "地图中心点已更新为默认位置:", defaultLat, defaultLng);
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
          latitude: currentLocation.value.latitude + (index + 1) * 0.01,
          // 基于当前位置的示例坐标偏移，+1确保不与起点重复
          longitude: currentLocation.value.longitude + (index + 1) * 0.01,
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
    const planRoute = async () => {
      if (mapMarkers.value.length < 1) {
        common_vendor.index.__f__("log", "at pages/collection/syAllMap.vue:326", "标记数量不足，无法进行路线规划");
        return;
      }
      try {
        const startPoint = mapMarkers.value.find((marker) => marker.id === 0);
        if (!startPoint) {
          common_vendor.index.__f__("error", "at pages/collection/syAllMap.vue:334", "找不到起点（当前位置）");
          return;
        }
        const taskPoints = mapMarkers.value.filter((marker) => marker.id !== 0);
        if (taskPoints.length === 0) {
          common_vendor.index.__f__("log", "at pages/collection/syAllMap.vue:342", "没有任务点，无法规划路线");
          return;
        }
        common_vendor.index.__f__("log", "at pages/collection/syAllMap.vue:346", "开始路线规划 - 任务点数量:", taskPoints.length);
        const startWgs84Coord = common_vendor.exported.transform([startPoint.longitude, startPoint.latitude], common_vendor.exported.GCJ02, common_vendor.exported.WGS84);
        let midWgs84Coords = [];
        let endWgs84Coord = null;
        if (taskPoints.length === 1) {
          endWgs84Coord = common_vendor.exported.transform([taskPoints[0].longitude, taskPoints[0].latitude], common_vendor.exported.GCJ02, common_vendor.exported.WGS84);
        } else {
          const endPoint = taskPoints[taskPoints.length - 1];
          const midPoints = taskPoints.slice(0, -1);
          endWgs84Coord = common_vendor.exported.transform([endPoint.longitude, endPoint.latitude], common_vendor.exported.GCJ02, common_vendor.exported.WGS84);
          midWgs84Coords = midPoints.map(
            (point) => common_vendor.exported.transform([point.longitude, point.latitude], common_vendor.exported.GCJ02, common_vendor.exported.WGS84)
          );
          common_vendor.index.__f__("log", "at pages/collection/syAllMap.vue:367", "途经点数量:", midPoints.length);
        }
        const routeInfo = taskPoints.length === 1 ? `规划直达路线：起点 → ${taskPoints[0].title}` : `规划多点路线：起点 → ${taskPoints.slice(0, -1).map((p) => p.title).join(" → ")} → ${taskPoints[taskPoints.length - 1].title}`;
        common_vendor.index.__f__("log", "at pages/collection/syAllMap.vue:375", routeInfo);
        common_vendor.index.showLoading({
          title: "正在规划路线..."
        });
        const routeData = await callTiandituRouteAPI(startWgs84Coord, endWgs84Coord, midWgs84Coords);
        if (routeData && typeof routeData === "string" && routeData.includes("<result")) {
          parseRouteXML(routeData);
        } else {
          common_vendor.index.__f__("log", "at pages/collection/syAllMap.vue:387", "天地图API返回数据格式异常");
        }
      } catch (error) {
        if (typeof error === "string" && error.includes("<result")) {
          parseRouteXML(error);
        } else {
          common_vendor.index.__f__("error", "at pages/collection/syAllMap.vue:394", "路线规划失败:", error.message || error);
          common_vendor.index.showToast({
            title: "路线规划失败",
            icon: "none"
          });
        }
      } finally {
        common_vendor.index.hideLoading();
      }
    };
    const { API_KEY: TIANDITU_API_KEY, TIMEOUT } = utils_config.TIANDITU_CONFIG;
    const coordinateValidator = {
      // 检查坐标是否在合理范围内
      isValidCoordinate: (lng, lat) => {
        return lng >= -180 && lng <= 180 && lat >= -90 && lat <= 90;
      }
    };
    const requestTiandituApi = (endpoint, params) => {
      return new Promise((resolve, reject) => {
        const baseUrl = `https://api.tianditu.gov.cn/${endpoint}`;
        const queryPairs = [];
        Object.keys(params).forEach((key) => {
          queryPairs.push(`${key}=${encodeURIComponent(params[key])}`);
        });
        queryPairs.push(`tk=${TIANDITU_API_KEY}`);
        const fullUrl = `${baseUrl}?${queryPairs.join("&")}`;
        common_vendor.index.request({
          url: fullUrl,
          method: "GET",
          timeout: TIMEOUT,
          success: (res) => {
            if (res.data && typeof res.data === "string" && res.data.includes("<result")) {
              resolve(res.data);
            } else if (res.statusCode === 200) {
              resolve(res.data);
            } else {
              reject(res);
            }
          },
          fail: (error) => {
            common_vendor.index.__f__("error", "at pages/collection/syAllMap.vue:446", "天地图API请求失败:", error);
            reject(error);
          }
        });
      });
    };
    const callTiandituRouteAPI = async (startWgs84Coord, endWgs84Coord, midWgs84Coords = []) => {
      const routeParams = {
        orig: `${startWgs84Coord[0]},${startWgs84Coord[1]}`,
        // 起点经纬度
        dest: `${endWgs84Coord[0]},${endWgs84Coord[1]}`,
        // 终点经纬度
        style: "0"
        // 0: 最快路线, 1: 最短路线, 2: 避开高速, 3: 步行
      };
      if (midWgs84Coords && midWgs84Coords.length > 0) {
        const midPointsStr = midWgs84Coords.map(
          (coord) => `${coord[0]},${coord[1]}`
        ).join(";");
        routeParams.mid = midPointsStr;
      }
      const params = {
        postStr: JSON.stringify(routeParams),
        type: "search"
      };
      const result = await requestTiandituApi("drive", params);
      return result;
    };
    const parseRouteXML = (xmlData) => {
      try {
        const distanceMatch = xmlData.match(/<distance>([^<]+)<\/distance>/);
        let distance = "未知";
        if (distanceMatch) {
          const distanceValue = parseFloat(distanceMatch[1]);
          distance = (distanceValue / 1e3).toFixed(1) + "km";
        }
        const durationMatch = xmlData.match(/<duration>([^<]+)<\/duration>/);
        let duration = "未知";
        if (durationMatch) {
          const durationValue = parseInt(durationMatch[1]);
          duration = Math.ceil(durationValue / 60) + "分钟";
        }
        const routeLatLonMatch = xmlData.match(/<routelatlon>([^<]+)<\/routelatlon>/);
        if (routeLatLonMatch) {
          const routeCoords = routeLatLonMatch[1];
          const coordinates = routeCoords.split(";").map((coord) => {
            const [lng, lat] = coord.split(",").map(Number);
            if (!coordinateValidator.isValidCoordinate(lng, lat)) {
              common_vendor.index.__f__("warn", "at pages/collection/syAllMap.vue:517", "无效坐标:", coord);
              return null;
            }
            const gcj02Coord = common_vendor.exported.transform([lng, lat], common_vendor.exported.WGS84, common_vendor.exported.GCJ02);
            const gcj02Lng = gcj02Coord[0];
            const gcj02Lat = gcj02Coord[1];
            return { latitude: gcj02Lat, longitude: gcj02Lng };
          }).filter((coord) => coord !== null);
          if (coordinates.length > 0) {
            drawRouteFromCoordinates(coordinates);
            const taskPoints = mapMarkers.value.filter((marker) => marker.id !== 0);
            const routeType = taskPoints.length === 1 ? "直达路线" : `途经${taskPoints.length - 1}个点的路线`;
            common_vendor.index.showToast({
              title: `${routeType}规划成功
距离:${distance} 时间:${duration}`,
              icon: "success",
              duration: 3e3
            });
          } else {
            throw new Error("坐标数组为空");
          }
        } else {
          throw new Error("未找到路线坐标信息");
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/collection/syAllMap.vue:552", "解析XML数据失败:", error);
      }
    };
    const drawRouteFromCoordinates = (coordinates) => {
      if (!coordinates || coordinates.length === 0) {
        common_vendor.index.__f__("log", "at pages/collection/syAllMap.vue:559", "坐标数组为空，无法绘制路线");
        return;
      }
      const validCoordinates = coordinates.filter((coord) => {
        const isValid = typeof coord.latitude === "number" && typeof coord.longitude === "number" && !isNaN(coord.latitude) && !isNaN(coord.longitude);
        if (!isValid) {
          common_vendor.index.__f__("warn", "at pages/collection/syAllMap.vue:571", "无效坐标:", coord);
        }
        return isValid;
      });
      if (validCoordinates.length === 0) {
        common_vendor.index.__f__("error", "at pages/collection/syAllMap.vue:578", "没有有效的坐标点");
        return;
      }
      const polyline = {
        points: validCoordinates,
        color: "#07c160",
        width: 4,
        arrowLine: true,
        borderColor: "#ffffff",
        borderWidth: 2
      };
      mapPolyline.value = [];
      common_vendor.nextTick$1(() => {
        mapPolyline.value = [polyline];
        common_vendor.index.__f__("log", "at pages/collection/syAllMap.vue:597", "路线已绘制，坐标点数:", validCoordinates.length);
      });
    };
    common_vendor.onLoad(() => {
      common_vendor.index.__f__("log", "at pages/collection/syAllMap.vue:604", "页面加载，接收参数");
      const mapData = common_vendor.index.getStorageSync("mapData");
      if (mapData) {
        common_vendor.index.__f__("log", "at pages/collection/syAllMap.vue:609", "获取地图数据:", mapData);
        setMapData(mapData);
        isDataReceived.value = true;
        common_vendor.index.removeStorageSync("mapData");
      } else {
        common_vendor.index.__f__("log", "at pages/collection/syAllMap.vue:615", "暂无数据，等待传递");
      }
    });
    common_vendor.onMounted(() => {
      const waitForDataAndInitMap = () => {
        if (isDataReceived.value) {
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
