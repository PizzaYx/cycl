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
    const taskList = common_vendor.ref([]);
    const progressPercentage = common_vendor.computed(() => {
      if (confirmNum.value === 0 && weightNum.value === 0)
        return 0;
      common_vendor.index.__f__("log", "at pages/collection/sfDetails.vue:158", "confirmNum:", confirmNum.value, "weightNum:", weightNum.value);
      return Math.round(confirmNum.value / weightNum.value * 100);
    });
    const getStatusText = (status) => {
      switch (status) {
        case 0:
          return "进行中";
        case 1:
          return "待完成";
        case 2:
          return "已完成";
        default:
          return "未知状态";
      }
    };
    common_vendor.onMounted(async () => {
      try {
        getapiGetDriverInfo();
        getapiGetDriverTodayPlan();
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/collection/sfDetails.vue:185", "页面初始化失败:", error);
      }
    });
    const getapiGetDriverInfo = async () => {
      var _a;
      const res = await api_apis.apiGetDriverInfo({
        driverId: (_a = userStore.sfmerchant) == null ? void 0 : _a.id
      });
      if (res.code === 200) {
        confirmNum.value = 20;
        notConfirmNum.value = res.data.notConfirmNum;
        weightNum.value = 100;
        bucketNum.value = res.data.bucketNum;
        registrationNumber.value = res.data.registrationNumber;
        name.value = res.data.name;
      }
    };
    const getapiGetDriverTodayPlan = async () => {
      const res = taskList.value = [
        {
          id: 1,
          appointmentTime: "2025-09-11 09:45:09",
          merchantName: "杨洵测试",
          estimateWeight: 4,
          estimateBucketNum: 2,
          address: "成都市锦江区春熙路123号",
          status: 0
          // 进行中
        },
        {
          id: 2,
          appointmentTime: "2025-09-11 10:30:00",
          merchantName: "蜀大侠火锅",
          estimateWeight: 6.5,
          estimateBucketNum: 3,
          address: "成都市锦江区IFS国际金融中心",
          status: 1
          // 待完成
        },
        {
          id: 3,
          appointmentTime: "2025-09-11 14:15:00",
          merchantName: "小龙坎老火锅",
          estimateWeight: 5.2,
          estimateBucketNum: 2,
          address: "成都市锦江区太古里",
          status: 2
          // 已完成
        }
      ];
      return res;
    };
    const cancelTask = (task) => {
      common_vendor.index.__f__("log", "at pages/collection/sfDetails.vue:255", "取消任务:", task.id);
    };
    const viewTask = (task) => {
      common_vendor.index.__f__("log", "at pages/collection/sfDetails.vue:261", "查看任务:", task.id);
    };
    const reportTask = (task) => {
      common_vendor.index.__f__("log", "at pages/collection/sfDetails.vue:267", "收运上报:", task.id);
      common_vendor.index.navigateTo({
        url: "/pages/collection/syReport"
      });
    };
    const collectTask = (task) => {
      common_vendor.index.__f__("log", "at pages/collection/sfDetails.vue:276", "收运:", task.id);
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
        d: common_vendor.p({
          size: "mini",
          type: "primary"
        }),
        e: common_vendor.t(registrationNumber.value),
        f: common_vendor.t(common_vendor.unref(currentDate)),
        g: common_vendor.t(bucketNum.value),
        h: common_vendor.t(progressPercentage.value),
        i: `conic-gradient(#07C160 ${progressPercentage.value}%, rgba(216, 216, 216, 0.5) ${progressPercentage.value}% 100%)`,
        j: common_assets._imports_0,
        k: common_vendor.t(confirmNum.value),
        l: common_assets._imports_1$2,
        m: common_vendor.t(notConfirmNum.value),
        n: common_assets._imports_2$1,
        o: common_vendor.t(weightNum.value),
        p: common_assets._imports_3,
        q: weightInput.value,
        r: common_vendor.o(($event) => weightInput.value = $event.detail.value),
        s: common_vendor.p({
          size: "mini",
          type: "primary"
        }),
        t: common_vendor.f(taskList.value, (task, k0, i0) => {
          return common_vendor.e({
            a: common_vendor.t(task.appointmentTime),
            b: "b624ea25-22-" + i0,
            c: common_vendor.t(getStatusText(task.status)),
            d: task.status === 0 ? 1 : "",
            e: task.status === 1 ? 1 : "",
            f: task.status === 2 ? 1 : "",
            g: "b624ea25-23-" + i0,
            h: "b624ea25-24-" + i0,
            i: common_vendor.t(task.merchantName),
            j: "b624ea25-25-" + i0,
            k: "b624ea25-26-" + i0,
            l: common_vendor.t(task.estimateWeight),
            m: "b624ea25-27-" + i0,
            n: "b624ea25-28-" + i0,
            o: common_vendor.t(task.estimateBucketNum || 0),
            p: "b624ea25-29-" + i0,
            q: "b624ea25-30-" + i0,
            r: common_vendor.t(task.address),
            s: "b624ea25-31-" + i0,
            t: "b624ea25-32-" + i0,
            v: task.status === 0
          }, task.status === 0 ? {
            w: common_vendor.o(($event) => cancelTask(task), task.id),
            x: "b624ea25-33-" + i0,
            y: common_vendor.p({
              size: "mini"
            }),
            z: common_vendor.o(($event) => viewTask(task), task.id),
            A: "b624ea25-34-" + i0,
            B: common_vendor.p({
              size: "mini",
              type: "primary"
            })
          } : task.status === 1 ? {
            D: common_vendor.o(($event) => reportTask(task), task.id),
            E: "b624ea25-35-" + i0,
            F: common_vendor.p({
              size: "mini",
              type: "primary"
            }),
            G: common_vendor.o(($event) => collectTask(task), task.id),
            H: "b624ea25-36-" + i0,
            I: common_vendor.p({
              size: "mini",
              type: "primary"
            })
          } : task.status === 2 ? {
            K: common_vendor.o(($event) => viewTask(task), task.id),
            L: "b624ea25-37-" + i0,
            M: common_vendor.p({
              size: "mini",
              type: "primary"
            })
          } : {}, {
            C: task.status === 1,
            J: task.status === 2,
            N: task.id
          });
        }),
        v: common_vendor.p({
          type: "location",
          size: "16",
          color: "#00B578"
        }),
        w: common_assets._imports_4
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-b624ea25"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/collection/sfDetails.js.map
