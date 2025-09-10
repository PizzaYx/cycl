"use strict";
const common_vendor = require("../../common/vendor.js");
const api_apis = require("../../api/apis.js");
const stores_user = require("../../stores/user.js");
if (!Array) {
  const _easycom_uni_nav_bar2 = common_vendor.resolveComponent("uni-nav-bar");
  const _easycom_uni_badge2 = common_vendor.resolveComponent("uni-badge");
  const _component_uni_button = common_vendor.resolveComponent("uni-button");
  const _easycom_uni_load_more2 = common_vendor.resolveComponent("uni-load-more");
  (_easycom_uni_nav_bar2 + _easycom_uni_badge2 + _component_uni_button + _easycom_uni_load_more2)();
}
const _easycom_uni_nav_bar = () => "../../uni_modules/uni-nav-bar/components/uni-nav-bar/uni-nav-bar.js";
const _easycom_uni_badge = () => "../../uni_modules/uni-badge/components/uni-badge/uni-badge.js";
const _easycom_uni_load_more = () => "../../uni_modules/uni-load-more/components/uni-load-more/uni-load-more.js";
if (!Math) {
  (_easycom_uni_nav_bar + _easycom_uni_badge + _easycom_uni_load_more)();
}
const _sfc_main = {
  __name: "sydChecklist",
  setup(__props) {
    const tabs = [{ key: "3", value: "预约中" }, { key: "0", value: "进行中" }, { key: "1", value: "已完成" }];
    const currentTab = common_vendor.ref(0);
    const userStore = stores_user.useUserStore();
    const back = () => {
      common_vendor.index.navigateBack();
    };
    function handleTabClick(index) {
      currentTab.value = index;
      allOrderList.value = [];
      pageNum.value = 1;
      getNetwork();
    }
    const bookingBadgeText = common_vendor.ref("0");
    const processingBadgeText = common_vendor.ref("0");
    const pageNum = common_vendor.ref(1);
    const loadingStatus = common_vendor.ref("more");
    const allOrderList = common_vendor.ref([]);
    const getNetwork = async () => {
      var _a;
      try {
        if (pageNum.value > 1) {
          loadingStatus.value = "loading";
        }
        const res = await api_apis.apiGetPlanPage({
          pageNum: pageNum.value,
          merchantId: (_a = userStore.merchant) == null ? void 0 : _a.id,
          status: tabs[currentTab.value].key
          // 使用tabs中的key值
        });
        if (pageNum.value === 1) {
          allOrderList.value = res.data.records || [];
          common_vendor.index.stopPullDownRefresh();
        } else {
          allOrderList.value = [...allOrderList.value, ...res.data.records || []];
        }
        if (res.data.records && res.data.records.length < 10) {
          loadingStatus.value = "nomore";
        } else {
          loadingStatus.value = "more";
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/merchant/sydChecklist.vue:170", "获取数据失败:", error);
        common_vendor.index.stopPullDownRefresh();
        loadingStatus.value = "more";
        if (pageNum.value === 1) {
          allOrderList.value = [];
        }
        common_vendor.index.showToast({
          title: "数据加载失败，请重试",
          icon: "none",
          duration: 2e3
        });
      }
    };
    const onLoadMore = () => {
      if (loadingStatus.value === "nomore")
        return;
      pageNum.value++;
      getNetwork();
    };
    common_vendor.onReachBottom(() => {
      onLoadMore();
    });
    common_vendor.onPullDownRefresh(() => {
      allOrderList.value = [];
      currentTab.value = 0;
      pageNum.value = 1;
      getNetwork();
    });
    common_vendor.onMounted(() => {
      pageNum.value = 1;
      getNetwork();
    });
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
          title: "收运清单"
        }),
        c: common_vendor.f(tabs, (tab, index, i0) => {
          return common_vendor.e({
            a: common_vendor.t(tab.value),
            b: tab.value === "预约中" && bookingBadgeText.value !== "0" && bookingBadgeText.value !== ""
          }, tab.value === "预约中" && bookingBadgeText.value !== "0" && bookingBadgeText.value !== "" ? {
            c: "888270ea-1-" + i0,
            d: common_vendor.p({
              type: "error",
              text: bookingBadgeText.value,
              ["is-dot"]: false,
              absolute: "rightTop",
              offset: [-5, -12]
            })
          } : {}, {
            e: tab.value === "进行中" && processingBadgeText.value !== "0" && processingBadgeText.value !== ""
          }, tab.value === "进行中" && processingBadgeText.value !== "0" && processingBadgeText.value !== "" ? {
            f: "888270ea-2-" + i0,
            g: common_vendor.p({
              type: "error",
              text: processingBadgeText.value,
              ["is-dot"]: false,
              absolute: "rightTop",
              offset: [-5, -12]
            })
          } : {}, {
            h: currentTab.value === index
          }, currentTab.value === index ? {} : {}, {
            i: index,
            j: currentTab.value === index ? 1 : "",
            k: common_vendor.o(($event) => handleTabClick(index), index)
          });
        }),
        d: allOrderList.value.length > 0
      }, allOrderList.value.length > 0 ? {
        e: common_vendor.f(allOrderList.value, (item, index, i0) => {
          return common_vendor.e({
            a: common_vendor.t(item.shopName),
            b: common_vendor.t(item.status),
            c: common_vendor.n(item.status === "预约中" ? "booking" : item.status === "进行中" ? "processing" : "completed"),
            d: common_vendor.t(item.deliveryCount),
            e: common_vendor.t(item.weight),
            f: common_vendor.t(item.carInfo),
            g: common_vendor.t(item.time),
            h: item.status !== "已完成"
          }, item.status !== "已完成" ? {
            i: "888270ea-3-" + i0,
            j: common_vendor.p({
              size: "mini"
            })
          } : {}, {
            k: common_vendor.t(item.status === "预约中" ? "确认收运" : item.status === "进行中" ? "完成收运" : "查看详情"),
            l: "888270ea-4-" + i0,
            m: common_vendor.p({
              size: "mini",
              type: item.status === "预约中" ? "primary" : "default"
            }),
            n: index
          });
        }),
        f: common_vendor.p({
          status: loadingStatus.value,
          ["content-text"]: {
            contentdown: "上拉显示更多",
            contentrefresh: "正在加载...",
            contentnomore: "没有更多数据了"
          }
        })
      } : loadingStatus.value !== "loading" ? {} : {}, {
        g: loadingStatus.value !== "loading"
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-888270ea"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/merchant/sydChecklist.js.map
