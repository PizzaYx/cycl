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
    common_vendor.ref("");
    const progressPercentage = common_vendor.computed(() => {
      if (confirmNum === 0 && weightNum === 0)
        return 0;
      common_vendor.index.__f__("log", "at pages/collection/sfDetails.vue:134", "confirmNum:", confirmNum.value, "weightNum:", weightNum.value);
      return Math.round(confirmNum.value / weightNum.value * 100);
    });
    common_vendor.onMounted(async () => {
      try {
        const userInfo = await userStore.ensureUserInfo();
        if (userInfo === null) {
          common_vendor.index.__f__("log", "at pages/collection/sfDetails.vue:144", "用户未登录，已跳转到登录页");
          return;
        }
        getapiGetDriverInfo();
        getapiGetDriverTodayPlan();
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/collection/sfDetails.vue:151", "页面初始化失败:", error);
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
      var _a;
      const res = await api_apis.apiGetDriverTodayPlan({
        driverId: (_a = userStore.sfmerchant) == null ? void 0 : _a.id,
        page: 1,
        pageSize: 10
      });
      if (res.code === 200) {
        taskList.value = res.data.records;
      }
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(_ctx.back),
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
        j: common_assets._imports_0$1,
        k: common_vendor.t(confirmNum.value),
        l: common_assets._imports_1$2,
        m: common_vendor.t(notConfirmNum.value),
        n: common_assets._imports_2$1,
        o: common_vendor.t(weightNum.value),
        p: common_assets._imports_3,
        q: _ctx.weightInput,
        r: common_vendor.o(($event) => _ctx.weightInput = $event.detail.value),
        s: common_vendor.p({
          size: "mini",
          type: "primary"
        }),
        t: common_vendor.t(bucketNum.value),
        v: common_vendor.p({
          type: "location",
          size: "16",
          color: "#00B578"
        }),
        w: common_vendor.p({
          size: "mini"
        }),
        x: common_vendor.p({
          size: "mini",
          type: "primary"
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-b624ea25"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/collection/sfDetails.js.map
