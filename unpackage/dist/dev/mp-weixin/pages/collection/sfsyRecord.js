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
  __name: "sfsyRecord",
  setup(__props) {
    const tabs = [{ key: "3", value: "历史记录" }, { key: "0", value: "待处理" }, { key: "1", value: "已完成" }];
    const currentTab = common_vendor.ref(0);
    const currentStatusKey = common_vendor.computed(() => parseInt(tabs[currentTab.value].key));
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
    const getStatusText = (status) => {
      switch (status) {
        case 0:
        case "0":
          return "进行中";
        case 1:
        case "1":
          return "已完成";
        case 2:
        case "2":
          return "无法收运";
        default:
          return "无法收运";
      }
    };
    const getStatusClass = (status) => {
      switch (status) {
        case 0:
          return "processing";
        case 1:
          return "completed";
        case 2:
          return "cancelled";
      }
    };
    const handleCancel = (item) => {
      common_vendor.index.__f__("log", "at pages/collection/sfsyRecord.vue:169", "取消按钮被点击", item);
    };
    const handleViewDetails = (item) => {
      common_vendor.index.__f__("log", "at pages/collection/sfsyRecord.vue:174", "查看详情按钮被点击", item);
    };
    const handleConfirmTransport = async (item) => {
      var _a;
      common_vendor.index.__f__("log", "at pages/collection/sfsyRecord.vue:180", "确认收运按钮被点击", item);
      if (item.merchantConfirm == null) {
        common_vendor.index.showToast({
          title: "请等待师傅确认收运完成!",
          icon: "none",
          dduration: 2500
        });
        return;
      }
      try {
        common_vendor.index.showLoading({
          title: "确认中..."
        });
        const params = {
          merchantId: (_a = userStore.merchant) == null ? void 0 : _a.id,
          id: item.id
        };
        const res = await api_apis.apiGetconfirmPlanById(params);
        common_vendor.index.hideLoading();
        if (res.code === 200 || res.success) {
          common_vendor.index.showToast({
            title: "确认收运成功",
            icon: "success"
          });
          allOrderList.value = [];
          pageNum.value = 1;
          getNetwork();
        } else {
          common_vendor.index.showToast({
            title: res.message || "确认收运失败",
            icon: "none"
          });
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/collection/sfsyRecord.vue:220", "确认收运失败:", error);
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          title: "网络错误，请重试",
          icon: "none"
        });
      }
    };
    const bookingBadgeText = common_vendor.ref("0");
    const processingBadgeText = common_vendor.ref("0");
    const pageNum = common_vendor.ref(1);
    const loadingStatus = common_vendor.ref("more");
    const allOrderList = common_vendor.ref([]);
    const getNetwork = async () => {
      try {
        if (pageNum.value > 1) {
          loadingStatus.value = "loading";
        }
        const res = await api_apis.apiGetDriverPlanPage({
          pageNum: pageNum.value,
          // driverId: userStore.sfmerchant?.id,
          driverId: 3,
          status: currentStatusKey.value
          // 使用当前选中tab对应的整数类型status
        });
        if (pageNum.value === 1) {
          allOrderList.value = res.data.list || [];
          common_vendor.index.stopPullDownRefresh();
        } else {
          allOrderList.value = [...allOrderList.value, ...res.data.list || []];
        }
        if (res.data.list && res.data.list.length < 10) {
          loadingStatus.value = "nomore";
        } else {
          loadingStatus.value = "more";
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/collection/sfsyRecord.vue:275", "获取数据失败:", error);
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
          title: "收运记录"
        }),
        c: common_vendor.f(tabs, (tab, index, i0) => {
          return common_vendor.e({
            a: common_vendor.t(tab.value),
            b: tab.value === "预约中" && bookingBadgeText.value !== "0" && bookingBadgeText.value !== ""
          }, tab.value === "预约中" && bookingBadgeText.value !== "0" && bookingBadgeText.value !== "" ? {
            c: "3d541e56-1-" + i0,
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
            f: "3d541e56-2-" + i0,
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
            a: common_vendor.t(item.merchantName),
            b: common_vendor.t(getStatusText(item.status)),
            c: common_vendor.n(getStatusClass(item.status)),
            d: common_vendor.t(item.estimateWeight),
            e: common_vendor.t(item.estimateBucketNum ?? 0),
            f: common_vendor.t(item.estimateWeight ?? 0),
            g: common_vendor.t(item.weight ?? "暂无"),
            h: common_vendor.t(item.registrationNumber ?? "暂无"),
            i: common_vendor.t(item.arrivalTime ?? "暂无"),
            j: item.status == 0 || item.status == "0"
          }, item.status == 0 || item.status == "0" ? {
            k: common_vendor.o(($event) => handleCancel(item), index),
            l: "3d541e56-3-" + i0,
            m: common_vendor.p({
              size: "mini",
              type: "default"
            }),
            n: common_vendor.o(($event) => handleConfirmTransport(item), index),
            o: "3d541e56-4-" + i0,
            p: common_vendor.p({
              size: "mini",
              type: "primary"
            })
          } : {
            q: common_vendor.o(($event) => handleViewDetails(item), index),
            r: "3d541e56-5-" + i0,
            s: common_vendor.p({
              size: "mini",
              type: "default"
            })
          }, {
            t: index
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
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-3d541e56"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/collection/sfsyRecord.js.map
