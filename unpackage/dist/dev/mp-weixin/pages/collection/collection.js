"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const stores_user = require("../../stores/user.js");
const api_apis = require("../../api/apis.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  _easycom_uni_icons2();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  _easycom_uni_icons();
}
const _sfc_main = {
  __name: "collection",
  setup(__props) {
    const userStore = stores_user.useUserStore();
    const yyNum = common_vendor.ref(0);
    const syNum = common_vendor.ref(0);
    const dqNum = common_vendor.ref(0);
    const refreshing = common_vendor.ref(false);
    common_vendor.onMounted(async () => {
      try {
        const userInfo = await userStore.ensureUserInfo();
        if (userInfo === null) {
          common_vendor.index.__f__("log", "at pages/collection/collection.vue:106", "用户未登录，已跳转到登录页");
          return;
        }
        getMerchantStatistics();
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/collection/collection.vue:114", "页面初始化失败:", error);
      }
    });
    const getMerchantStatistics = async () => {
      var _a;
      const res = await api_apis.apiGetDriverTodayStatistics({
        driverId: (_a = userStore.sfmerchant) == null ? void 0 : _a.id
      });
      if (res.code === 200) {
        dqNum.value = res.data.confirmNum;
        yyNum.value = res.data.weightNum;
        syNum.value = res.data.notConfirmNum;
      }
    };
    const getUserInfo = () => {
      common_vendor.index.navigateTo({
        url: "/pages/user/user"
      });
    };
    const onRefresh = async () => {
      refreshing.value = true;
      try {
        await userStore.fetchUserInfo();
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/collection/collection.vue:165", "刷新失败:", error);
        common_vendor.index.showToast({
          title: "刷新失败",
          icon: "none"
        });
      } finally {
        refreshing.value = false;
      }
    };
    const quickActions = common_vendor.ref([
      {
        id: "appointment",
        name: "今日收运",
        icon: "/static/ssd/syleft.png",
        url: "/pages/collection/sfDetails"
        // 今日详情
      },
      {
        id: "records",
        name: "工单统计",
        icon: "/static/ssd/sydright.png",
        url: ""
        // 收运清单页面
      }
    ]);
    const handleQuickAction = (action) => {
      if (action.url) {
        common_vendor.index.navigateTo({
          url: action.url,
          fail: (err) => {
            common_vendor.index.__f__("error", "at pages/collection/collection.vue:202", "页面跳转失败:", err);
            common_vendor.index.showToast({
              title: "页面暂未开放",
              icon: "none"
            });
          }
        });
      } else {
        common_vendor.index.showToast({
          title: "功能开发中",
          icon: "none"
        });
      }
    };
    const records = common_vendor.ref([]);
    const getRecordStatusText = (status) => {
      switch (status) {
        case 0:
          return "待确认";
        case 1:
          return "已完成";
        case 2:
          return "无需收运";
        default:
          return "未知状态";
      }
    };
    const goToSydAllList = () => {
      common_vendor.index.navigateTo({
        url: "/pages/collection/sfsyRecord"
      });
    };
    return (_ctx, _cache) => {
      var _a;
      return common_vendor.e({
        a: common_assets._imports_4,
        b: common_vendor.t(common_vendor.unref(userStore).userSFAvatar),
        c: common_vendor.t(common_vendor.unref(userStore).nickName || "未登录"),
        d: common_vendor.t(((_a = common_vendor.unref(userStore).sfmerchant) == null ? void 0 : _a.registrationNumber) || "未设置车牌"),
        e: common_vendor.p({
          type: "right",
          size: "30rpx"
        }),
        f: common_vendor.o(getUserInfo),
        g: common_vendor.t(yyNum.value),
        h: common_vendor.t(syNum.value),
        i: common_vendor.t(dqNum.value),
        j: common_vendor.f(quickActions.value, (action, index, i0) => {
          return {
            a: action.icon,
            b: common_vendor.t(action.name),
            c: action.id,
            d: common_vendor.o(($event) => handleQuickAction(action), action.id)
          };
        }),
        k: common_vendor.o(goToSydAllList),
        l: common_vendor.f(records.value, (item, index, i0) => {
          return {
            a: common_vendor.t(item.merchantName),
            b: common_vendor.t(item.status === 1 ? item.arrivalTime : item.appointmentTime),
            c: common_vendor.t(getRecordStatusText(item.status)),
            d: item.status === 1 ? 1 : "",
            e: item.status === 0 ? 1 : "",
            f: item.status === 2 ? 1 : "",
            g: common_vendor.t(item.status === 1 ? item.weight : item.estimateWeight),
            h: index
          };
        }),
        m: records.value.length === 0
      }, records.value.length === 0 ? {} : {}, {
        n: refreshing.value,
        o: common_vendor.o(onRefresh)
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-cd17183b"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/collection/collection.js.map
