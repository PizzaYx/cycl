"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const stores_user = require("../../stores/user.js");
const api_apis = require("../../api/apis.js");
const utils_orderUtils = require("../../utils/orderUtils.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  _easycom_uni_icons2();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  (_easycom_uni_icons + StatusTag)();
}
const StatusTag = () => "../../components/StatusTag/StatusTag.js";
const _sfc_main = {
  __name: "merchant",
  setup(__props) {
    const userStore = stores_user.useUserStore();
    const yyNum = common_vendor.ref(0);
    const syNum = common_vendor.ref(0);
    const wcNum = common_vendor.ref(0);
    const refreshing = common_vendor.ref(false);
    const showAuthModal = common_vendor.ref(false);
    const showMenu = common_vendor.ref(false);
    const toggleMenu = () => {
      showMenu.value = !showMenu.value;
    };
    const closeMenu = () => {
      showMenu.value = false;
    };
    common_vendor.onShow(async () => {
      const userInfo = await userStore.ensureUserInfo();
      if (userInfo === null) {
        common_vendor.index.__f__("log", "at pages/merchant/merchant.vue:183", "用户未登录，已跳转到登录页");
        return;
      }
      if (checkUserAuthStatus()) {
        getMerchantStatistics();
        getMerchantSydList();
      }
    });
    const handleSwitchShop = () => {
      closeMenu();
      const merchants = userStore.merchants;
      if (!merchants || merchants.length <= 1) {
        common_vendor.index.showToast({
          title: "暂无其他商户可切换",
          icon: "none"
        });
        return;
      }
      const itemList = merchants.map((m) => m.name || "未命名商户");
      common_vendor.index.showActionSheet({
        itemList,
        success: function(res) {
          const index = res.tapIndex;
          if (userStore.switchMerchant(index)) {
            if (checkUserAuthStatus()) {
              common_vendor.index.showLoading({ title: "切换中..." });
              Promise.all([
                getMerchantStatistics(),
                getMerchantSydList()
              ]).finally(() => {
                common_vendor.index.hideLoading();
                common_vendor.index.showToast({
                  title: "已切换",
                  icon: "success"
                });
              });
            }
          }
        },
        fail: function(res) {
          common_vendor.index.__f__("log", "at pages/merchant/merchant.vue:231", res.errMsg);
        }
      });
    };
    const handleAddShop = () => {
      closeMenu();
      common_vendor.index.navigateTo({
        url: "/pages/merchant/shCertification?type=add"
      });
    };
    const handleUserInfo = () => {
      closeMenu();
      getUserInfo();
    };
    const showDetail = (item) => {
      if (!checkUserAuthStatus()) {
        return;
      }
      common_vendor.index.__f__("log", "at pages/merchant/merchant.vue:254", "查看详情按钮被点击", item);
      common_vendor.index.navigateTo({
        url: `/pages/merchant/shsyDetail?id=${item.id}&merchantId=${item.merchantId}`
      });
    };
    const getMerchantStatistics = async () => {
      var _a;
      common_vendor.index.__f__("log", "at pages/merchant/merchant.vue:262", "获取商户首页数据统计");
      const merchantId = (_a = userStore.currentMerchant) == null ? void 0 : _a.id;
      if (!merchantId)
        return;
      const res = await api_apis.apiGetMerchantStatistics({
        merchantId
      });
      if (res.code === 200) {
        wcNum.value = res.data.accomplishNum;
        yyNum.value = res.data.reservationNum;
        syNum.value = res.data.underwayNum;
      }
    };
    const getMerchantSydList = async () => {
      var _a;
      const merchantId = (_a = userStore.currentMerchant) == null ? void 0 : _a.id;
      if (!merchantId)
        return;
      const res = await api_apis.apiGetPlanAllPage({
        pageNum: 1,
        pageSize: 5,
        merchantId
      });
      if (res.code === 200) {
        records.value = res.data.list;
      } else {
        common_vendor.index.__f__("error", "at pages/merchant/merchant.vue:293", "商户首页收运记录失败", res.message);
      }
    };
    const checkUserAuthStatus = () => {
      const merchantStatus = userStore.merchantStatus;
      if (merchantStatus === null || merchantStatus === 2) {
        userStore.fetchUserInfo();
        showAuthModal.value = true;
        return false;
      } else if (merchantStatus === 0) {
        common_vendor.index.showToast({
          title: "认证审核中，请耐心等待",
          icon: "none"
        });
        return false;
      } else {
        showAuthModal.value = false;
        getMerchantStatistics();
        getMerchantSydList();
        return true;
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
        if (checkUserAuthStatus()) {
          getMerchantStatistics();
          getMerchantSydList();
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/merchant/merchant.vue:358", "刷新失败:", error);
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
        url: "/pages/merchant/shCertification"
      });
    };
    const quickActions = common_vendor.ref([
      {
        id: "appointment",
        name: "临时预约",
        icon: "/static/shd/lsyy.png",
        url: "/pages/merchant/shReservation"
        // 临时预约页面
      },
      {
        id: "records",
        name: "收运清单",
        icon: "/static/shd/syjl.png",
        url: "/pages/merchant/shChecklist"
        // 收运清单页面
      },
      {
        id: "statistics",
        name: "数据统计",
        icon: "/static/shd/sjtj.png",
        url: "/pages/merchant/shStatistics"
        // 数据统计页面
      },
      {
        id: "certification",
        name: "商户认证",
        icon: "/static/shd/shrz.png",
        url: "/pages/merchant/shCertification"
        // 商户认证页面
      },
      {
        id: "certification",
        name: "合同续签",
        icon: "/static/shd/htxq.png",
        url: "/pages/syContract/syContract"
        // 商户认证页面
      }
    ]);
    const handleQuickAction = (action) => {
      common_vendor.index.__f__("log", "at pages/merchant/merchant.vue:414", "快捷操作点击:", action);
      if (action.name === "商户认证") {
        if (action.url) {
          common_vendor.index.navigateTo({
            url: action.url,
            fail: (err) => {
              common_vendor.index.__f__("error", "at pages/merchant/merchant.vue:422", "页面跳转失败:", err);
              common_vendor.index.showToast({
                title: "页面暂未开放",
                icon: "none"
              });
            }
          });
        }
        return;
      }
      if (!checkUserAuthStatus()) {
        return;
      }
      if (action.url) {
        common_vendor.index.navigateTo({
          url: action.url,
          fail: (err) => {
            common_vendor.index.__f__("error", "at pages/merchant/merchant.vue:443", "页面跳转失败:", err);
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
    const records = common_vendor.ref([]);
    const goToSydAllList = () => {
      if (!checkUserAuthStatus()) {
        return;
      }
      common_vendor.index.navigateTo({
        url: "/pages/merchant/shAllList"
      });
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_assets._imports_0,
        b: common_vendor.t(common_vendor.unref(userStore).userAvatar),
        c: common_vendor.t(common_vendor.unref(userStore).nickName || "昵称未设置"),
        d: common_vendor.unref(userStore).currentMerchant
      }, common_vendor.unref(userStore).currentMerchant ? {
        e: common_vendor.t(common_vendor.unref(userStore).currentMerchant.name)
      } : {}, {
        f: common_vendor.t(getAuthStatusText()),
        g: common_vendor.n(getAuthTagClass()),
        h: common_vendor.o(handleUserInfo, "59"),
        i: common_vendor.p({
          type: "gear-filled",
          size: "20",
          color: "#333"
        }),
        j: common_vendor.o(toggleMenu, "12"),
        k: showMenu.value
      }, showMenu.value ? {
        l: common_vendor.p({
          type: "refreshempty",
          size: "16",
          color: "#333"
        }),
        m: common_vendor.o(handleSwitchShop, "3c"),
        n: common_vendor.p({
          type: "plusempty",
          size: "16",
          color: "#333"
        }),
        o: common_vendor.o(handleAddShop, "6c"),
        p: common_vendor.p({
          type: "person",
          size: "16",
          color: "#333"
        }),
        q: common_vendor.o(handleUserInfo, "68")
      } : {}, {
        r: common_vendor.t(yyNum.value),
        s: common_vendor.t(syNum.value),
        t: common_vendor.t(wcNum.value),
        v: common_vendor.f(quickActions.value, (action, index, i0) => {
          return {
            a: action.icon,
            b: common_vendor.t(action.name),
            c: action.id,
            d: common_vendor.o(($event) => handleQuickAction(action), action.id)
          };
        }),
        w: common_vendor.p({
          type: "right",
          size: "16",
          color: "rgba(19, 19, 19, 0.50)"
        }),
        x: common_vendor.o(goToSydAllList, "d1"),
        y: common_vendor.f(records.value, (item, index, i0) => {
          return {
            a: common_vendor.t(item.merchantName),
            b: common_vendor.t(item.status === 1 ? item.arrivalTime : item.appointmentTime),
            c: "b35646dd-5-" + i0,
            d: common_vendor.p({
              status: item.status
            }),
            e: common_vendor.t(common_vendor.unref(utils_orderUtils.formatWeight)(item.weight)),
            f: item.id,
            g: common_vendor.o(($event) => showDetail(item), item.id)
          };
        }),
        z: records.value.length === 0
      }, records.value.length === 0 ? {} : {}, {
        A: refreshing.value,
        B: common_vendor.o(onRefresh, "df"),
        C: showAuthModal.value
      }, showAuthModal.value ? {
        D: common_assets._imports_1$1,
        E: common_assets._imports_2,
        F: common_vendor.o(handleAuth, "7d"),
        G: common_vendor.o(closeModal, "0b"),
        H: common_vendor.o(() => {
        }, "7c"),
        I: common_vendor.o(closeModal, "6f")
      } : {}, {
        J: common_vendor.o(closeMenu, "57")
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-b35646dd"]]);
_sfc_main.__runtimeHooks = 6;
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/merchant/merchant.js.map
