"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const stores_user = require("../../stores/user.js");
const api_apis = require("../../api/apis.js");
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
  (_easycom_uni_nav_bar + _easycom_uni_icons)();
}
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
    const taskList = common_vendor.ref([]);
    const progressPercentage = common_vendor.computed(() => {
      if (confirmNum.value === 0 && weightNum.value === 0)
        return 0;
      return Math.round(confirmNum.value / (confirmNum.value + notConfirmNum.value) * 100);
    });
    const getStatusText = (status) => {
      switch (status) {
        case 0:
          return "进行中";
        case 1:
          return "已完成";
        case 2:
          return "无需收运";
        default:
          return "未知状态";
      }
    };
    common_vendor.onMounted(async () => {
      try {
        getapiGetDriverInfo();
        getapiGetDriverTodayPlan();
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/collection/sfDetails.vue:194", "页面初始化失败:", error);
      }
    });
    common_vendor.onShow(async () => {
      common_vendor.index.__f__("log", "at pages/collection/sfDetails.vue:201", "页面显示时刷新数据");
      getapiGetDriverInfo();
      getapiGetDriverTodayPlan();
    });
    const getapiGetDriverInfo = async () => {
      var _a;
      try {
        const res = await api_apis.apiGetDriverInfo({
          driverId: ((_a = userStore.sfmerchant) == null ? void 0 : _a.id) || 5
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
          common_vendor.index.__f__("error", "at pages/collection/sfDetails.vue:228", "获取司机信息失败:", res.message || "未知错误");
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/collection/sfDetails.vue:231", "获取司机信息异常:", error);
      }
    };
    const getapiGetDriverTodayPlan = async () => {
      var _a;
      try {
        const res = await api_apis.apiGetDriverTodayPlan({
          driverId: ((_a = userStore.sfmerchant) == null ? void 0 : _a.id) || 5,
          page: 1
        });
        if (res.code === 200) {
          taskList.value = res.data;
        } else {
          common_vendor.index.__f__("error", "at pages/collection/sfDetails.vue:246", "获取今日收运计划失败:", res.message || "未知错误");
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/collection/sfDetails.vue:249", "获取今日收运计划异常:", error);
      }
    };
    const cancelTask = (task) => {
      common_vendor.index.__f__("log", "at pages/collection/sfDetails.vue:257", "取消任务:", task.id);
      common_vendor.index.showModal({
        title: "确认取消",
        content: "是否确认取消当前任务？",
        success: async (res) => {
          var _a;
          if (res.confirm) {
            await api_apis.apiGetnoNeedCollect({
              id: task.id,
              driverId: ((_a = userStore.sfmerchant) == null ? void 0 : _a.id) || 5
            }).then((res2) => {
              if (res2.code === 200) {
                common_vendor.index.showToast({
                  title: res2.message || "操作成功",
                  icon: "success"
                });
                getapiGetDriverTodayPlan();
              } else {
                common_vendor.index.showToast({
                  title: res2.message || "操作失败",
                  icon: "error"
                });
              }
            });
          }
        }
      });
    };
    const viewTask = (task) => {
      common_vendor.index.navigateTo({
        url: `/pages/collection/syCheckDetail?planId=${task.id}&driverId=${task.driverId}`
      });
    };
    const reportTask = (task) => {
      common_vendor.index.__f__("log", "at pages/collection/sfDetails.vue:298", "收运上报:", task);
      common_vendor.index.navigateTo({
        url: `/pages/collection/syReport?carId=${task.carId}&driverId=${task.driverId}&merchantId=${task.merchantId}&planId=${task.id}`
      });
    };
    const contactLine = () => {
      common_vendor.index.__f__("log", "at pages/collection/sfDetails.vue:308", "查看线路");
      const mapData = {
        taskList: taskList.value,
        driverName: name.value,
        registrationNumber: registrationNumber.value,
        bucketNum: bucketNum.value,
        currentDate
      };
      common_vendor.index.setStorageSync("mapData", mapData);
      common_vendor.index.__f__("log", "at pages/collection/sfDetails.vue:320", "数据已存储，跳转页面");
      common_vendor.index.navigateTo({
        url: "/pages/collection/syAllMap"
      });
    };
    const collectTask = (task) => {
      common_vendor.index.__f__("log", "at pages/collection/sfDetails.vue:329", "收运:", task.id);
      if (task.weight > 0 && task.bucketNum > 0) {
        common_vendor.index.showModal({
          title: "确认收运完成",
          content: "是否确认收运完成？",
          success: async (res) => {
            var _a;
            if (res.confirm) {
              await api_apis.apiGetdriverConfirmPlan({
                id: task.id,
                driverId: ((_a = userStore.sfmerchant) == null ? void 0 : _a.id) || 5
              }).then((res2) => {
                if (res2.code === 200) {
                  common_vendor.index.showToast({
                    title: res2.message || "操作成功",
                    icon: "success"
                  });
                  getapiGetDriverTodayPlan();
                } else {
                  common_vendor.index.showToast({
                    title: res2.message || "操作失败",
                    icon: "error"
                  });
                }
              });
            }
          }
        });
      } else {
        common_vendor.index.showToast({
          title: "请先进行 收运上报 操作",
          icon: "none"
        });
        return;
      }
    };
    const handleSubmitWeight = async () => {
      if (!weightInput.value) {
        common_vendor.index.showToast({
          title: "请输入重量",
          icon: "none"
        });
        return;
      }
      const weight = parseFloat(weightInput.value);
      if (isNaN(weight) || weight < 0) {
        common_vendor.index.showToast({
          title: "请输入有效的重量(大于等于0)",
          icon: "none"
        });
        return;
      }
      common_vendor.index.showModal({
        title: "确认提交",
        content: `是否确认提交过磅重量 ${weight}kg？`,
        success: async (res) => {
          var _a;
          if (res.confirm) {
            try {
              const result = await api_apis.apiAddCarWeight({
                carId: allCarId.value,
                recordNo: allRecordNo.value,
                weight,
                registrationNumber: registrationNumber.value,
                driverId: ((_a = userStore.sfmerchant) == null ? void 0 : _a.id) || 5
              });
              if (result.code === 200) {
                common_vendor.index.showToast({
                  title: "提交成功",
                  icon: "success"
                });
                weightInput.value = "";
                getapiGetDriverInfo();
              } else {
                common_vendor.index.showToast({
                  title: result.message || "提交失败",
                  icon: "none"
                });
              }
            } catch (error) {
              common_vendor.index.showToast({
                title: "提交失败",
                icon: "none"
              });
              common_vendor.index.__f__("error", "at pages/collection/sfDetails.vue:423", "提交重量失败:", error);
            }
          }
        }
      });
    };
    const back = () => {
      common_vendor.index.navigateBack();
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
          title: "收运详情"
        }),
        c: common_vendor.t(name.value),
        d: common_vendor.o(($event) => contactLine()),
        e: common_vendor.p({
          size: "mini",
          type: "primary"
        }),
        f: common_vendor.t(registrationNumber.value),
        g: common_vendor.t(common_vendor.unref(currentDate)),
        h: common_vendor.t(bucketNum.value),
        i: common_vendor.t(progressPercentage.value),
        j: `conic-gradient(#07C160 ${progressPercentage.value}%, rgba(216, 216, 216, 0.5) ${progressPercentage.value}% 100%)`,
        k: common_assets._imports_0,
        l: common_vendor.t(confirmNum.value ?? 0),
        m: common_assets._imports_1$2,
        n: common_vendor.t(notConfirmNum.value),
        o: common_assets._imports_2$1,
        p: common_vendor.t(weightNum.value),
        q: common_assets._imports_3,
        r: weightInput.value,
        s: common_vendor.o(($event) => weightInput.value = $event.detail.value),
        t: common_vendor.o(($event) => handleSubmitWeight()),
        v: common_vendor.p({
          size: "mini",
          type: "primary"
        }),
        w: common_vendor.f(taskList.value, (task, index, i0) => {
          return common_vendor.e({
            a: "b624ea25-22-" + i0,
            b: common_vendor.p({
              type: "circle-filled",
              color: index === 0 ? "rgba(7, 193, 96, 1)" : "rgba(61, 61, 61, 0.50)",
              size: "20"
            }),
            c: common_vendor.t(task.appointmentTime),
            d: "b624ea25-23-" + i0,
            e: common_vendor.t(getStatusText(task.status)),
            f: task.status === 0 ? 1 : "",
            g: task.status === 1 ? 1 : "",
            h: task.status === 2 ? 1 : "",
            i: "b624ea25-24-" + i0,
            j: "b624ea25-25-" + i0,
            k: common_vendor.t(task.merchantName),
            l: "b624ea25-26-" + i0,
            m: "b624ea25-27-" + i0,
            n: common_vendor.t(task.estimateWeight),
            o: "b624ea25-28-" + i0,
            p: "b624ea25-29-" + i0,
            q: common_vendor.t(task.estimateBucketNum || 0),
            r: "b624ea25-30-" + i0,
            s: "b624ea25-31-" + i0,
            t: common_vendor.t(task.address),
            v: "b624ea25-32-" + i0,
            w: "b624ea25-33-" + i0,
            x: task.status === 0
          }, task.status === 0 ? {
            y: common_vendor.o(($event) => cancelTask(task), task.id),
            z: "b624ea25-34-" + i0,
            A: common_vendor.p({
              size: "mini"
            }),
            B: common_vendor.o(($event) => viewTask(task), task.id),
            C: "b624ea25-35-" + i0,
            D: common_vendor.p({
              size: "mini",
              type: "primary"
            }),
            E: common_vendor.o(($event) => reportTask(task), task.id),
            F: "b624ea25-36-" + i0,
            G: common_vendor.p({
              size: "mini",
              type: "primary"
            }),
            H: common_vendor.o(($event) => collectTask(task), task.id),
            I: "b624ea25-37-" + i0,
            J: common_vendor.p({
              size: "mini",
              type: "primary"
            })
          } : task.status === 1 ? {
            L: common_vendor.o(($event) => viewTask(task), task.id),
            M: "b624ea25-38-" + i0,
            N: common_vendor.p({
              size: "mini",
              type: "primary"
            })
          } : task.status === 2 ? {
            P: common_vendor.o(($event) => viewTask(task), task.id),
            Q: "b624ea25-39-" + i0,
            R: common_vendor.p({
              size: "mini",
              type: "primary"
            })
          } : {}, {
            K: task.status === 1,
            O: task.status === 2,
            S: task.id
          });
        }),
        x: common_vendor.p({
          type: "location",
          size: "16",
          color: "#00B578"
        }),
        y: common_assets._imports_4
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-b624ea25"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/collection/sfDetails.js.map
