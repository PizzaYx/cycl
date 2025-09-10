"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const stores_user = require("../../stores/user.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  _easycom_uni_icons2();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  _easycom_uni_icons();
}
const _sfc_main = {
  __name: "merchant",
  setup(__props) {
    const userStore = stores_user.useUserStore();
    const refreshing = common_vendor.ref(false);
    const showAuthModal = common_vendor.ref(false);
    common_vendor.onMounted(async () => {
      try {
        await userStore.ensureUserInfo();
        common_vendor.index.__f__("log", "at pages/merchant/merchant.vue:115", "用户信息加载完成");
        checkAndShowAuthModal();
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/merchant/merchant.vue:121", "页面初始化失败:", error);
      }
    });
    const checkUserAuthStatus = () => {
      const merchantStatus = userStore.merchantStatus;
      if (merchantStatus === null || merchantStatus === 2) {
        showAuthModal.value = true;
        return false;
      } else if (merchantStatus === 0) {
        common_vendor.index.showToast({
          title: "认证审核中，请耐心等待",
          icon: "none"
        });
        return false;
      } else {
        return true;
      }
    };
    const checkAndShowAuthModal = () => {
      const merchantStatus = userStore.merchantStatus;
      if (merchantStatus === null || merchantStatus === 2) {
        showAuthModal.value = true;
      }
    };
    const getUserInfo = () => {
      if (checkUserAuthStatus()) {
        common_vendor.index.navigateTo({
          url: "/pages/user/user"
        });
      }
    };
    const onRefresh = async () => {
      refreshing.value = true;
      try {
        await userStore.fetchUserInfo();
        common_vendor.index.__f__("log", "at pages/merchant/merchant.vue:177", "刷新完成");
        checkAndShowAuthModal();
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/merchant/merchant.vue:182", "刷新失败:", error);
        common_vendor.index.showToast({
          title: "刷新失败",
          icon: "none"
        });
      } finally {
        refreshing.value = false;
      }
    };
    const closeModal = () => {
      showAuthModal.value = false;
    };
    const handleAuth = () => {
      showAuthModal.value = false;
      common_vendor.index.navigateTo({
        url: "/pages/merchant/certification"
      });
    };
    const quickActions = common_vendor.ref([
      {
        id: "appointment",
        name: "临时预约",
        icon: "/static/shd/lsyy.png",
        url: "/pages/merchant/sydReservation"
        // 临时预约页面
      },
      {
        id: "records",
        name: "收运清单",
        icon: "/static/shd/syjl.png",
        url: "/pages/merchant/sydChecklist"
        // 收运清单页面
      },
      {
        id: "statistics",
        name: "数据统计",
        icon: "/static/shd/sjtj.png",
        url: "/pages/merchant/sydStatistics"
        // 数据统计页面
      },
      {
        id: "certification",
        name: "商户认证",
        icon: "/static/shd/shrz.png",
        url: "/pages/merchant/certification"
        // 商户认证页面
      }
    ]);
    const handleQuickAction = (action) => {
      common_vendor.index.__f__("log", "at pages/merchant/merchant.vue:236", "快捷操作点击:", action.name);
      if (!checkUserAuthStatus()) {
        return;
      }
      if (action.url) {
        common_vendor.index.navigateTo({
          url: action.url,
          fail: (err) => {
            common_vendor.index.__f__("error", "at pages/merchant/merchant.vue:247", "页面跳转失败:", err);
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
    const getAuthStatusText = () => {
      const status = userStore.merchantStatus;
      switch (status) {
        case 0:
          return "认证中";
        case 1:
          return "已认证";
        case 2:
          return "未认证";
        default:
          return "未认证";
      }
    };
    const getAuthTagClass = () => {
      const status = userStore.merchantStatus;
      switch (status) {
        case 0:
          return "auth-pending";
        case 1:
          return "auth-approved";
        case 2:
          return "auth-rejected";
        default:
          return "auth-none";
      }
    };
    const records = common_vendor.ref([
      {
        name: "川味小厨（总店）",
        time: "2023-08-20 14:05:30",
        weight: "1.56kg",
        status: "待确定"
      },
      {
        name: "川味小厨（总店）",
        time: "2023-08-20 14:05:30",
        weight: "1.56kg",
        status: "已完成"
      },
      {
        name: "川味小厨（总店）",
        time: "2023-08-20 14:05:30",
        weight: "1.56kg",
        status: "已完成"
      },
      {
        name: "川味小厨（总店）",
        time: "2023-08-20 14:05:30",
        weight: "1.56kg",
        status: "已完成"
      },
      {
        name: "川味小厨（总店）",
        time: "2023-08-20 14:05:30",
        weight: "1.56kg",
        status: "已完成"
      },
      {
        name: "川味小厨（总店）",
        time: "2023-08-20 14:05:30",
        weight: "1.56kg",
        status: "已完成"
      },
      {
        name: "川味小厨（总店）",
        time: "2023-08-20 14:05:30",
        weight: "1.56kg",
        status: "已完成"
      }
    ]);
    const goToSydAllList = () => {
      if (!checkUserAuthStatus()) {
        return;
      }
      common_vendor.index.navigateTo({
        url: "/pages/merchant/sydAllList"
      });
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_assets._imports_0,
        b: common_vendor.t(common_vendor.unref(userStore).userAvatar),
        c: common_vendor.t(common_vendor.unref(userStore).nickName || "未登录"),
        d: common_vendor.t(common_vendor.unref(userStore).userName || "未设置用户名"),
        e: common_vendor.t(getAuthStatusText()),
        f: common_vendor.n(getAuthTagClass()),
        g: common_vendor.p({
          type: "right",
          size: "30rpx"
        }),
        h: common_vendor.o(getUserInfo),
        i: common_vendor.f(quickActions.value, (action, index, i0) => {
          return {
            a: action.icon,
            b: common_vendor.t(action.name),
            c: action.id,
            d: common_vendor.o(($event) => handleQuickAction(action), action.id)
          };
        }),
        j: common_vendor.o(goToSydAllList),
        k: common_vendor.f(records.value, (item, index, i0) => {
          return {
            a: common_vendor.t(item.name),
            b: common_vendor.t(item.time),
            c: common_vendor.t(item.status),
            d: common_vendor.t(item.weight),
            e: index
          };
        }),
        l: refreshing.value,
        m: common_vendor.o(onRefresh),
        n: showAuthModal.value
      }, showAuthModal.value ? {
        o: common_assets._imports_1$1,
        p: common_assets._imports_2,
        q: common_vendor.o(handleAuth),
        r: common_vendor.o(closeModal),
        s: common_vendor.o(() => {
        }),
        t: common_vendor.o(closeModal)
      } : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-b35646dd"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/merchant/merchant.js.map
